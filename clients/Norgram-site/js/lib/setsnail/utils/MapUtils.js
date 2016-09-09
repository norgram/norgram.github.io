MapUtils = {};

MapUtils.fromCoordinatesToPixel = function(lng, lat, mapCenterX, mapCenterY, pixelSize) {
	var pixelToDegressRatioX = pixelSize / 360;
	var pixelToDegressRatioY = pixelSize / (2 * Math.PI);
    
    var x = Math.round(mapCenterX + (lng * pixelToDegressRatioX));
    var f = Math.min(Math.max(Math.sin(lat * (Math.PI / 180)), -0.9999), 0.9999);
    var y = Math.round(mapCenterY + .5 * Math.log((1 + f) / (1 - f)) * - pixelToDegressRatioY);
    
    return {x: x, y: y};
}