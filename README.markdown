GitHub Commit Badge
-------------------

This badge/banner can be used for displaying the latest (or a specific 
commit) for a GitHub project on your website. It looks like this:

<div><img src="http://heipei.github.com/github-commit-badge/github-commit-badge.png" alt="GitHub commit badge"></div>

It is implemented in JavaScript, meaning that it is completely client-based.
Since this is the first time I've actually used JavaScript, the first time I
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

	<div id="github-commit-badge-container">
		<script type="text/javascript">
			var Badges = new Array();
			Badges[0] = new Object;
			Badges[0]["username"] = "heipei";
			Badges[0]["repo"] = "github-commit-badge";
			
			Badges[1] = new Object;
			Badges[1]["username"] = "git";
			Badges[1]["repo"] = "git";
			Badges[1]["branch"] = "master";
			
		</script>
		<script type="text/javascript" src="github-commit-badge.js"></script>	
	</div>

If you want to use it on something like WordPress you'll have to put HTML
quotes around the content of the first script-block 

	<script type="text/javascript">
		<!--
			var Badges = new Array();
			[...]
			Badges[1]["branch"] = "master";
		-->
	</script>

Website
=======

* [http://github.com/heipei/github-commit-badge/tree](http://github.com/heipei/github-commit-badge/tree) has the latest version.
* See a working demonstration at [http://heipei.net/files/github-commit-badge/](http://heipei.net/files/github-commit-badge/)

FAQ
===

* Q: Why is it called a badge when it's really more of a banner?
* A: Because I noticed that calling it banner increases the risk of it being
  filtered by AdBlock etc.

* Q: Why does the JavaScript code so scary and inconsistent?
* A: Because I don't know a thing about JavaScript and the million things that can
  and do fail. That's why there might be some workarounds ;)

* Q: What libs are used (and what for)?
* A: jQuery for jQuery.getJSON and jQuery.each, datejs for Date.parse and md5 for
  md5\_hex (for the gravatar). Also I learned a lot from DrNic's GitHub-badges
  [http://github.com/drnic/github-badges/tree](github-badges).
	
Author
======

Johannes 'heipei' Gilger <heipei@hackvalue.de>
