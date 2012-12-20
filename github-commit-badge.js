// vim:ft=javascript:et:ts=2:sw=2
// github-commit-badge.js (c) 2012 by Johannes 'heipei' Gilger
//
// The source-code should be pretty self-explanatory. Also look at the 
// style.css to customize the badge.

// Development
// In order to develop github-commit-badge, you will have to issue large number
// of unauthenticated API calls. You need to register your own GitHub OAuth
// application and insert the client_id and client_secret below. Make sure
// never to commit these values!
var client_id = "";
var client_secret = "";
var devel = "&client_id=" + client_id + "&client_secret=" + client_secret;

// for truncating the commit-id and commit-message in place
function truncate(string, length, truncation) {
	length = length || 30;
	truncation = (typeof truncation == 'undefined') ? '...' : truncation;
	return string.length > length ?
		string.slice(0, length - truncation.length) + truncation : string;
};

// shorten date
function parseDate(dateTime) {
	dateTime = dateTime.replace(/T.*/, "");
	return dateTime;
};

// nuts and bolts for adjustment
var DEFAULT_BRANCH_NAME = 'master';
var COMMIT_MSG_MAX_LENGTH = 120;
var COMMIT_DISPLAYED_ID_LENGTH = 8;
var SHOW_FILES_TXT = 'Show more';
var HIDE_FILES_TXT = 'Show less';
var GRAVATAR_URL_PREFIX = 'http://www.gravatar.com/avatar/';
var GRAVATAR_IMG_SIZE = 60;

// parse info about the commit
function parse_commit(data,myUser,myRepo,branchName) {
  var badge = $("#" + myUser + "_" + myRepo);
  var added = [];
  var modified = [];
  var removed = [];

  // Split files into added/removed/modified
  $.each(data.data.files, function(i,v) {
    if (v.status == "modified") {
      modified.push(v);
    } else if (v.status == "added") {
      added.push(v);
    } else {
      removed.push(v);
    }
  })
  
  $("div.username", badge).append(" (branch: "+branchName + ")");
  $("div.diffline img.gravatar", badge).attr({"src": data.data.committer.avatar_url, alt: myUser });
  $("a.badge", badge).attr({href: "https://github.com/"+myUser+"/"+myRepo+"/commit/"+data.data.sha, text: truncate(data.data.sha,COMMIT_DISPLAYED_ID_LENGTH,"")});

  $("span.text-date", badge).text(" " + parseDate(data.data.commit.committer.date));
  $("span.committer", badge).text(data.data.commit.committer.name);
  $("span.email", badge).text(" <" + data.data.commit.committer.email + ">");
  $("div.commitmessage", badge).text(truncate(data.data.commit.message.replace(/\n.*/g, "").replace(/\r.*/g, ""),COMMIT_MSG_MAX_LENGTH));
  $("div.commitmessagelong", badge).text(data.data.commit.message).hide();

  $("div.diffstat a.showMoreLink", badge).attr("id", "showMoreLink_" + myUser + "_" + myRepo);

  $("div.diffstat span.diffadded", badge).before(added.length);
  $("div.diffstat span.diffremoved", badge).before(removed.length);
  $("div.diffstat span.diffmodified", badge).before(modified.length);
  
  $("div.filelist", badge).attr({id: "files_" + myUser + '_' + myRepo });
  
  if (added.length > 0) {
    $("div.diffadded span.diffadded", badge).show();
    $.each(added, function(j, myAdded) {
      $("div.diffadded ul", badge).append($("<li/>").text(myAdded.filename).append($("<span class='diffadded'/>").text(" ("+myAdded.changes+")")));
    });
  }

  if (removed.length > 0) {
    $("div.diffremoved span.diffremoved", badge).show();
    $.each(removed, function(j, myRemoved) {
      $("div.diffremoved ul", badge).append($("<li/>").text(myRemoved.filename).append($("<span class='diffremoved'/>").text(" ("+myRemoved.changes+")")));
    });
  }

  if (modified.length > 0) {
    $("div.diffmodified span.diffmodified", badge).show();
    $.each(modified, function(j, myModified) {
      $("div.diffmodified ul", badge).append($("<li/>").text(myModified.filename).append($("<span class='diffmodified'/>").text(" ("+myModified.changes+")")));
    });
  }

  // Behaviour of the show-more/show-less link 
  $("#showMoreLink_" + myUser + '_' + myRepo).click(function () {
      $("#files_" + myUser + '_' + myRepo).toggle();
      $("#" + myUser + '_' + myRepo + " > .commitmessagelong").toggle();
      $("#" + myUser + '_' + myRepo + " > .commitmessage").toggle();
      if ($(this).text() == SHOW_FILES_TXT) {
        $(this).text(HIDE_FILES_TXT);
      } else {
        $(this).text(SHOW_FILES_TXT);
      };
    return false;
  });
};

function parse_repo(data,myUser,myRepo) {
      var badge = $("#" + myUser + "_" + myRepo);
      $("div.username a", badge).text(myUser + "/" + myRepo).attr("href", data.data.html_url);
      $("span.followers", badge).text("(" + data.data.forks + " forks, " + data.data.watchers + " starred)"); 
};

function mainpage () {
  // load the badge template
	$("#gcb-container").load("badge.html", function() {
		$.each(Badges, function(i, badgeData) {
			var badge = $("#gcb-template").clone().appendTo("#gcb-container");
			$(badge).attr("id", badgeData.username + "_" + badgeData.repo.replace(/\./g, '-'));
			$(badge).appendTo("#gcb-container").show();
		});
	});

	
	$.each(Badges, function(i, badgeData) {
    var branchName = ((typeof badgeData.branch == 'undefined' || badgeData.branch.length == 0) ? DEFAULT_BRANCH_NAME : badgeData.branch);
    var urlData = "https://api.github.com/repos/" + badgeData.username + "/" + badgeData.repo;

    var myUser = badgeData.username;
    var myRepo = badgeData.repo.replace(/\./g, '-');

    $.getJSON(urlData + "/commits/" + branchName + "?callback=?" + devel, function(data) {
      if(data.meta && data.meta.status == 403) {
        console.log("Something went wrong requesting the commits for " + urlData + ": " + data.data.message);
        $("#" + myUser + "_" + myRepo).text("Error: " + data.data.message);
        return;
      }
      parse_commit(data,myUser,myRepo,branchName);
    });
    $.getJSON(urlData + "?callback=?" + devel, function(data) {
      if(data.meta && data.meta.status == 403) {
        console.log("Something went wrong requesting the commits for " + urlData + ": " + data.data.message);
        $("#" + myUser + "_" + myRepo).text("Error: " + data.data.message);
        return;
      }
      parse_repo(data,myUser,myRepo);
    });
    
	});
};

$("body").attr("onload","mainpage();");

// Write the stylesheet into the <head>
$('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', 'style.css'));
