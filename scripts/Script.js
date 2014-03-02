//get the list of items
var nodeArray;
var previousId;
var previousItemClass;
var xmlHttpForList;
var xmlHttpForItem;
var xmlHttpForPos;
var playback = false;
var musicTimer = null;
var host = "10.1.1.8";
var adminMode = false;
var isMobile = false;
var viewQueueMode = false;

function init()
{
    isMobile = detectmob();
    previousId = -1;

    xmlHttpForItem = null;
    xmlHttpForItem = new XMLHttpRequest();
    xmlHttpForItem.onreadystatechange = CallbackStateChangeItem;

    xmlHttpForList = null;
    xmlHttpForList = new XMLHttpRequest();
    xmlHttpForList.onreadystatechange = CallbackStateChangeList;

    xmlHttpForPos = null;
    xmlHttpForPos = new XMLHttpRequest();
    
    //var uri = "http://" + host + ":8080/musicWebService/items";
    //WebGetRequest(xmlHttpForList, uri, true);
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
        if (node.childNodes[i].textContent != "" && node.childNodes[i].tagName != "Duration") {
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
    $("#songs").find(".li").first().addClass("listRounded");
	$("#songs").find(".li").last().addClass("listRounded");
}

function GetMusicListHtml(xmlDoc)
{
    nodeArray = xmlDoc.getElementsByTagName("MusicFile");
    var listTextInnerHtml = "";
    for (var i = 0; i < nodeArray.length; i++)
    {
        node = GetNodeValue(i);
        if (node.artist == undefined || node.artist == null || node.artist == "") {
            trackNameArtist = node.title;
        }
        else
            trackNameArtist = node.artist + " : " + node.title;
        if (isMobile) {
            if (i % 2 == 0) {
                listTextInnerHtml += "<li onclick=\"onListItemClick(this.id)\" id=" + node.id + " class=\"niceListEven\">" + trackNameArtist + "</li>";
            }
            else {
                listTextInnerHtml += "<li onclick=\"onListItemClick(this.id)\" id=" + node.id + " class=\"niceListOdd\">" + trackNameArtist + "</li>";
            }
        }
        else
        {
            if (i % 2 == 0) {
                listTextInnerHtml += "<li ondblclick=\"onListItemClick(this.id)\" id=" + node.id + " class=\"niceListEven\">" + trackNameArtist + "</li>";
            }
            else {
                listTextInnerHtml += "<li ondblclick=\"onListItemClick(this.id)\" id=" + node.id + " class=\"niceListOdd\">" + trackNameArtist + "</li>";
            }
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

function GetNodeValue(nodeID)
{
    var nodeInfo = new Object;
    var node = nodeArray[nodeID];

    nodeInfo.id = node.getElementsByTagName("ID")[0].textContent;
    
    if(node.getElementsByTagName("Artist")[0] != undefined)
        nodeInfo.artist = node.getElementsByTagName("Artist")[0].textContent;
    else
        nodeInfo.artist = node.getElementsByTagName("Filename")[0].textContent;
    
    if(node.getElementsByTagName("Title")[0] != undefined)
        nodeInfo.title = node.getElementsByTagName("Title")[0].textContent;
    else
        nodeInfo.title = node.getElementsByTagName("Fullpath")[0].textContent;

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

function loginButtonClicked()
{
     document.getElementById("popup").style.display = "block";
     document.getElementById("pass").value = "";
}

function switchListsButtonClicked()
{
    //set lists visibility  
    viewQueueMode = !viewQueueMode;
    if (viewQueueMode) {
        $("#queuedSongs").removeClass("notVisibleElement");
        $("#queuedSongs").addClass("visibleElement");

        $("#songs").removeClass("visibleElement");
        $("#songs").addClass("notVisibleElement");

        $("#textFilter").removeClass("visibleElement");
        $("#textFilter").addClass("notVisibleElement");
        
        $("#switchListButton").attr("src","images/playlistButton.png");
    }
    else{
        $("#songs").removeClass("notVisibleElement");
        $("#songs").addClass("visibleElement");

        $("#queuedSongs").removeClass("visibleElement");
        $("#queuedSongs").addClass("notVisibleElement");

        $("#textFilter").removeClass("notVisibleElement");
        $("#textFilter").addClass("visibleElement");

        $("#switchListButton").attr("src","images/queueListButton.png");
    }
    
    //update queued list
    if (viewQueueMode) {
        var uri = "http://" + host + ":8080/musicWebService/GetQueuedItems";
        $.ajax(
        {
            url: uri.format(currentPage, pageSize)
        }).done(function (result) {
            musicList = GetMusicListHtml(result);
            $("#queuedSongs").empty();
            $("#queuedSongs").append(musicList);
        });
    }
}


function loginDone()
{
    document.getElementById("popup").style.display = "none";
    var password = document.getElementById("pass").value;
    adminMode = true;
    resetCss();
}

function loginCancel()
{
    document.getElementById("popup").style.display = "none";
}