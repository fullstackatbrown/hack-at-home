let offset = 0
const moreSchedule = $("#more-schedule"),
    moreCharities = $("#more-charities"),
    schedule = $(".schedule"),
    charities = $(".charities")
schedule.on('scroll', () => {
    offset = schedule[0].scrollHeight - (schedule.scrollTop() + schedule.height())
    if (offset <= 10) {
        moreSchedule.addClass("inactive")
    } else {
        moreSchedule.removeClass("inactive")
    }
})

moreSchedule.on('click', () => {
    schedule.animate({
        scrollTop: schedule.scrollTop() + schedule.height()
    }, {duration: 300, queue: true, easing: "swing"})
})

charities.on('scroll', () => {
    offset = charities[0].scrollHeight - (charities.scrollTop() + charities.height())
    if (offset <= 10) {
        moreCharities.addClass("inactive")
    } else {
        moreCharities.removeClass("inactive")
    }
})

moreCharities.on('click', () => {
    charities.animate({
        scrollTop: charities.scrollTop() + charities.height()
    }, {duration: 300, queue: true, easing: "swing"})
})
