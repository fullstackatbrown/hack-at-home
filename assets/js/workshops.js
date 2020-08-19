let sections = {
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false
}

let numSections = Object.keys(sections).length
let largeMode = $(window).width() > 800

function triggerMenu(n) {
    if (!sections[n]) {
        if (n + 1 <= numSections) {
            sections[n + 1] = false
            $("#underline" + (n + 1)).stop(true, false).animate({left: $("#workshop" + (n + 1)).width()}, 120, "linear")
        }
        if (n - 1 >= 0) {
            sections[n - 1] = false
            $("#underline" + (n - 1)).stop(true, false).animate({left: $("#workshop" + (n - 1)).width()}, 120, "linear")
        }
        $("#underline" + n).css({left: "0px"})
        $("#underline" + n).css({right: "auto"})
        $("#underline" + n).stop(true, false).animate({right: "0px"}, 120, "linear")
        sections[n] = true
    }
}

function closeAll(animate) {
    for (const [n, _] of Object.entries(sections)) {
        sections[n] = false
        if (animate) {
            $("#underline" + (n)).stop(true, false).animate({left: $("#workshop" + (n)).width()}, {
                duration: 120,
                queue: false
            })
        } else {
            $("#underline" + (n)).css({left: $("#workshop" + (n)).width()})
        }
    }
}

function checkUnderline() {
    console.log($("#workshop3").offset().top - $(".block__workshop").offset().top)
    if ($("#workshop6").offset().top - $(".block__workshop").offset().top <= 10) {
        triggerMenu(6)
    } else if ($("#workshop5").offset().top - $(".block__workshop").offset().top <= 10) {
        triggerMenu(5)
    } else if ($("#workshop4").offset().top - $(".block__workshop").offset().top <= 10) {
        triggerMenu(4)
    } else if ($("#workshop3").offset().top - $(".block__workshop").offset().top <= 10) {
        triggerMenu(3)
    } else if ($("#workshop2").offset().top - $(".block__workshop").offset().top <= 10) {
        triggerMenu(2)
    } else if ($("#workshop1").offset().top - $(".block__workshop").offset().top <= 10) {
        triggerMenu(1)
    }
}

$(".block__workshop")[0].onscroll = function () {
    checkUnderline()
}

$("#btn1").on("click", () => {
    $(".block__workshop").animate({right: "0px"}, {duration: 300, queue: false})
    checkUnderline()
    if ($(window).width() >= 800) {
        $(".block__workshop").animate({
            scrollTop: $("#workshop1").offset().top - $(".block__workshop").offset().top + $(".block__workshop").scrollTop()
        }, "fast", "linear")
    } else {
        $("#workshop1").css({display: "block"})
        $("#workshop1").animate({opacity: 1})
        $("body").css({overflow: "hidden"})
    }
})
$("#btn2").on("click", () => {
    $(".block__workshop").animate({right: "0px"}, {duration: 300, queue: false})
    checkUnderline()
    if ($(window).width() >= 800) {
        $(".block__workshop").animate({
            scrollTop: $("#workshop2").offset().top - $(".block__workshop").offset().top + $(".block__workshop").scrollTop()
        }, "fast", "linear")
    } else {
        $("#workshop2").css({display: "block"})
        $("#workshop2").animate({opacity: 1})
        $("body").css({overflow: "hidden"})
    }
})
$("#btn3").on("click", () => {
    $(".block__workshop").animate({right: "0px"}, {duration: 300, queue: false})
    checkUnderline()
    if ($(window).width() >= 800) {
        $(".block__workshop").animate({
            scrollTop: $("#workshop3").offset().top - $(".block__workshop").offset().top + $(".block__workshop").scrollTop()
        }, "fast", "linear")
    } else {
        $("#workshop3").css({display: "block"})
        $("#workshop3").animate({opacity: 1})
        $("body").css({overflow: "hidden"})
    }
})
$("#btn4").on("click", () => {
    $(".block__workshop").animate({right: "0px"}, {duration: 300, queue: false})
    checkUnderline()
    if ($(window).width() >= 800) {
        $(".block__workshop").animate({
            scrollTop: $("#workshop4").offset().top - $(".block__workshop").offset().top + $(".block__workshop").scrollTop()
        }, "fast", "linear")
    } else {
        $("#workshop4").css({display: "block"})
        $("#workshop4").animate({opacity: 1})
        $("body").css({overflow: "hidden"})
    }
})
$("#btn5").on("click", () => {
    $(".block__workshop").animate({right: "0px"}, {duration: 300, queue: false})
    checkUnderline()
    if ($(window).width() >= 800) {
        $(".block__workshop").animate({
            scrollTop: $("#workshop5").offset().top - $(".block__workshop").offset().top + $(".block__workshop").scrollTop()
        }, "fast", "linear")
    } else {
        $("#workshop5").css({display: "block"})
        $("#workshop5").animate({opacity: 1})
        $("body").css({overflow: "hidden"})
    }
})
$("#btn6").on("click", () => {
    $(".block__workshop").animate({right: "0px"}, {duration: 300, queue: false})
    checkUnderline()
    if ($(window).width() >= 800) {
        $(".block__workshop").animate({
            scrollTop: $("#workshop6").offset().top - $(".block__workshop").offset().top + $(".block__workshop").scrollTop()
        }, "fast", "linear")
    } else {
        $("#workshop6").css({display: "block"})
        $("#workshop6").animate({opacity: 1})
        $("body").css({overflow: "hidden"})
    }
})

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


