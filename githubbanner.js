// JavaScript-Github-web-banner
// by heipei


var myBadge = document.createElement("div");
myBadge.setAttribute("class","outline");

var myUserRepo = document.createElement("div");
myUserRepo.setAttribute("class","username");

var myLink = document.createElement("a");
myLink.setAttribute("href","http://github.com/" + USERNAME + "/" + REPO);
myLink.setAttribute("class","username");
myLink.appendChild(document.createTextNode(USERNAME + "/" + REPO));
myUserRepo.appendChild(myLink);

var myCommitMessage = document.createElement("div");
myCommitMessage.setAttribute("class","commitmessage");
var myDiffLine = document.createElement("div");
myDiffLine.setAttribute("class","diffline");

var myDiffStat = document.createElement("div");
myDiffStat.setAttribute("class","diffstat");

jQuery.getJSON("http://github.com/api/v1/json/" + USERNAME + "/" + REPO + "/commit/" + BRANCH + "?callback=?",
	function(data) {
		MyEval = eval ( data );
		
		var myImage = document.createElement("img");
		myImage.setAttribute("src","http://www.gravatar.com/avatar/" + hex_md5(MyEval.commit.committer.email) + "?s=60");
		myImage.className = "gravatar";
		myDiffLine.appendChild(myImage);
		
		var myLink = document.createElement("a");
		myLink.setAttribute("href",MyEval.commit.url);
		myLink.appendChild(document.createTextNode(" " + MyEval.commit.id.truncate(10,"")));
		myDiffLine.appendChild(document.createTextNode(MyEval.commit.committer.name + " "));
		mySpan = document.createElement("span");
		mySpan.appendChild(document.createTextNode("committed"));
		
		var myDate = document.createElement("span");
		var myParsedDate = Date.parse(MyEval.commit.committed_date).toString("yyyy-MM-dd @ HH:mm");
		myDate.appendChild(document.createTextNode(myParsedDate));
		
		myDiffLine.appendChild(mySpan);
		myDiffLine.appendChild(myLink);
		myDiffLine.appendChild(document.createElement("span").appendChild(document.createTextNode(" on ")));
		myDiffLine.appendChild(myDate);
		
		myCommitMessage.appendChild(document.createTextNode("\"" + MyEval.commit.message + "\""));

		/* myAdded = document.createElement("span");
		myAdded.id = "diffadded";
		myAdded.appendChild(document.createTextNode(" added"));
		myRemoved = document.createElement("span");
		myRemoved.appendChild(document.createTextNode(" removed"));
		myRemoved.id = "diffremoved";
		myChanged = document.createElement("span");
		myChanged.appendChild(document.createTextNode(" changed"));
		myChanged.id = "diffchanged";
		myDiffStat.appendChild(document.createTextNode(" (" + MyEval.commit.added.length));
		myDiffStat.appendChild(myAdded);
		myDiffStat.appendChild(document.createTextNode(", " + MyEval.commit.removed.length));
		myDiffStat.appendChild(myRemoved);
		myDiffStat.appendChild(document.createTextNode(", " + MyEval.commit.modified.length));
		myDiffStat.appendChild(myChanged);
		myDiffStat.appendChild(document.createTextNode(")")); */
		myDiffStat.innerHTML = "( " + MyEval.commit.added.length + " <span id=\"diffadded\">added<\/span>, " + MyEval.commit.removed.length + " <span id=\"diffremoved\">removed<\/span>, " + MyEval.commit.modified.length + " <span id=\"diffchanged\">changed<\/span>)";
	});

myBadge.appendChild(myUserRepo);
myBadge.appendChild(myDiffLine);
myBadge.appendChild(myCommitMessage);
myBadge.appendChild(myDiffStat);
myContainer = document.getElementById("container");
myContainer.appendChild(myBadge);
