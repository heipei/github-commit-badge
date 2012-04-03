GitHub Commit Badge
-------------------

This badge/banner can be used for displaying the latest (or a specific 
commit) for a GitHub project on your website. It looks like this:

<div><img src="http://heipei.github.com/github-commit-badge/github-commit-badge.png" alt="GitHub commit badge"></div>

It is implemented in JavaScript, meaning that it is completely client-based.
Since this is the first time I've actually used JavaScript and the first time I
actually wrote a CSS from scratch expect things to be buggy.

That said, I'd be happy about ideas/patches. Look at the BUGS file or the 
TODO or come up with something own.

Usage
=====

To use it on your website you'll have to put this somewhere. This means the .js 
file as well as the .css and the lib/ and img/ directories. To adjust the
width of the whole thing look inside the style.css and set it for the 
container-class. I know that the way to define user/repos is still somewhat
cumbersome. The "branch" entry is optional, default is "master".

	<div id="gcb-container">
		<script type="text/javascript">
			var Badges = [
				{
					"username": "heipei",
					"repo": "github-commit-badge",
					"branch": "master"
				},
				{
					"username": "git",
					"repo": "git",
					"branch": "master"
				},
				{
					"username": "brotherbard",
					"repo": "gitx",
					"branch": "experimental"
				}
			];
		</script>
		<script type="text/javascript" src="github-commit-badge.js"></script>	
		
	</div>

If you want to use it on something like WordPress you'll have to put HTML
quotes around the content of the first script-block 

	<script type="text/javascript">
		<!--
			var Badges = [
			[...]
					"branch": "experimental"
				}
			];
		-->
	</script>

Website
=======

* [http://github.com/heipei/github-commit-badge/tree](http://github.com/heipei/github-commit-badge/tree) has the latest version.
* See a working demonstration at [http://heipei.net/files/github-commit-badge/](http://heipei.net/files/github-commit-badge/)

FAQ
===

* Q: How does it work? Where does the data come from?
* A: For each repository, the code will issue to API requests to GitHub to fetch the information.

* Q: Why is it called a badge when it's really more of a banner?
* A: Because I noticed that calling it banner increases the risk of it being
  filtered by AdBlock etc.

* Q: The JavaScript code is not very pretty, why?
* A: This was my first JavaScript project, and I've only been getting to know it.

* Q: What libs are used (and what for)?
* A: jQuery for jQuery.getJSON and jQuery.each, datejs for Date.parse.
	
Author
======

Johannes 'heipei' Gilger <heipei@hackvalue.de>
