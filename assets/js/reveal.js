// ScrollReveal().reveal('.pg__center');
// ScrollReveal().reveal('h1');
window.sr = ScrollReveal({ reset: false });
sr.reveal('.r', {
    distance: '60px',
    duration: 1000,
    scale: 1,
});
$("<img/>").attr('src', 'assets/images/landscape.png').on('load', function() {
    $("#s1").animate({opacity: 1}, 400)
})

