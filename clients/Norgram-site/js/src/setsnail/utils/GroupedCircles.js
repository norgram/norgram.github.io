function GroupedCircle( data, settings, spacingPrc, mode ) {

	var _instance = document.createElement("div");
	_instance.style.position = "absolute";
	// _instance.style.backgroundColor = "#f00";

	GroupedCircle.MODE_LINED = "MODE_LINED";
	GroupedCircle.MODE_ROUND = "MODE_ROUND";

	var _width, _height;

	var _mode = mode != null ? mode : GroupedCircle.MODE_LINED;

	var _resizeMode = "INSIDE";

	var _circles = [];

	_instance.init = function( mode ) {
		_mode = mode != null ? mode : GroupedCircle.MODE_LINED;
		drawLined();
	};

	_instance.setSize = function( width, height ) {
		var widthBasedOnHeight = getCircleWidth(height);
		var aspectRatio = width / getCircleWidth(height);

		if(aspectRatio < 1) {
			_height = height * aspectRatio;
			_width = width;
		} else if( aspectRatio > 1 ) {
			_height = height;
			_width = width * aspectRatio;
		}

		settings.radius = _height * 0.5;
		settings.draw();

		var offsetY = height * 0.5 - _height* 0.5;
		for( var i = 0; i < 4; i++ ) {
			TweenMax.set(_circles[i], {y:offsetY + _height * 0.5 + settings.spacing * (i % 2), x:settings.radius * 2 * spacingPrc * i + settings.radius});
		}

		TweenMax.set(_instance, { width:width, height:height });
	};

	_instance.kill = function() {
		var l = _circles.length;
		for( var i = 0; i < l; i++) {
			_circles[i].kill();
		}
	};

	function drawLined() {
		for( var i = 0; i < 4; i++ ) {
			var circle = new LinedCircle(settings);
			circle.init();
			_instance.appendChild(circle);
			_circles.push( circle );
		}
	}

	function getCircleWidth( height ) {
		var rad = height * 0.5;
		var spacing = rad * 2 * (1 - spacingPrc) * (_circles.length - 1);// (1 - spacingPrc);//* (_circles.length - 1);
		return rad * 2 * _circles.length - spacing;

	}

	return _instance;
}