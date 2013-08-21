
//get the list of items
var nodeArray;
var previousId = -1;
var previousItemClass;
var xmlHttpForList;
var xmlHttpForItem;
var playback = false;

function init()
{
    xmlHttpForItem = null;
    xmlHttpForItem = new XMLHttpRequest();
    xmlHttpForItem.onreadystatechange = CallbackStateChangeItem;

    xmlHttpForList = null;
    xmlHttpForList = new XMLHttpRequest();
    xmlHttpForList.onreadystatechange = CallbackStateChangeList;

    var uri = "http://192.168.1.104:8080/musicWebService/items";

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

    for(i = 0; i < node.childNodes.length - 1; i++)
    {
        if (node.childNodes[i].textContent != "") {
            document.getElementById("textPresenter").innerHTML +=
            "<p>" +
            node.childNodes[i].tagName + ": " +
            node.childNodes[i].textContent +
            "</p>"
        }
    }

    document.getElementById("textPresenter").innerHTML +=
        "<p>" +
        node.childNodes[i].tagName + ": " +
        node.childNodes[i].textContent +
        "</p>";
}

function ParseDOMList(xmlDoc)
{
    nodeArray = xmlDoc.getElementsByTagName("MusicFile");
    for (var i = 0; i < nodeArray.length; i++)
    {
        if (i % 2 == 0) {
            document.getElementById("songs").innerHTML +=
            "<li ondblclick=\"onListItemClick(this.id)\" id=" +
            i + " class=\"niceListEven\">" +
            nodeArray[i].childNodes[1].childNodes[0].nodeValue + "</li>";
        }
        else {
            document.getElementById("songs").innerHTML +=
            "<li ondblclick=\"onListItemClick(this.id)\" id=" +
            i + " class=\"niceListOdd\">" +
            nodeArray[i].childNodes[1].childNodes[0].nodeValue + "</li>";
        }
    }
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
    //the init case
    if (previousId == -1) {
        previousId = id;
        previousItemClass = document.getElementById(id).className;
        playback = true;
        //jump to file request
        WebPostRequest(xmlHttpForList, "http://192.168.1.104:8080/musicWebService/items/jump/", true, GetNodeValue(id).id);
        //get mp3 file info request
        WebGetRequest(xmlHttpForItem, "http://192.168.1.104:8080/musicWebService/items/", true, GetNodeValue(id).id);
    }
    //the jump to file case
    else if(previousId != id)
    {
        document.getElementById(previousId).className = previousItemClass;
        previousId = id;
        previousItemClass = document.getElementById(id).className;
        playback = true;
        //jump to file request
        WebPostRequest(xmlHttpForList, "http://192.168.1.104:8080/musicWebService/items/jump/", true, GetNodeValue(id).id);
        //get mp3 file info request
        WebGetRequest(xmlHttpForItem, "http://192.168.1.104:8080/musicWebService/items/", true, GetNodeValue(id).id);
    }
    //the playback state changed case
    else
    {
        playback = !playback;
        if(playback)
        {
            WebPostRequest(xmlHttpForList, "http://192.168.1.104:8080/musicWebService/items/Pause", true);
        }
        else
        {
            WebPostRequest(xmlHttpForList, "http://192.168.1.104:8080/musicWebService/items/Play", true);
        }
    }
    document.getElementById(id).className = "niceListClicked";
}

function GetNodeValue(nodeID)
{
    var nodeInfo = new Object;
    var node = nodeArray[nodeID];
    
    nodeInfo.id = node.getElementsByTagName("ID")[0].childNodes[0].nodeValue;
    nodeInfo.fileName = node.getElementsByTagName("Filename")[0].childNodes[0].nodeValue;
    nodeInfo.fullPath = node.getElementsByTagName("Fullpath")[0].childNodes[0].nodeValue;

    return nodeInfo;
}