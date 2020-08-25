// prevents multiple successive clicks
let ready = true;
$('.header__hamburger').on("click", function () {
    if (ready) {
        // reset ready status on timer
        ready = false;
        setTimeout(function () {
            ready = true;
        }, 500);
        $(".header__hamburger").toggleClass('open');
        $(".header__vertical").toggleClass('open');
    }
});

$(window).on("scroll", function (e) {
    if ($("#s3").offset().top - $(window).scrollTop() <= 0 ) {
        $("header").css({backgroundColor: "rgb(248,221,100)"})
    } else if ($("#s2").offset().top - $(window).scrollTop() <= 0 ) {
        $("header").css({backgroundColor: "rgb(175,216,208,0.5)"})
    } else {
        $("header").css({backgroundColor: "rgb(255,255,255,0.5)"})
    }
})
