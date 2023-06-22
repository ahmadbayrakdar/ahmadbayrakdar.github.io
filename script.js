// nav acative style start
$('.hoverBarContainer .hoverBarBody .tabLink').click(function(){
    tabLink = $(this).attr('id').slice(-2)
    $(this).addClass('active')
    $(this).siblings('.tabLink').removeClass('active')

    $(`#tabContent${tabLink}`).addClass('showTab')
    $(`#tabContent${tabLink}`).siblings('.tabContainer').removeClass('showTab')

})
// nav acative style end
// typing animation start
document.addEventListener('DOMContentLoaded', function() {
    const paragraphs = [
      "Front End Developer",
      "Designer",
      "Animator"
    ];

    const titleElement = document.getElementById('subTitle');
    let currentParagraphIndex = 0;
    let index = 0;

    function typeTitle() {
      if (index < paragraphs[currentParagraphIndex].length) {
        titleElement.innerHTML += paragraphs[currentParagraphIndex].charAt(index);
        index++;
        setTimeout(typeTitle, 100);
      } else {
        setTimeout(eraseTitle, 1000);
      }
    }

    function eraseTitle() {
      if (index >= 0) {
        titleElement.innerHTML = paragraphs[currentParagraphIndex].substring(0, index);
        index--;
        setTimeout(eraseTitle, 50);
      } else {
        currentParagraphIndex = (currentParagraphIndex + 1) % paragraphs.length;
        setTimeout(typeTitle, 500);
      }
    }

    typeTitle();
  });
// typing animation end
// dynamic years of experience start
const experienceElement = document.getElementById('experience');
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
var yearsOfExperience = 8; // Replace with your desired value
if(currentYear > 2020){
    yearsOfExperience = currentYear - 2017;
}else{
    yearsOfExperience = 5;
}
experienceElement.textContent = yearsOfExperience + '+ yrs';
// dynamic years of experience end
// triggering links by scrolling start
var scrollValue = 0;
function triggerButtonClickOnScroll() {
    // Define the scroll positions at which to trigger the button clicks
    const scrollPositions = [0, 1, 2, 3];

    // Select the buttons you want to trigger
    // Event handler for the scroll event
        // Check if the current scroll position matches any of the defined positions
        scrollPositions.forEach(function(position, index) {
            // console.log(position, index);
            // console.log(scrollValue)
            var contentNumber = scrollValue + 1;
            if(position == scrollValue){
                // console.log(contentNumber);
                const link = $(`#tabLink0${contentNumber}`);
                // console.log(`#tabLink0${contentNumber}`);
                link.addClass('active');
                link.siblings('.tabLink').removeClass('active')

                // console.log(`#tabContent${contentNumber}`)
                $(`#tabContent0${contentNumber}`).addClass('showTab')
                $(`#tabContent0${contentNumber}`).siblings('.tabContainer').removeClass('showTab')
            }

        // tabLink = links.attr('id').slice(-2)
        // links.addClass('active')
        // links.siblings('.tabLink').removeClass('active')
        // $(`#tabContent${tabLink}`).addClass('showTab')
        // $(`#tabContent${tabLink}`).siblings('.tabContainer').removeClass('showTab')
    });

}
var projectsScrollValue = 0;
var projectsElement = document.getElementById('projectsScroll');
function changeSection(event){
  projectsScrollValue = projectsElement.scrollTop;
  // console.log('Scroll value:', projectsScrollValue);
  if ((event.originalEvent.deltaY > 0  || event.which == 39) && scrollValue < 3) {
      // Scrolling down
      scrollValue++;
      // Additional code for scrolling down
  } else if((event.originalEvent.deltaY < 3 && projectsScrollValue == 0 || event.which == 37) && scrollValue > 0){
      // Scrolling up
      scrollValue--;
      // Additional code for scrolling up
  }
}
$(window).on('wheel', function(event) {
  changeSection(event);
    triggerButtonClickOnScroll();
});
$(document).keydown(function(event) {
  changeSection(event);
  triggerButtonClickOnScroll();
});
// triggering links by scrolling end
// mouse movement light effect start
// Create a light element.
var light = document.createElement("div");
light.classList.add("lightEffect");
function mouseMovement(e) {
    // Get the mouse position.
    var x = e.clientX;
    var y = e.clientY;

    // Set the light's position to the mouse position.
    light.style.left = x + "px";
    light.style.top = y + "px";
    // Add the light to the document body.
    // document.body.appendChild(light);
    document.querySelector('.backgroundMain').appendChild(light);

}

// Attach the mouse movement event listener.
document.addEventListener("mousemove", mouseMovement);
// mouse movement light effect end
// autoplay audio start
function anyWhereUsersFirstClick() {
  // console.log('clicked');
  // $('.hideThisOnStart').removeClass('hideThisOnStart');
  const audio = document.getElementById("myAudio");
  const playPromise = audio.play();
}
// autoplay audio end
// popup onstart start
$('#popupOnStart .button').click(() => {
  $('#popupOnStart .button').addClass('clickedButton');
  anyWhereUsersFirstClick();
  setTimeout(() => {
    $('#popupOnStart').addClass('hidePopup');
  }, 400)
})
// popup onstart end
