// Load the necessary libraries
var myLibs = ["jquery", "md5", "date", "prototype"];
for (var i=0; i < myLibs.length; ++i) {
	var myScript = document.createElement("script");
	myScript.setAttribute("type","text/javascript");
	myScript.setAttribute("src","lib/" + myLibs[i] + ".js");
	document.documentElement.appendChild(myScript);
};
// Write the stylesheet into the <head>
myHead = document.getElementsByTagName("head")[0];
myCSS = document.createElement("link");
myCSS.setAttribute("rel","stylesheet");
myCSS.setAttribute("type","text/css");
myCSS.setAttribute("href","style.css");
myHead.appendChild(myCSS);
