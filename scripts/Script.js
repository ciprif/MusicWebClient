

//get the list of items
var nodeArray;
var previousId;
var previousItemClass;
var xmlHttpForList;
var xmlHttpForItem;
var xmlHttpForPos;
var playback = false;
var musicTimer = null;
var host = "localhost";

function init()
{
    previousId = -1;

    xmlHttpForItem = null;
    xmlHttpForItem = new XMLHttpRequest();
    xmlHttpForItem.onreadystatechange = CallbackStateChangeItem;

    xmlHttpForList = null;
    xmlHttpForList = new XMLHttpRequest();
    xmlHttpForList.onreadystatechange = CallbackStateChangeList;

    xmlHttpForPos = null;
    xmlHttpForPos = new XMLHttpRequest();
    
    var uri = "http://" + host + ":8080/musicWebService/items";
    WebGetRequest(xmlHttpForList, uri, true);
}

function CallbackStateChangeItem()
{
    if(this.status == 200 && this.readyState == 4)
	{
        ParseDOMItem(this.responseXML);
    }
}

function CallbackStateChangeList()
{
    if(this.status == 200 && this.readyState == 4)
    {
        ParseDOMList(this.responseXML);
    }
}

function ParseDOMItem(xmlDoc)
{
    node = xmlDoc.getElementsByTagName("MusicFileTagInfo")[0];

    var i = 0;
    document.getElementById("textPresenter").innerHTML = "";

    for(i = 0; i < node.childNodes.length; i++)
    {
        if (node.childNodes[i].textContent != "") {
            document.getElementById("textPresenter").innerHTML +=
            "<p>" +
            node.childNodes[i].tagName + ": " +
            node.childNodes[i].textContent +
            "</p>"
        }
    }
	
	var pos = previousId;
	pos++;
	
	if(document.getElementById("textPresenter").innerHTML == "")
	{
		document.getElementById("textPresenter").innerHTML = "File info...";
	}
	
    document.getElementById("textPresenter").innerHTML +=
        "<p>Pos. in list: " + pos + "</p>";
}

function ParseDOMList(xmlDoc)
{
    document.getElementById("songs").innerHTML = GetMusicListHtml(xmlDoc);
    $("#songs").find(".li").first().style.cssText += "border-style: none; border-top-left-radius: 15px; border-top-right-radius: 15px";
	$("#songs").find(".li").last().style.cssText += "border-style: none; border-bottom-left-radius: 15px; border-bottom-right-radius: 15px";
}

function GetMusicListHtml(xmlDoc)
{
    nodeArray = xmlDoc.getElementsByTagName("MusicFile");
    var listTextInnerHtml = "";
    for (var i = 0; i < nodeArray.length; i++)
    {
        node = GetNodeValue(i);
        if (node.artist == undefined || node.artist == null || node.artist == "") {
            trackNameArtist = node.name;
        }
        else
            trackNameArtist = node.artist + " : " + node.name;

        if (i % 2 == 0) {
			listTextInnerHtml += "<li ondblclick=\"onListItemClick(this.id)\" id=" +  i + " class=\"niceListEven\">" + trackNameArtist + "</li>";
        }
        else {
            listTextInnerHtml += "<li ondblclick=\"onListItemClick(this.id)\" id=" +  i + " class=\"niceListOdd\">" + trackNameArtist + "</li>";
        }
    }

	return listTextInnerHtml;
}

function WebGetRequest(xmlHttpRequest, uri, async, param)
{
    if (param != null && param != undefined)
    {
        xmlHttpRequest.open("GET", uri + param, async); 
    }
    else
    {
        xmlHttpRequest.open("GET", uri, async);
    }
    xmlHttpRequest.send();
}

function WebPostRequest(xmlHttpRequest, uri, async, param)
{
    if (param != null && param != undefined)
    {
        xmlHttpRequest.open("POST", uri + param, async);
    }
    else
    {
        xmlHttpRequest.open("POST", uri, async);
    }
    xmlHttpRequest.send();
}

function onListItemClick(id)
{
    updateListItemUI(id);

    //jump to file request
    WebPostRequest(xmlHttpForList, "http://" + host + ":8080/musicWebService/items/jump/", true, GetNodeValue(id).id);
    //get mp3 file info request
    WebGetRequest(xmlHttpForItem, "http://" + host + ":8080/musicWebService/items/", true, GetNodeValue(id).id);
}

function GetNodeValue(nodeID)
{
    var nodeInfo = new Object;
    var node = nodeArray[nodeID];

    nodeInfo.id = node.getElementsByTagName("ID")[0].textContent;
    
    if(node.getElementsByTagName("Artist")[0] != undefined)
        nodeInfo.artist = node.getElementsByTagName("Artist")[0].textContent;
    else
        nodeInfo.artist = node.getElementsByTagName("Filename")[0].textContent;
    
    if(node.getElementsByTagName("Name")[0] != undefined)
        nodeInfo.name = node.getElementsByTagName("Name")[0].textContent;
    else
        nodeInfo.name = node.getElementsByTagName("Fullpath")[0].textContent;

    return nodeInfo;
}

function updateListItemUI(id)
{
    //the jump to file case
    if (previousItemClass != undefined && previousItemClass != null)
    {
        document.getElementById(previousId).className = previousItemClass;
    }

    previousId = id;
    previousItemClass = document.getElementById(id).className;

    if (playback == false) {
        document.getElementById("playpauseButton").src = "images/pauseButton.png";
    }

    togglePlayback(true);
    document.getElementById(id).className = "niceListClicked";
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