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

function adaptHeader() {
    if ($("#s10").offset().top - $(window).scrollTop() <= 2 ) {
        $("header").css({backgroundColor: "#AFD8D0", color: "black"})
        $('.header__hamburger span').css({backgroundColor: "black"})
    } else if ($("#s9").offset().top - $(window).scrollTop() <= 2 ) {
        $("header").css({backgroundColor: "#C13633", color: "white"})
        $('.header__hamburger span').css({backgroundColor: "white"})
    } else if ($("#s8").offset().top - $(window).scrollTop() <= 2 ) {
        $("header").css({backgroundColor: "#F9DD64", color: "black"})
        $('.header__hamburger span').css({backgroundColor: "black"})
    } else if ($("#s7").offset().top - $(window).scrollTop() <= 2 ) {
        $("header").css({backgroundColor: "#EF993A", color: "white"})
        $('.header__hamburger span').css({backgroundColor: "white"})
    } else if ($("#s6").offset().top - $(window).scrollTop() <= 2 ) {
        $("header").css({backgroundColor: "#294291", color: "white"})
        $('.header__hamburger span').css({backgroundColor: "white"})
    } else if ($("#s5").offset().top - $(window).scrollTop() <= 2 ) {
        $("header").css({backgroundColor: "#EB9B83", color: "black"})
        $('.header__hamburger span').css({backgroundColor: "black"})
    } else if ($("#s4").offset().top - $(window).scrollTop() <= 2 ) {
        $("header").css({backgroundColor: "#24441E", color: "white"})
        $('.header__hamburger span').css({backgroundColor: "white"})
    } else if ($("#s3").offset().top - $(window).scrollTop() <= 2 ) {
        $("header").css({backgroundColor: "#91b770", color: "white"})
        $('.header__hamburger span').css({backgroundColor: "white"})
    } else if ($("#s2").offset().top - $(window).scrollTop() <= 2 ) {
        $("header").css({backgroundColor: "#afd8d0", color: "black"})
        $('.header__hamburger span').css({backgroundColor: "black"})
    } else {
        $("header").css({backgroundColor: "#ffffff", color: "black"})
        $('.header__hamburger span').css({backgroundColor: "black"})
    }
}

$(window).on('scroll', function (e) {
  adaptHeader()
})

$('.btn__house').on("click", function () {
    $('.clouds__left').addClass("clouds__left_active")
    $('.clouds__right').addClass("clouds__right_active")
    setTimeout(() => {
        document.getElementById("house-link").click();
    }, 1000)
})

adaptHeader()
