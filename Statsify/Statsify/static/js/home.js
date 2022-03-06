// maybe do a cache for the top songs and stuff?
$(".ts").click(function(){
    $(".ts").removeClass("active");
    var btn = $(this).parents(".dropdown").find('.btn')
    var value = $("span", $(this))
    btn.text("")
    btn.attr("value", value.attr("value"))
    btn.append(
        `<span>${$(this).text()}</span>`
    );
    $(this).addClass("active");
    var selection = $(this).attr("id");
    $.get("/ajax/top_songs?type=" + selection, function(data) {
        songs = $("div.top-song-item");
        for (var i = 0; i < songs.length; i++) {
            $(songs[i]).find("img").attr("src", data.tracks[i].image);
            $(songs[i]).find(".song-info").find("#song-name").text(data.tracks[i].name);
            $(songs[i]).find(".song-info").find("#song-artist").text(data.tracks[i].artists);
        }
    }); 
});

$(".ta").click(function(){
    $(".ta").removeClass("active");
    var btn = $(this).parents(".dropdown").find('.btn')
    var value = $("span", $(this))
    btn.text("")
    btn.attr("value", value.attr("value"))
    btn.append(
        `<span>${$(this).text()}</span>`
    );
    $(this).addClass("active");
    var selection = $(this).attr("id");
    $.get("/ajax/top_artists?type=" + selection, function(data) {
        artists = $("div.top-artist-item");
        for (var i = 0; i < artists.length; i++) {
            $(artists[i]).find("img").attr("src", data[i].images[0].url);
            $(artists[i]).find(".artist-info").find("#artist-name").text(data[i].name);
            $(artists[i]).find(".artist-info").find("#artist-genre").text(data[i].genres[0]);
        }
    }); 
});