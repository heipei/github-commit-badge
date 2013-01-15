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
# to commit these values! It's best to keep these lines in a separate file
# (config.coffee) and itclude it after gcb.js
config = this
config.client_id = ""
config.client_secret = ""
config.devel = "&client_id=#{client_id}&client_secret=#{client_secret}"

# nuts and bolts for adjustment
DEFAULT_BRANCH_NAME = "master"
COMMIT_MSG_MAX_LENGTH = 120
COMMIT_DISPLAYED_ID_LENGTH = 8
SHOW_FILES_TXT = 'Click to show more'
HIDE_FILES_TXT = 'Click to show less'

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
      added = removed = modified = 0

      for file in data.data.files
        switch file.status
          when "modified"
            modified++
            $("ul.difflist", @selector).append($("<li/>").text(file.filename).
              prepend($("<span class='mini-icon mini-icon-modified'/>")).
              append($("<span class='diffmodified'/>").text(" (#{file.changes})")))
          when "added"
            added++
            $("ul.difflist", @selector).append($("<li/>").text(file.filename).
              prepend($("<span class='mini-icon mini-icon-added'/>")).
              append($("<span class='diffadded'/>").text(" (#{file.changes})")))
          else
            removed++
            $("ul.difflist", @selector).append($("<li/>").text(file.filename).
              prepend($("<span class='mini-icon mini-icon-removed'/>")).
              append($("<span class='diffremoved'/>").text(" (#{file.changes})")))

      # Insert data into the DOM badge
      $("span.branch", @selector).html " (branch: <b>#{@branch}</b>)"
      $("div.diffline a.badge", @selector).attr({"href": @commit_url}).
        text(truncate(data.data.sha,COMMIT_DISPLAYED_ID_LENGTH,""))
      $("span.text-date", @selector).text(" #{parseDate(data.data.commit.committer.date)}")
      $("span.committer", @selector).text(data.data.commit.committer.name)
      $("span.email", @selector).text(" <#{data.data.commit.committer.email}>")
      $("div.commitmessage", @selector).append(commit_msg(data.data.commit.message))
      $("div.commitmessagelong", @selector).append(data.data.commit.message).hide()

      $("a.showMoreLink", @selector).attr("id", "showMoreLink_#{@name}")

      $("div.diffstat span.diffadded", @selector).before(added)
      $("div.diffstat span.diffremoved", @selector).before(removed)
      $("div.diffstat span.diffmodified", @selector).before(modified)

      $("div.filelist", @selector).attr({id: "files_#{@name}" })


      # Behaviour of the show-more/show-less link
      $("#showMoreLink_#{@name}").click =>
        $("#files_#{@name}").toggle(1000)
        $("#{@selector} > .commitmessagelong").toggle(1000)
        $("#{@selector} > .commitmessage").toggle(1000)
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
      $("span.followers", @selector).text(data.data.watchers)
      $("span.forks", @selector).text(data.data.forks)

# onload function
mainpage = ->
  $("#gcb-container").load "html/badge.html" , ->
    for badgeData in Badges
      new Badge(badgeData.username, badgeData.repo, badgeData.branch)

$('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', 'css/style.css'))
$('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', 'https://github.com/assets/github.css'))
$ -> mainpage() # document.ready
