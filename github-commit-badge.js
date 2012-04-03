// github-commit-badge.js (c) 2012 by Johannes 'heipei' Gilger
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
	//dateTime = dateTime.replace("T" + theirTime, "T" + ourTime);
	dateTime = dateTime.replace(/T.*/, "");
	return dateTime;
};


// nuts and bolts for adjustment
var DEFAULT_BRANCH_NAME = 'master';
var COMMIT_MSG_MAX_LENGTH = 120;
var COMMIT_DISPLAYED_ID_LENGTH = 8;
var SHOW_FILES_TXT = 'Show files';
var HIDE_FILES_TXT = 'Hide files';
var GRAVATAR_URL_PREFIX = 'http://www.gravatar.com/avatar/';
var GRAVATAR_IMG_SIZE = 60;

function mainpage () {
	$.each(Badges, function(i, badgeData) {
        var branchName = ((typeof badgeData.branch == 'undefined' || badgeData.branch.length == 0) ? DEFAULT_BRANCH_NAME : badgeData.branch);
        var urlData = "https://api.github.com/repos/" + badgeData.username + "/" + badgeData.repo 
	        + "/commits/" + branchName + "?callback=?";

	$.getJSON(urlData, function(data) {
		var myUser = badgeData.username;
		var myRepo = badgeData.repo.replace(/\./g, '-');;
		var added = [];
		var modified = [];
		var removed = [];

		// Split files into added/removed/modified
		$.each(data.data.files, function(i,v) {
			if (v.status == "modified") {
				modified.push(v);
			} else if (v.stats == "added") {
				added.push(v);
			} else {
				removed.push(v);
			}
		})
		
		// outline-class is used for the badge with the border
		var myBadge = $("<div/>", { id: myUser + "_" + myRepo, class: "outline" });
		
		// and then the whole badge into the container
		$("#gcb-container").append(myBadge);

		// the username/repo
		$("<div/>", { class: "username"}).appendTo(myBadge);

		var request_url = "https://api.github.com/repos/" + badgeData.username + "/" + badgeData.repo +  "?callback=?"
		$.getJSON(request_url, function(data) {
			var myLink = $("<a/>", { href: data.data.html_url, text: myUser + "/" + badgeData["repo"] });
			var followers = $("<span/>", { 
				class: "followers", 
				text: " (" + data.data.forks + " forks, " + data.data.watchers + " watchers)" 
			});
			$("#"+myUser+"_"+myRepo+ " > .username").append(myLink).append(" (branch: "+branchName + ")").append(followers);
		});

		// myDiffLine is the "foo committed xy on date" line 
		var myDiffLine = $("<div/>", { class: "diffline" }).appendTo(myBadge);

		// the image-class uses float:left to sit left of the commit-message
		$("<img/>", { src: data.data.committer.avatar_url, class: 'gravatar', alt: myUser }).appendTo(myDiffLine);

		$("<a/>", { href: "https://github.com/"+myUser+"/"+myRepo+"/commit/"+data.data.sha, class: "badge",
			text: truncate(data.data.sha,COMMIT_DISPLAYED_ID_LENGTH,"")
		}).appendTo(myDiffLine);

		$("<span/>", { class: "text-date", text: " " + parseDate(data.data.commit.committer.date)
		}).appendTo(myDiffLine);

		$("<span/>", { class: "committer", text: " " + data.data.commit.committer.name }).appendTo(myDiffLine);

		$("<span/>", { class: "email", text: " <" + data.data.commit.committer.email + ">" }).appendTo(myDiffLine);

		$("<div/>", { class: "commitmessage",
			text: '"' + truncate(data.data.commit.message.replace(/\n.*/g, "").replace(/\r.*/g, ""),COMMIT_MSG_MAX_LENGTH) + '"'
		}).appendTo(myBadge);

		// myDiffStat shows how many files were added/removed/changed
		var myDiffStat = $("<div/>", { class: "diffstat", html:
			"(Files: " + added.length + " <span class='diffadded'>added</span>, " 
		        + removed.length + " <span class='diffremoved'>removed</span>, " 
			+ modified.length + " <span class='diffchanged'>changed</span>) " });
		myBadge.append(myDiffStat);
		
		// only show the "Show files" button if the commit actually added/removed/modified any files at all
		if (data.data.stats.total > 0) {
			myDiffStat.append("<a href='' class='showMoreLink' id='showMoreLink_" + myUser + "_" + myRepo + "'>" + SHOW_FILES_TXT + "</a>");
		};
	
		// myFileList lists addded/remove/changed files, hidden at startup
		$("<div/>", { class: "filelist", id: "files_" + myUser + '_' + myRepo }).appendTo(myBadge);
		
		if (added.length > 0) {
			myList = $("<ul/>");
			$.each(added, function(j, myAdded) {
				$("<li/>", { text: myAdded.filename }).append(
					$("<span/>", { class: "diffadded", text: " (" + myAdded.changes + ")"})
				).appendTo(myList);
			});
			fileList = $("<div/>", { id: "myAddedFileList" }).appendTo($("#files_"+myUser+"_"+myRepo));
			fileList.append($("<span/>", { class: 'diffadded', text: "Added" }));
			fileList.append(myList);
		}

		if (removed.length > 0) {
			myList = $("<ul/>");
			$.each(removed, function(j, myRemoved) {
				$("<li/>", { text: myRemoved.filename }).append(
					$("<span/>", { class: "diffremoved", text: " (" + myRemoved.changes + ")"})
				).appendTo(myList);
			});
			fileList = $("<div/>", { id: "myRemovedFileList" }).appendTo($("#files_"+myUser+"_"+myRepo));
			fileList.append($("<span/>", { class: 'diffremoved', text: "Removed" }));
			fileList.append(myList);
		}

		if (modified.length > 0) {
			myList = $("<ul/>");
			$.each(modified, function(j, myModified) {
				$("<li/>", { text: myModified.filename }).append(
					$("<span/>", { class: "diffchanged", text: " (" + myModified.changes + ")"})
				).appendTo(myList);
			});
			fileList = $("<div/>", { id: "myModifiedFileList" }).appendTo($("#files_"+myUser+"_"+myRepo));
			fileList.append($("<span/>", { class: 'diffchanged', text: "Changed" }));
			fileList.append(myList);
		}

		// initially hiding the file-list and the behaviour of the Show-files button
		$("#files_" + myUser + '_' + myRepo).hide();	
		$("#showMoreLink_" + myUser + '_' + myRepo).click(function () {
				$("#files_" + myUser + '_' + myRepo).toggle();
				if ($(this).text() == "Show files") {
					$(this).text("Hide files");
				} else {
					$(this).text(SHOW_FILES_TXT);
				};
			return false;
		});
		//$(".text-date").humane_dates();	// works here (still, ugly!)
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
