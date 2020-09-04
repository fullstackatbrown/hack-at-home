let sections = {
    1: false,
    2: false,
    // 3: false,
    // 4: false,
    // 5: false,
    // 6: false
}

let numSections = Object.keys(sections).length
let largeMode = $(window).width() > 800

function triggerMenu(n) {
    if (!sections[n]) {
        if (n + 1 <= numSections) {
            sections[n + 1] = false
            $("#underline" + (n + 1)).stop(true, false).animate({left: $("#workshop" + (n + 1)).width()}, {
                duration: 250,
                easing: "swing",
                queue: false
            })
        }
        if (n - 1 >= 0) {
            sections[n - 1] = false
            $("#underline" + (n - 1)).stop(true, false).animate({left: $("#workshop" + (n - 1)).width()}, {
                duration: 250,
                easing: "swing",
                queue: false
            })
        }
        $("#underline" + n).css({left: "0px"})
        $("#underline" + n).css({right: "auto"})
        $("#underline" + n).stop(true, false).animate({right: "0px"}, {duration: 250, easing: "swing", queue: false})
        sections[n] = true
    }
}

function closeAll(animate) {
    for (const [n, _] of Object.entries(sections)) {
        sections[n] = false
        if (animate) {
            $("#underline" + (n)).stop(true, false).animate({left: "100%"}, {
                duration: 250,
                queue: false
            })
        } else {
            $("#underline" + (n)).css({left: $("#workshop" + (n)).width()})
        }
    }
}

function checkUnderline() {
    // if ($("#workshop6").offset().top - $(".block__workshop").offset().top <= 10) {
    //     triggerMenu(6)
    // } else if ($("#workshop5").offset().top - $(".block__workshop").offset().top <= 10) {
    //     triggerMenu(5)
    // } else if ($("#workshop4").offset().top - $(".block__workshop").offset().top <= 10) {
    //     triggerMenu(4)
    // } else if ($("#workshop3").offset().top - $(".block__workshop").offset().top <= 10) {
    //     triggerMenu(3)
    // } else
    console.log($("#workshop2").offset().top - $(".block__workshop").offset().top)
    if ($("#workshop2").offset().top - $(".block__workshop").offset().top <= 2) {
        triggerMenu(2)
    } else if ($("#workshop1").offset().top - $(".block__workshop").offset().top <= 2) {
        triggerMenu(1)
    }
}

function navWorkshop(n) {
    closeAll(true)
    // checkUnderline()
    $(".block__workshop").animate({right: "0px"}, {duration: 300, queue: false})
    if ($(window).width() >= 800) {
        $(".block__workshop").scrollTop($("#workshop" + n).offset().top - $(".block__workshop").offset().top + $(".block__workshop").scrollTop())
    } else {
        $("#workshop" + n).css({display: "block"})
        $("#workshop" + n).animate({opacity: 1})
        $("body").css({overflow: "hidden"})
    }
    checkUnderline()
}

$(".block__workshop")[0].onscroll = function () {
    checkUnderline()
}

$("#btn1").on("click", () => {
    navWorkshop(1)
})
$("#btn2").on("click", () => {
    navWorkshop(2)
})
// $("#btn3").on("click", () => {
//     navWorkshop(3)
// })
// $("#btn4").on("click", () => {
//     navWorkshop(4)
// })
// $("#btn5").on("click", () => {
//     navWorkshop(5)
// })
// $("#btn6").on("click", () => {
//     navWorkshop(6)
// })

$(".btn__close").on("click", () => {
    if (largeMode) {
        $(".block__workshop").animate({right: "-50vw"}, {duration: 300, queue: false})
        closeAll(true)
    } else {
        for (const [n, _] of Object.entries(sections)) {
            $("#workshop" + n).animate({opacity: 0}, {
                queue: false, done: () => {
                    $("#workshop" + n).css({display: "none"})
                }
            })
        }
        $("body").css({overflow: "scroll"})
    }
})

$(window).on("resize", () => {
    if ($(window).width() <= 800) {
        if (largeMode) {
            for (const [n, _] of Object.entries(sections)) {
                $("#workshop" + n).css({display: "none", opacity: 0})
            }
            closeAll(false)
            largeMode = false
        }
    } else {
        if (!largeMode) {
            for (const [n, _] of Object.entries(sections)) {
                $("#workshop" + n).css({display: "block", opacity: 1})
            }
            $(".block__workshop").css({right: "-50vw"})
            closeAll(false)
            largeMode = true
        }
    }
})


