['md5', 'jquery', 'date'].each(function(lib) {
	var myLib = document.createElement("script");
	myLib.setAttribute("type","text/javascript");
	myLib.setAttribute("src","lib/" + lib + ".js");
	document.documentElement.appendChild(myLib);
});
jQuery.noConflict();
