// The necessary libraries
var myLibs = ["jquery", "md5", "date", "prototype"];

// For setting the path correctly
var myScriptsDefs = document.getElementsByTagName("script");
for (var i=0; i < myScriptsDefs.length; i++) {
	if (myScriptsDefs[i].src && myScriptsDefs[i].src.match(/loadlibs\.js/)) {
		this.path = myScriptsDefs[i].src.replace(/loadlibs\.js/, '');
	};
};

// Loading the libs
for (var i=0; i < myLibs.length; ++i) {
	var myScript = document.createElement("script");
	myScript.setAttribute("type","text/javascript");
	myScript.setAttribute("src", this.path + "lib/" + myLibs[i] + ".js");
	document.getElementById("container").appendChild(myScript);
};
// Write the stylesheet into the <head>
myHead = document.getElementsByTagName("head")[0];
myCSS = document.createElement("link");
myCSS.setAttribute("rel","stylesheet");
myCSS.setAttribute("type","text/css");
myCSS.setAttribute("href",this.path + "style.css");
myHead.appendChild(myCSS);
