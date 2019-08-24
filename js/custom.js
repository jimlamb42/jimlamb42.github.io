 /*--------------------------[Custome Style Css File]-------------------------------
       Project       :  Foxira
       Version       :  1.1
       Author        :  Mohamed Hany
       Primary Use   :  Portfolio
-----------------------------------------------------------------------------------*/

  /* global  $,  jquery, console, alert*/
  $(function(){
    "use strict";
     var rNav           = $(".right-nav"),
         hInfo          = $(".home .info"),
         home           = $(".home"),
         navBtn         = $(".slide-nav-btn"),
         navBtnActive   = "slide-nav-btn-active",
         nav            = $(".slide-nav"),
         navActive      = "slide-nav-active",
         rNavSpan       = $('.right-nav ul li i'),
         up             = $('.up i'),
         body           = $("html, body");
        
    //-------------- Right-Nav [position]--------------//
    rNav.css("top", (home.height() - rNav.height()) / 2)
    //-------------- Home-info [position]--------------//
    hInfo.css("top",(home.height() - hInfo.height()) / 2)


    //------- start slide-nav [btn action and style]-----//
    navBtn.on('click',function(){
    $(this).toggleClass(navBtnActive);
    nav.toggleClass(navActive)})

    $(document).on('scroll',function() {
    var y = $(this).scrollTop();
    if (y > 200) {
    rNavSpan.css("background","rgba(0, 0, 0, 0.54)");
    navBtn.css("background","rgba(0, 0, 0, 0.54)");
    nav.css("background","rgba(0, 0, 0, 0.8)");
    } else {
    rNavSpan.css("background","rgba(255, 255, 255, 0.05)");
    navBtn.css("background","rgba(255, 255, 255, 0.05)");
    nav.css("background","rgba(0, 0, 0, 0.38)");
    }
    });
    //------------ [end slide-nav-btnt]---------//

    //------- materialize carousel -------------//
    $('.carousel').carousel();
    //----------- modal [services-section] -----//
    $('.modal').modal()
    body.on('click',function(){
    $(this).css("overflow","auto")
    })
    //------- arrow up to site -------------//
    up.on('click',function() {
    body.animate({
    scrollTop: -690
    }, 1500)});
    // up to page fadeIn fadeOut
    $(document).on('scroll',function() {
    var y = $(this).scrollTop();
    if (y > 800) {
    up.css("right","2%");
    } else {
    up.css("right","-200px");
    }
    });
    /*--------------[blog-carousel]-----------*/
     $('.blog .owl-carousel').owlCarousel({
    loop:true,
    autoplay:true,
    margin:15,
    responsive:{
          0:{items:1,},
        600:{items:2,},
       1000:{items:3}
    }})
     

     // [smoothScroll]
     $('a').smoothScroll();
    
}); //end function


 
// -------on load actions [preloader - write effect - body scroll]-----//
$(window).on('load',function(){
    $('.preloader').fadeOut(1000); // set duration in brackets    
    $("body").css("overflow-y","auto");
    $(".slide-nav-btn").css("right","2%");
     //------- [start type.js script]-----//
          $(".write").typed({
            strings: ["Hey, My Name Is Jhon Do ", //the line #1
                      "Web Designer And <br> Front End Developer", //the line #2
                      "I Live In United States",//the line #3
                      "This Is My Personal Site",//the line #4
                      "Don't Hesitate To <br> Contact Me"//the line #5
                     ],
            
            typeSpeed: 100,
            loop: true,
        });
          $(".typed-cursor").hide()
    // -------[end type.js script] ------ //
});






