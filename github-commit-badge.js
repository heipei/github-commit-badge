// github-commit-badge.js (c) 2008 by Johannes 'heipei' Gilger
//
// The source-code should be pretty self-explanatory. Also look at the 
// style.css to customize the badge.

// for truncating the commit-id and commit-message in place
function truncate(string, length, truncation) {
	length = length || 30;
	truncation = (typeof truncation == 'undefined') ? '...' : truncation;
	return string.length > length ?
		string.slice(0, length - truncation.length) + truncation : string;
};

function parseDate(dateTime) {	// thanks to lachlanhardy
	var timeZone = 1;	// TODO: This doesn't really work

	dateTime = dateTime.substring(0,19) + "Z";
	var theirTime = dateTime.substring(11,13);
	var ourTime = parseInt(theirTime) + 7 + timeZone;
	if (ourTime > 24) {
		ourTime = ourTime - 24;
	};
	dateTime = dateTime.replace("T" + theirTime, "T" + ourTime);
	return dateTime;
};


var DEFAULT_BRANCH_NAME = 'master';
var COMMIT_MSG_MAX_LENGTH = 100;
var COMMIT_DISPLAYED_ID_LENGTH = 10;
var SHOW_FILES_TXT = 'Show files';
var HIDE_FILES_TXT = 'Hide files';
var GRAVATAR_URL_PREFIX = 'http://www.gravatar.com/avatar/';
var GRAVATAR_IMG_SIZE = 60;


function mainpage () {
	$.each(Badges, function(i, badgeData) {
        var branchName = ((typeof badgeData.branch == 'undefined' || badgeData.branch.length == 0) ? DEFAULT_BRANCH_NAME : badgeData.branch);
        var urlData = "http://github.com/api/v1/json/" + badgeData.username + "/" + badgeData.repo 
	        + "/commit/" + branchName + "?callback=?";

	$.getJSON(urlData, function(data) {
		    var myUser = badgeData.username;
		    var myRepo = badgeData.repo.replace(/\./g, '-');;
		    var myEval = eval (data);
		    var myUser = badgeData["username"];
		    var myRepo = badgeData["repo"]
		    var myEval = eval ( data );
		var added = myEval.commit.added || [];
		var modified = myEval.commit.modified || [];
		var removed = myEval.commit.removed || [];
		
		// outline-class is used for the badge with the border
		var myBadge = document.createElement("div");
		myBadge.setAttribute("class","outline");

		// the username/repo
		var myUserRepo = document.createElement("div");
		myUserRepo.setAttribute("class","username");

		var myLink = document.createElement("a");
		    myLink.setAttribute("href","http://github.com/" + myUser + "/" + badgeData["repo"]);
		    myLink.appendChild(document.createTextNode(myUser + "/" + badgeData["repo"]));
		myUserRepo.appendChild(myLink);

		var request_url = "https://api.github.com/repos/" + badgeData["username"] + "/" + badgeData["repo"] + "/watchers" + "?callback=?"
		$.getJSON(request_url, function(data) {
			followers = document.createElement("span");
			followers.setAttribute("class", "followers");
			followers.innerHTML = " (" + data.data.length + " following)";
			myUserRepo.appendChild(followers);
		});


		// myDiffLine is the "foo committed xy on date" line 
		var myDiffLine = document.createElement("div");
		myDiffLine.setAttribute("class", "diffline");

		// the image-class uses float:left to sit left of the commit-message
		var myImage = document.createElement("img");
		    myImage.setAttribute("src",GRAVATAR_URL_PREFIX + hex_md5(myEval.commit.committer.email) + "?s=" + GRAVATAR_IMG_SIZE);
		myImage.setAttribute("class","gravatar");
		    myImage.setAttribute("alt",myUser);
		myDiffLine.appendChild(myImage);
		
		var myLink = document.createElement("a");
		myLink.setAttribute("href","http://github.com" + myEval.commit.url);
		myLink.setAttribute("class", "badge");
		    myLink.appendChild(document.createTextNode(" " + truncate(myEval.commit.id,COMMIT_DISPLAYED_ID_LENGTH,"")));
		myDiffLine.appendChild(document.createTextNode(myEval.commit.committer.name + " committed "));
		
		var myDate = document.createElement("span");
		var dateTime = parseDate(myEval.commit.committed_date);
		myDate.setAttribute("class", "text-date");
		myDate.setAttribute("title", dateTime);
		myDate.appendChild(document.createTextNode(dateTime));
		
		myDiffLine.appendChild(myLink);
		myDiffLine.appendChild(document.createTextNode(" about "));
		myDiffLine.appendChild(myDate);
		
		// myCommitMessage is the commit-message
		var myCommitMessage = document.createElement("div");
		myCommitMessage.setAttribute("class", "commitmessage");
		    myCommitMessage.appendChild(document.createTextNode('"' + truncate(myEval.commit.message,COMMIT_MSG_MAX_LENGTH) + '"'));
		
		// myDiffStat shows how many files were added/removed/changed
		var myDiffStat = document.createElement("div");
		myDiffStat.setAttribute("class", "diffstat");
		myDiffStat.innerHTML = "(" + added.length + " <span class='diffadded'>added</span>, " 
		        + removed.length + " <span class='diffremoved'>removed</span>, " 
		        + modified.length + " <span class='diffchanged'>changed</span>) ";
		
		// only show the "Show files" button if the commit actually added/removed/modified any files at all
		if (added.length > 0 || removed.length > 0 || modified.length > 0) {
			myDiffStat.innerHTML += "<a href='' class='showMoreLink' id='showMoreLink" + myUser + myRepo + "'>" + SHOW_FILES_TXT + "</a>";
		};

		// myFileList lists addded/remove/changed files, hidden at startup
		var myFileList = document.createElement("div");
		myFileList.setAttribute("class", "filelist");
		    myFileList.setAttribute("id", myUser + '_' + myRepo);

		var myAddedFileList = document.createElement("div");
		myAddedFileList.innerHTML = "<span class='diffadded'>Added:</span>";
		var myList = document.createElement("ul");
		var myFile;
		$.each(added, function(j, myAdded) {
			    myFile = document.createElement("li");
		        myFile.appendChild(document.createTextNode(myAdded.filename));
		        myList.appendChild(myFile);
		}); 
		myAddedFileList.appendChild(myList);
		
		var myRemovedFileList = document.createElement("div");
		myRemovedFileList.innerHTML = "<span class='diffremoved'>Removed:</span>";
		    myList = document.createElement("ul");
		$.each(removed, function(j, myRemoved) {
			    myFile = document.createElement("li");
		        myFile.appendChild(document.createTextNode(myRemoved.filename));
		        myList.appendChild(myFile);
		}); 
		myRemovedFileList.appendChild(myList);
		
		var myModifiedFileList = document.createElement("div");
		myModifiedFileList.innerHTML = "<span class='diffchanged'>Changed:</span>";
		    myList = document.createElement("ul");
		$.each(modified, function(j, myModified) {
			    myFile = document.createElement("li");
		        myFile.appendChild(document.createTextNode(myModified.filename));
		        myList.appendChild(myFile);
		}); 
		myModifiedFileList.appendChild(myList);
		
		// add the 3 sections only if they have files in them
		    if (added.length > 0) {
		        myFileList.appendChild(myAddedFileList);
		};
		    if (removed.length > 0) {
		        myFileList.appendChild(myRemovedFileList);
		};
		    if (modified.length > 0) {
		        myFileList.appendChild(myModifiedFileList);
		};

		// throw everything into our badge
		myBadge.appendChild(myUserRepo);
		myBadge.appendChild(myDiffLine);
		myBadge.appendChild(myCommitMessage);
		myBadge.appendChild(myDiffStat);
		myBadge.appendChild(myFileList);

		// and then the whole badge into the container
		$("#gcb-container")[0].appendChild(myBadge);

		// initially hiding the file-list and the behaviour of the Show-files button
		$("#" + myUser + '_' + myRepo).hide();	
		$("#showMoreLink_" + myUser + '_' + myRepo).click(function () {
			    $("#" + myUser + '_' + myRepo).toggle();
			    if ($(this).text() == "Show files") {
				    $(this).text("Hide files");
			} else {
				    $(this).text(SHOW_FILES_TXT);
			};
			return false;
		});
		$(".text-date").humane_dates();	// works here (still, ugly!)
	});


	});
};

