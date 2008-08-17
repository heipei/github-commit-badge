// JavaScript-Github-web-banner
// by heipei


Badges.each(function(badgeData) {

jQuery.getJSON("http://github.com/api/v1/json/" + badgeData["username"] + "/" + badgeData["repo"] 
	+ "/commit/" + badgeData["branch"] + "?callback=?", function(data) {
		
		var myUser = badgeData["username"];
		var myRepo = badgeData["repo"];
		var myEval = eval ( data );
		
		var myBadge = document.createElement("div");
		myBadge.setAttribute("class","outline");

		var myUserRepo = document.createElement("div");
		myUserRepo.setAttribute("class","username");

		var myLink = document.createElement("a");
		myLink.setAttribute("href","http://github.com/" + myUser + "/" + myRepo);
		myLink.setAttribute("class","username");
		myLink.appendChild(document.createTextNode(myUser + "/" + myRepo));
		myUserRepo.appendChild(myLink);

		var myCommitMessage = document.createElement("div");
		myCommitMessage.setAttribute("class","commitmessage");
		var myDiffLine = document.createElement("div");
		myDiffLine.setAttribute("class","diffline");

		var myDiffStat = document.createElement("div");
		myDiffStat.setAttribute("class","diffstat");
		
		var myImage = document.createElement("img");
		myImage.setAttribute("src","http://www.gravatar.com/avatar/" + hex_md5(myEval.commit.committer.email) + "?s=60");
		myImage.className = "gravatar";
		myDiffLine.appendChild(myImage);
		
		var myLink = document.createElement("a");
		myLink.setAttribute("href",myEval.commit.url);
		myLink.appendChild(document.createTextNode(" " + myEval.commit.id.truncate(10,"")));
		myDiffLine.appendChild(document.createTextNode(myEval.commit.committer.name + " "));
		var mySpan = document.createElement("span");
		mySpan.appendChild(document.createTextNode("committed"));
		
		var myDate = document.createElement("span");
		var myParsedDate = Date.parse(myEval.commit.committed_date).toString("yyyy-MM-dd @ HH:mm");
		myDate.appendChild(document.createTextNode(myParsedDate));
		
		myDiffLine.appendChild(mySpan);
		myDiffLine.appendChild(myLink);
		myDiffLine.appendChild(document.createElement("span").appendChild(document.createTextNode(" on ")));
		myDiffLine.appendChild(myDate);
		
		myCommitMessage.appendChild(document.createTextNode("\"" + myEval.commit.message + "\""));
		myDiffStat.innerHTML = "(" + myEval.commit.added.length + " <span id=\"diffadded\">added<\/span>, " 
			+ myEval.commit.removed.length + " <span id=\"diffremoved\">removed<\/span>, " 
			+ myEval.commit.modified.length + " <span id=\"diffchanged\">changed<\/span>)";
		myBadge.appendChild(myUserRepo);
		myBadge.appendChild(myDiffLine);
		myBadge.appendChild(myCommitMessage);
		myBadge.appendChild(myDiffStat);
		var myContainer = document.getElementById("container");
		myContainer.appendChild(myBadge);
});
});
