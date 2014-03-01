var uri = "http://" + host + ":8080/musicWebService/GetItemsPaged?page={0}&pageSize={1}";
var pageSize = "10";
var currentPage;

$(function () {
    init();
    currentPage = 1;
    populateNextSongs();
    listFilter();
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

function listFilter() {
     // OVERWRITES old selecor
    jQuery.expr[':'].contains = function(a, i, m) {
        return jQuery(a).text().toUpperCase()
            .indexOf(m[3].toUpperCase()) >= 0;
    };

    $("#textFilter").change(function () {
        var filter = $(this).val(); // get the value of the input, which we filter on
        if (filter) {
            $("#songs").find("li:not(:contains(" + filter + "))").slideUp();
            $("#songs").find("li:contains(" + filter + ")").slideDown();

        } else {
            $("#songs").find("li").slideDown();
        }

    }).keyup(function () {
        // fire the above change event after every letter
        $(this).change();
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
