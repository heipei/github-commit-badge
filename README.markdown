GitHub Commit Badge
===================

This badge/banner can be used for displaying the latest (or a specific 
commit) for a GitHub project on your website. It looks like this:

<div><img src="http://heipei.github.com/github-commit-badge/github-commit-badge.png" alt="GitHub commit badge"></div>

It is implemented in JavaScript, meaning that it is completely client-based. I
recently rewrote this whole project using CoffeeScript and SASS instead of
plain JavaScript and CSS.

Dependencies
------------

github-commit-badge uses jquery. Many websites/blogs already include it, but if
you don't, then simply add this line to your website:

	<script type="text/javascript" src="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.8.2.min.js"></script>


Usage
-----

To use the badge on your website, upload the 'css', 'html', 'img' and 'js'
directories to your webserver. Then you can spawn badges on your website like
this:

```
<div id="gcb-container">
	<script type="text/javascript">
		Badges = [
			{ "username": "heipei",       "repo": "github-commit-badge",  "branch": "master" },
			{ "username": "git",          "repo": "git",                  "branch": "master" },
			{ "username": "brotherbard",  "repo": "gitx",                 "branch": "experimental" },
			{ "username": "rep",          "repo": "hpfeeds" }
		];
	</script>
	<script type="text/javascript" src="js/gcb.js"></script>
	
</div>
```

If you want to use it on something like WordPress you'll have to put HTML
quotes around the content of the first script-block 

```
<script type="text/javascript">
	<!--
		Badges = [
		[...]
		];
	-->
</script>
```

Website
-------

* http://github.com/heipei/github-commit-badge/tree has the latest version.
* See a working demonstration at http://heipei.net/files/github-commit-badge/

FAQ
---

**Q**: How does it work? Where does the data come from?  
**A**: For each repository, the code will issue two API requests to GitHub to fetch the information.

**Q**: Why is it called a badge when it's really more of a banner?  
**A**: Because I noticed that calling it banner increases the risk of it being filtered by AdBlock etc.


Developing
----------

To make changes you should really use [CoffeeScript](http://coffeescript.org/)
and [Sass](http://sass-lang.com/). Simply set up watchers like this:
```
	sass --watch scss:css
	coffee -c --watch -o js coffee
```
	
Author
------

Johannes Gilger <heipei@hackvalue.de>
