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
    console.log($("#s4").offset().top - $(window).scrollTop() )
    if ($("#s4").offset().top - $(window).scrollTop() <= 2 ) {
        $("header").css({backgroundColor: "rgb(248,221,100,1)"})
    } else if ($("#s3").offset().top - $(window).scrollTop() <= 2 ) {
        $("header").css({backgroundColor: "rgb(145,183,112,1)"})
    } else if ($("#s2").offset().top - $(window).scrollTop() <= 2 ) {
        $("header").css({backgroundColor: "rgb(175,216,208,1)"})
    } else {
        $("header").css({backgroundColor: "rgb(255,255,255,1)"})
    }
}

$(window).on('scroll', function (e) {
  adaptHeader()
})

$('#house').on("click", function () {
    $('.clouds__left').addClass("clouds__left_active")
    $('.clouds__right').addClass("clouds__right_active")
    console.log("WOW")
    setTimeout(() => {
        document.getElementById("house-link").click();
    }, 1000)
})

adaptHeader()
