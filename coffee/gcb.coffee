# vim:ft=coffee:et:ts=2:sw=2:
#
# github-commit-badge.js - JavaScript banner for GitHub repositories
#
# (c) 2013 by Johannes Gilger <heipei@hackvalue.de>
#
# The source-code should be pretty self-explanatory. Also look at the
# style.css to customize the badge.

# Development
# In order to develop github-commit-badge, you will have to issue repeated
# unauthenticated API calls. You need to register your own GitHub OAuth
# application and insert the client_id and client_secret below. Make sure never
# to commit these values!
client_id = ""
client_secret = ""
devel = "&client_id=#{client_id}&client_secret=#{client_secret}"

# nuts and bolts for adjustment
DEFAULT_BRANCH_NAME = "master"
COMMIT_MSG_MAX_LENGTH = 120
COMMIT_DISPLAYED_ID_LENGTH = 8
SHOW_FILES_TXT = 'Show more'
HIDE_FILES_TXT = 'Show less'

# for truncating the commit-id and commit-message in place
truncate = (string, length = 30, truncation = "...") ->
  string[0..length]

# format the commit message
commit_msg = (string) ->
  truncate(string.replace(/\n.*/g, "").replace(/\r.*/g, ""),COMMIT_MSG_MAX_LENGTH)

# shorten the date
parseDate = (dateTime) ->
  dateTime.replace(/T.*/, "")

# the actual badge class
class Badge
  selector = api_commit = api_repo = name = commit_url = ""

  constructor: (@username, @repo, @branch = DEFAULT_BRANCH_NAME) ->
    @api_commit = "https://api.github.com/repos/#{@username}/#{@repo}/commits/#{@branch}?callback=?#{devel}"
    @api_repo = "https://api.github.com/repos/#{@username}/#{@repo}?callback=?#{devel}"
    @name = "#{username}_#{repo.replace(/\./g, '-')}"
    @selector = "##{@name}"
    $("#gcb-template").clone().appendTo("#gcb-container").attr("id", @name)
    $(@selector).appendTo("#gcb-container").show()

    @parse_commit()
    @parse_repo()

  parse_commit: ->
    $.getJSON @api_commit, (data) =>
      if data.meta and data.meta.status is 403
        console.log "Something went wrong requesting the commits for #{@api_commit}: #{data.data.message}"
        $(selector).text("Error: #{data.data.message}")
        return

      # Request the avatar first
      $("div.diffline img.gravatar", @selector).attr({"src": data.data.committer.avatar_url, alt: "" })

      # GitHub URL for the last commit
      @commit_url = "https://github.com/#{@username}/#{@repo}/commit/#{data.data.sha}"

      # Split files into added/removed/modified
      added = []
      modified = []
      removed = []

      for file in data.data.files
        switch file.status
          when "modified" then modified.push(file)
          when "added" then added.push(file)
          else removed.push(file)

      # Insert data into the DOM badge
      $("div.username", @selector).append " (branch: #{@branch})"
      $("div.diffline a.badge", @selector).attr({"href": @commit_url}).
        text(truncate(data.data.sha,COMMIT_DISPLAYED_ID_LENGTH,""))
      $("span.text-date", @selector).text(" #{parseDate(data.data.commit.committer.date)}")
      $("span.committer", @selector).text(data.data.commit.committer.name)
      $("span.email", @selector).text(" <#{data.data.commit.committer.email}>")
      $("div.commitmessage", @selector).text(commit_msg(data.data.commit.message))
      $("div.commitmessagelong", @selector).text(data.data.commit.message).hide()

      $("div.diffstat a.showMoreLink", @selector).attr("id", "showMoreLink_#{@name}")

      $("div.diffstat span.diffadded", @selector).before(added.length)
      $("div.diffstat span.diffremoved", @selector).before(removed.length)
      $("div.diffstat span.diffmodified", @selector).before(modified.length)

      $("div.filelist", @selector).attr({id: "files_#{@name}" })

      if added.length > 0
        $("div.diffadded span.diffadded", @selector).show()
      for myAdded in added
        $("div.diffadded ul", @selector).append($("<li/>").text(myAdded.filename).
          append($("<span class='diffadded'/>").text(" (#{myAdded.changes})")))

      if removed.length > 0
        $("div.diffremoved span.diffremoved", @selector).show()
      for myRemoved in removed
        $("div.diffremoved ul", @selector).append($("<li/>").text(myRemoved.filename).
          append($("<span class='diffremoved'/>").text(" (#{myRemoved.changes})")))

      if modified.length > 0
        $("div.diffmodified span.diffmodified", @selector).show()
      for myModified in modified
        $("div.diffmodified ul", @selector).append($("<li/>").text(myModified.filename).
          append($("<span class='diffmodified'/>").text(" (#{myModified.changes})")))

      # Behaviour of the show-more/show-less link
      $("#showMoreLink_#{@name}").click =>
        $("#files_#{@name}").toggle()
        $("#{@selector} > .commitmessagelong").toggle()
        $("#{@selector} > .commitmessage").toggle()
        if $("#showMoreLink_#{@name}").text() is SHOW_FILES_TXT
          $("#showMoreLink_#{@name}").text(HIDE_FILES_TXT)
        else
          $("#showMoreLink_#{@name}").text(SHOW_FILES_TXT)
        return false

      $(@selector).click => 
        $("#showMoreLink_#{@name}").click()

  parse_repo: ->
    $.getJSON @api_repo, (data) =>
      $("div.username a", @selector).text("#{@username}/#{@repo}").attr("href", data.data.html_url)
      $("span.followers", @selector).text("(#{data.data.forks} forks, #{data.data.watchers} starred)")

# onload function
mainpage = ->
  $("#gcb-container").load "html/badge.html" , ->
    for badgeData in Badges
      new Badge(badgeData.username, badgeData.repo, badgeData.branch)

$('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', 'css/style.css'))
$ -> mainpage() # document.ready
