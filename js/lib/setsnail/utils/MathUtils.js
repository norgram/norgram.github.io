MathUtils = {};

MathUtils.getDistancePoints = function(point1, point2) {
	var xs = 0;
	var ys = 0;
	xs = point2.x - point1.x;
	xs = xs * xs;
	ys = point2.y - point1.y;
	ys = ys * ys;
	return Math.sqrt( xs + ys );
};

MathUtils.getPointBetween = function(valueA, valueB, ratio) {
	return {x: valueA.x + ratio * (valueB.x - valueA.x), y: valueA.y + ratio * (valueB.y - valueA.y)};
};


MathUtils.ratioFromRatio = function( start, end, ratio, ignoreOverflow) {
	var diff = 1 / ( end - start );
	var newRatio = diff * ratio;
	newRatio -= start * diff;
	if(ignoreOverflow) {
		if(newRatio > 1) {
			newRatio = 1;
		} else if( newRatio < 0 ) {
			newRatio = 0;
		}
	}
	return newRatio;
};