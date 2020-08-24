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
