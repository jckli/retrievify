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
    
    $.ajax({
        type: "POST",
        url:  "/ajax/data_top_artists",
        data: JSON.stringify(localStorage.getItem("artistDict")),
        contentType: "application/json; charset=utf-8",
        cache: false,
        processData: false,
        success: function(data) {
            if (data.status == "Success") {
                for (var i = 0; i < data.topArtists.length; i++) {
                    $.ajax({
                        async: false,
                        type: "POST",
                        url:  "/ajax/search",
                        data: JSON.stringify({"topArtists": data.topArtists[i], "type": "artist"}),
                        contentType: "application/json; charset=utf-8",
                        cache: false,
                        processData: false,
                        success: function(data2) {
                            if (data2.status == "Success") {
                                $(".top-artists > div > .list").append(
                                    `<div class="artist item">
                                        <img src="${data2.results.artists.items[0].images[0].url}" width="150" height="150"/>
                                        <div class="artist-info">
                                            <h2 id="artist-name">${data2.topArtists.name}</h2>
                                            <p id="artist-genre">${data2.results.artists.items[0].genres[0]}  - ${msToTime(data.topArtists[i].time)}</p>
                                        </div>
                                    </div>`
                                );
                            }
                        }
                    });
                }
            }
        },
    });

    $.ajax({
        type: "POST",
        url:  "/ajax/data_top_songs",
        data: JSON.stringify(localStorage.getItem("songDict")),
        contentType: "application/json; charset=utf-8",
        cache: false,
        processData: false,
        success: function(data) {
            if (data.status == "Success") {
                var k = 0;
                for (var i = 0; i < 10; i++) {
                    if (data.topSongs[k].Artist == "Unknown Artist" || data.topSongs[k].Song == "Unknown Artist") {
                        i--;
                        k++;
                        continue;
                    } else {
                        $.ajax({
                            async: false,
                            type: "POST",
                            url:  "/ajax/search",
                            data: JSON.stringify({"topSongs": data.topSongs[k], "type": "track"}),
                            contentType: "application/json; charset=utf-8",
                            cache: false,
                            processData: false,
                            success: function(data2) {
                                if (data2.status == "Success") {
                                    $(".top-songs > div > .list").append(
                                        `<div class="song item">
                                            <img src="${data2.results.tracks.items[0].album.images[0].url}" width="150" height="150"/>
                                            <div class="song-info">
                                                <h2 id="song-title">${data2.topSongs.Song}</h2>
                                                <p id="song-artist">${data2.topSongs.Artist} - ${msToTime(data.topSongs[k].Time)}</p>
                                            </div>
                                        </div>`
                                    );
                                    k++;
                                }
                            }
                        });
                    }
                }
            }
        },
    });
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