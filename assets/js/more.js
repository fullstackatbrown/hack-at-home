let offset = 0
const more = $(".more-arrow"),
    schedule = $(".schedule")
$(".schedule").on('scroll', (e) => {
    offset = schedule[0].scrollHeight-(schedule.scrollTop()+schedule.height())
    console.log(offset)
    if (offset <= 10) {
        more.addClass("inactive")
    } else {
        more.removeClass("inactive")
    }
})

more.on('click', () => {
    schedule.animate({
        scrollTop: schedule.scrollTop() + schedule.height()
    }, {duration: 300, queue: true, easing: "swing"})
})
