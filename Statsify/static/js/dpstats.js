$( document ).ready(function() {
    var songjson = JSON.parse(localStorage.getItem("songDict"));
    var firstTime = localStorage.getItem("firstTime");
    var totalTime = 0;
    for (const time in songjson.Total.All) {
        totalTime += songjson.Total.All[time];
    }
    var convertedTotalTime = msToTime(totalTime);
    $(".all > div > .time").text(convertedTotalTime);
    $(".all > div > .first-time > i").append(firstTime);

    var recentYearTime = 0;
    var recentYear = 0;
    for (const time in songjson.Total.All) {
        if (time > recentYear) {
            recentYear = time;
            recentYearTime = songjson.Total.All[time];
        }
    }
    var convertedRecentYearTime = msToTime(recentYearTime);
    $(".year > div > .time").text(convertedRecentYearTime);
    $(".year-select > .dropdown > .dropdown-menu > li:first-child > a").text(recentYear);
    $(".year-select > .dropdown > .dropdown-menu > li:first-child > a").attr("id", recentYear);
    $(".year-select > .dropdown > .btn").text(recentYear);
    for (const time in songjson.Total.All) {
        if (time == recentYear) {
            continue;
        } else {
            $(".year-select > .dropdown > .dropdown-menu").append(
                `<li><a class="dropdown-item ttl-year" id="${time}">${time}</a></li>`
            );
        }
    }
});

$(".year-select > .dropdown > .dropdown-menu").on("click", ".ttl-year", function() {
    $(".ttl-year").removeClass("active");
    var btn = $(this).parents(".dropdown").find('.btn')
    var value = $("span", $(this))
    btn.text("")
    btn.attr("value", value.attr("value"))
    btn.append(
        `<span>${$(this).text()}</span>`
    );
    $(this).addClass("active");
    var selection = $(this).attr("id");
    unconvertedTime = JSON.parse(localStorage.getItem("songDict")).Total.All[selection];
    convertedTime = msToTime(unconvertedTime);
    $(".year > div > .time").text(convertedTime);
});

function msToTime(ms) {
    let seconds = ms / 1000;
    const hours = parseInt( seconds / 3600 );
    seconds = seconds % 3600;
    const minutes = parseInt( seconds / 60 );
    seconds = Math.round(seconds % 60);
    return hours + " hrs, " + minutes + " mins, " + seconds + " secs";
}