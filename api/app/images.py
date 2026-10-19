"""Image ingestion: validate, orient, strip metadata, re-encode to WebP (full + thumbnail)."""
from __future__ import annotations

import io
import os
import uuid
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageOps

# Peak memory while processing is ~10 bytes per pixel for RGBA (~6 for RGB): 30 MP is ~300 MB worst case,
# which has to fit in the service's MemoryMax (see deploy/portfolio-api.service). 30 MP covers 24 MP cameras.
MAX_IMAGE_PIXELS = 30_000_000
MAX_LONG_EDGE = 2400
THUMB_LONG_EDGE = 800
WEBP_QUALITY = 82
ALLOWED_FORMATS = {"JPEG", "MPO", "PNG", "WEBP", "GIF"}  # MPO = JPEG with extra frames (some phones)

# Pillow raises DecompressionBombError at 2x this; process_image() rejects anything above 1x itself.
Image.MAX_IMAGE_PIXELS = MAX_IMAGE_PIXELS


class ImageError(ValueError):
    """The upload is not an acceptable image. The message is safe to show to clients."""


@dataclass
class ProcessedImage:
    full: bytes
    thumb: bytes
    width: int
    height: int


def _encode(img: Image.Image, quality: int) -> bytes:
    buf = io.BytesIO()
    img.save(buf, format="WEBP", quality=quality, method=4)  # no exif= argument: metadata is dropped
    return buf.getvalue()


def process_image(data: bytes) -> ProcessedImage:
    if not data:
        raise ImageError("Empty file")
    try:
        probe = Image.open(io.BytesIO(data))  # Pillow itself raises DecompressionBombError above 2x the limit
        fmt = probe.format
        if fmt not in ALLOWED_FORMATS:
            raise ImageError("Unsupported image type (use JPEG, PNG, WebP or GIF)")
        width, height = probe.size
        if width <= 0 or height <= 0 or width * height > MAX_IMAGE_PIXELS:
            raise ImageError("Image dimensions are too large")
        probe.verify()  # structural check; the image must be reopened afterwards

        img = Image.open(io.BytesIO(data))
        img.seek(0)  # animated GIF/WebP: first frame only
        if fmt in ("JPEG", "MPO"):
            img.draft(img.mode, (MAX_LONG_EDGE, MAX_LONG_EDGE))  # decode at 1/2, 1/4, 1/8 scale when that is enough
        img.load()
    except ImageError:
        raise
    except Image.DecompressionBombError:
        raise ImageError("Image dimensions are too large") from None
    except Exception:  # corrupt / truncated / not an image
        raise ImageError("File is not a valid image") from None

    try:
        # Work on one buffer: in-place orientation and resize, so peak memory stays near 2x the decoded image.
        ImageOps.exif_transpose(img, in_place=True)
        if img.mode in ("LA", "PA") or (img.mode == "P" and "transparency" in img.info):
            img = img.convert("RGBA")
        elif img.mode not in ("RGB", "RGBA"):  # convert() copies even for the same mode, so skip these
            img = img.convert("RGB")
        img.thumbnail((MAX_LONG_EDGE, MAX_LONG_EDGE), Image.Resampling.LANCZOS)  # never upscales
        full = _encode(img, WEBP_QUALITY)
        size = img.size
        img.thumbnail((THUMB_LONG_EDGE, THUMB_LONG_EDGE), Image.Resampling.LANCZOS)
        thumb = _encode(img, 80)
    except Exception:
        raise ImageError("Image could not be processed") from None
    return ProcessedImage(full=full, thumb=thumb, width=size[0], height=size[1])


def store_image(media_dir: Path, processed: ProcessedImage) -> tuple[str, str]:
    """Write both files with random names; returns (file, thumb) basenames."""
    media_dir.mkdir(parents=True, exist_ok=True)
    stem = uuid.uuid4().hex
    names = (f"{stem}.webp", f"{stem}-thumb.webp")
    written: list[Path] = []
    try:
        for name, blob in zip(names, (processed.full, processed.thumb)):
            path = media_dir / name
            path.write_bytes(blob)
            written.append(path)
            try:
                os.chmod(path, 0o644)  # nginx (another user) serves /media/
            except OSError:
                pass
    except Exception:
        remove_files(media_dir, [p.name for p in written])
        raise
    return names


def remove_files(media_dir: Path, names: list[str]) -> None:
    for name in names:
        if not name or "/" in name or "\\" in name or name.startswith("."):
            continue
        try:
            (media_dir / name).unlink()
        except FileNotFoundError:
            pass
        except OSError:
            pass
