<?php
// Get the form inputs
$name = $_POST['name'];
$email = $_POST['email'];
$options = $_POST['options'];

// Prepare the email content
$to = 'ahmad.berkdar.sy@gmail.com';
$subject = 'Work Request Form Submission';
$message = "Name: $name\n";
$message .= "Email: $email\n";
$message .= "Selected Options:\n";
foreach ($options as $option) {
  $message .= "- $option\n";
}
$headers = "From: $email\r\n";

// Send the email
$mailSent = mail($to, $subject, $message, $headers);

// Check if the email was sent successfully
if ($mailSent) {
  echo 'Email sent successfully.';
} else {
  echo 'Error: Unable to send email.';
}
?>
