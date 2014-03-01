
function onListItemClick(id)
{
    updateListItemUI(id);

    //jump to file request
    WebPostRequest(xmlHttpForList, "http://" + host + ":8080/musicWebService/items/enqueue/", true, GetNodeValue(id).id);
    //get mp3 file info request
    WebGetRequest(xmlHttpForItem, "http://" + host + ":8080/musicWebService/items/", true, GetNodeValue(id).id);
}

function nextButtonClicked()
{
    var val = new Number(previousId);
    val++;

    if (val == nodeArray.length) {
        onListItemClick(0);
    }
    else {
        onListItemClick(val);
    }
}

function prevButtonClicked()
{
    var val = new Number(previousId);
    val--;

    if (val == -1) {
        val = nodeArray.length;
        val--;
        onListItemClick(val);
    }
    else {
        onListItemClick(val);
    }
}

function playpauseButtonClicked()
{
    if (playback) {
        WebPostRequest(xmlHttpForList, "http://" + host + ":8080/musicWebService/items/Pause", true);
        togglePlayback(false);
        document.getElementById("playpauseButton").src = "images/playButton.png";
    }
    else {
        WebPostRequest(xmlHttpForList, "http://" + host + ":8080/musicWebService/items/Play", true);
        togglePlayback(true);
        document.getElementById("playpauseButton").src = "images/pauseButton.png";
    }
}

function updateProgressBar()
{
    WebGetRequest(xmlHttpForPos, "http://" + host + ":8080/musicWebService/items/Pos", false);

    var value = xmlHttpForPos.responseXML.getElementsByTagName("pos")[0].textContent;
    var currentId = xmlHttpForPos.responseXML.getElementsByTagName("id")[0].textContent;

    if (currentId != previousId){
        updateListItemUI(currentId);
    }
    else {
        if (value > 4) {
            document.getElementById("progressBar").style.width = value + "%";
        }
        else {
            document.getElementById("progressBar").style.width = "4%";
        }
    }
}

function togglePlayback(newVal)
{
    if (newVal == false) {
        clearInterval(musicTimer);
        playback = false;
    }
    else {
        clearInterval(musicTimer);
        musicTimer = setInterval(updateProgressBar, 500);
        playback = true;
    }
}

function refreshButtonClicked()
{
    var uri = "http://" + host + ":8080/musicWebService/items";
    WebGetRequest(xmlHttpForList, uri, true);
}

function progressBarClicked(event)
{
    var xValue = event.layerX;
    var percentage = (xValue * 100) / document.getElementById("progressBarContainer").clientWidth;
    WebPostRequest(xmlHttpForPos, "http://" + host + ":8080/musicWebService/items/jumpToPos/", false, percentage);
}