// libs we need (mind the order!) (probably obsolete now)
var myLibs = ["everything"];

// Getting the path/url by looking at our main .js already included in the web-page
var myScriptsDefs = document.getElementsByTagName("script");
for (var i=0; i < myScriptsDefs.length; i++) {
	if (myScriptsDefs[i].src && myScriptsDefs[i].src.match(/github-commit-badge.js/)) {
		this.path = myScriptsDefs[i].src.replace(/github-commit-badge.js/, '');
	};
};

// Loading the libs
for (var i=0; i < myLibs.length; ++i) {
	var myScript = document.createElement("script");
	myScript.setAttribute("type","text/javascript");
	if (document.URL.match(/^http/)) {	// only serve the gzipped lib if we're serving from http
		myScript.setAttribute("src", this.path + "lib/" + myLibs[i] + ".jsgz");
	} else {
		myScript.setAttribute("src", this.path + "lib/" + myLibs[i] + ".js");
	};
	if (i == myLibs.length-1) {	// only load our main function after the lib has finished loading
		 //myScript.setAttribute("onload","mainpage();");
		 document.getElementsByTagName("body")[0].setAttribute("onload","mainpage();");
	};
	document.getElementById("gcb-container").appendChild(myScript);
};

// Write the stylesheet into the <head>
myHead = document.getElementsByTagName("head")[0];
myCSS = document.createElement("link");
myCSS.setAttribute("rel","stylesheet");
myCSS.setAttribute("type","text/css");
myCSS.setAttribute("href",this.path + "style.css");
myHead.appendChild(myCSS);
