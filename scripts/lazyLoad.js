var uri = "http://" + host + ":8080/musicWebService/GetItemsPaged?page={0}&pageSize={1}";
var pageSize = "10";
var currentPage;

$(function () {
    init();
    currentPage = 1;
    populateNextSongs();
})

function populateNextSongs()
{
    $.ajax(
    {
        url: uri.format(currentPage, pageSize)
    }).done(function (result) {
        musicList = GetMusicListHtml(result);
        $("#songs").append(musicList);
        currentPage++;
        populateNextSongs();
        // it will stop when we get an error from the server
    });
}

// setup string format
String.prototype.format = String.prototype.f = function() {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};
