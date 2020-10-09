let offset = 0
const more = $(".more-arrow")
$(".schedule").on('scroll', (e) => {
    offset = $(".schedule")[0].scrollHeight-($(".schedule").scrollTop()+$(".schedule").height())
    console.log(offset)
    if (offset <= 10) {
        more.addClass("inactive")
    } else {
        more.removeClass("inactive")
    }
})

more.on('click', () => {
    const more = $(".more-arrow")
    more.scrollTop(more.scrollTop() + 40)
    console.log(more.scrollTop() + 40)
})
