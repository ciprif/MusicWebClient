function detectmob() {
 if( navigator.userAgent.match(/Android/i)
 || navigator.userAgent.match(/webOS/i)
 || navigator.userAgent.match(/iPhone/i)
 || navigator.userAgent.match(/iPad/i)
 || navigator.userAgent.match(/iPod/i)
 || navigator.userAgent.match(/BlackBerry/i)
 || navigator.userAgent.match(/Windows Phone/i)
 ){
    return true;
  }
 else {
    return false;
  }
}

function resetCss()
{
    if (adminMode) {
        $("#playpauseButton").removeClass("buttonUser");
        $("#refreshButton").removeClass("buttonUser");
        $("#prevButton").removeClass("buttonUser");
        $("#nextButton").removeClass("buttonUser");
        $("#loginbutton").removeClass("buttonImg");
        $("#progressBarContainer").removeClass("progressBarContainerUser");
        $("#playBar").removeClass("playBarUser");
        $("#infoBox").removeClass("infoBoxUser");
        $("#title").removeClass("titleUser");
        $("#listContainer").removeClass("listContainerSmallUser");
        $("#textFilter").removeClass("filterInputUser");

        $("#playpauseButton").addClass("buttonImg");
        $("#refreshButton").addClass("buttonImg");
        $("#prevButton").addClass("buttonImg");
        $("#nextButton").addClass("buttonImg");
        $("#loginbutton").addClass("buttonUser");
        $("#playBar").addClass("playBar");
        $("#progressBarContainer").addClass("progressBarContainer");
        $("#title").addClass("title");
        $("#listContainer").addClass("listContainerSmall");
        $("#textFilter").addClass("filterInput");
    }
}