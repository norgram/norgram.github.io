CSS = {};

CSS.roundedCorners = function(element, rounding) {
    element.style.mozBorderRadius = rounding + "px";
    element.style.webkitBorderRadius = rounding + "px";
    element.style.khtmlBorderRadius = rounding + "px";
    element.style.borderRadius = rounding + "px";
};

CSS.shadow = function(element, offsetX, offsetY, spreadRadius, rgba) {
	element.style.mozBoxShadow = offsetX + "px " + offsetY + "px " + spreadRadius + "px " + rgba;
	element.style.webkitBoxShadow = offsetX + "px " + offsetY + "px " + spreadRadius + "px " + rgba;
	element.style.boxShadow = offsetX + "px " + offsetY + "px " + spreadRadius + "px " + rgba;
};

CSS.antialiasText = function(element) {
	element.style.webkitFontSmoothing = "antialiased";
	element.style.mozFontSmoothing = "antialiased";
	element.style.oFontSmoothing = "antialiased";
	element.style.fontSmoothing = "antialiased";
};

CSS.opacity = function(target, opacity) {
	var style = target.style;
	
	style.msFilter 			= "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + opacity + ")";
	style.filter 			= "alpha(opacity=" + opacity + ")";
	style.mozOpacity 		= opacity;
	style.khtmlOpacity 		= opacity;
	style.opacity 			= opacity;
};

CSS.makeUnselectable = function( element ){
	element.style.webkitTouchCallout = "none";
	element.style.webkitUserSelect = "none";
	element.style.khtmlUserSelect = "none";
	element.style.mozUserSelect = "none";
	element.style.msUserSelect = "none";
	element.style.userSelect = "none";
};

CSS.hyphenate = function(target) {
	var style = target.style;
	
	style.webkitHyphens = "auto";
	style.mozHyphens = "auto";
	style.hyphens = "auto";
};

CSS.copyStyles = function(from, to) {
	var styleFrom		= from.style;
	var toStyle			= to.style;

	for(var key in styleFrom) {
	    toStyle[key] = styleFrom[key];
	}
};


