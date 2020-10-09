let offset = 0
const moreSchedule = $("#more-schedule"),
    moreCharities = $("#more-charities"),
    schedule = $(".schedule"),
    charities = $(".charities")
$(".schedule").on('scroll', (e) => {
    offset = schedule[0].scrollHeight - (schedule.scrollTop() + schedule.height())
    console.log(offset)
    if (offset <= 10) {
        moreSchedule.addClass("inactive")
    } else {
        moreSchedule.removeClass("inactive")
    }
})

moreCharities.on('click', () => {
    charities.animate({
        scrollTop: charities.scrollTop() + charities.height()
    }, {duration: 300, queue: true, easing: "swing"})
})
