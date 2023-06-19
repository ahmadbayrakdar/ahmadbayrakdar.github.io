$(document).ready(function() {
    "use strict";
    console.log('hello');
    $('#slider-carousel').carouFredSel({
        responsive:true,
        width:'100%',
        circular:true,
        scroll:{
          Items:1,
          duration:500,
            pauseOnHover:true
        },
        auto:true,
        items:
            {
                visible:{
                    min:1,
                    max:1
                },
                height:"variable"
            },
        pagination:{
            container:".sliderpager",
            pageAnchorBuilder:false
        }
    });

    $(window).ready(function(){
        var top = $(window).scrollTop();
        if(top>=60){
            $("header").addClass('secondary');
        }
        else if($("header").hasClass('secondary')){
            $("header").removeClass('secondary');
        }
    });

    $(window).scroll(function(){
        var top = $(window).scrollTop();
        if(top>=60){
            $("header").addClass('secondary');
        }
        else if($("header").hasClass('secondary')){
            $("header").removeClass('secondary');
        }
    });

    $(".click-to-send").click(function(){
        $(".send-message").slideToggle(1000);
    })

    $(".contact").click(function(){
        $(".send-message").slideDown(1000);
    })

});
