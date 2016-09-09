ColorUtils = {};

ColorUtils.colorLuminance = function(hex, lum) {
	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}
	lum = lum || 0;
	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for ( i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i * 2, 2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00" + c).substr(c.length);
	}
	return rgb;
};

ColorUtils.rgb2hex = function(rgb) {
	rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
	function hex(x) {
		return ("0" + parseInt(x).toString(16)).slice(-2);
	}
	return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
};

ColorUtils.hex2rgb = function(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
};

ColorUtils.interpolateColor = function(minColor, maxColor, maxDepth, depth) {
	function d2h(d) {return d.toString(16);}
	function h2d(h) {return parseInt(h,16);}

	if(depth === 0) {
		return minColor;
	}
	if(depth == maxDepth){
		return maxColor;
	}

	var color = "#";

	for(var i=1; i <= 6; i+=2) {
		var minVal = new Number(h2d(minColor.substr(i,2)));
		var maxVal = new Number(h2d(maxColor.substr(i,2)));
		var nVal = minVal + (maxVal-minVal) * (depth/maxDepth);
		var val = d2h(Math.floor(nVal));
		while(val.length < 2) {
			val = "0"+val;
		}
		color += val;
	}
	return color;
};

ColorUtils.getRandomColor = function() {
	var hexVals = '0123456789ABCDEF'.split('');
	var color = '#';
	for (var i = 0; i < 6; i++ ) {
		color += hexVals[Math.round(Math.random() * 15)];
	}
	return color;
};

ColorUtils.interpolateRGB = function (rgb1, rgb2, t) {
	function mix(a, b, t) {
		return a * (1 - t) + b * t;
	}

	var interpolated = {};
	interpolated.r = Math.floor(mix(rgb1.r, rgb2.r, t));
	interpolated.g = Math.floor(mix(rgb1.g, rgb2.g, t));
	interpolated.b = Math.floor(mix(rgb1.b, rgb2.b, t));

	return interpolated;
};

