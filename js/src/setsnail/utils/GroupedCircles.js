function GroupedCircle( data, settings, spacingPrc ) {

	var _instance = document.createElement("div");
	_instance.style.position = "absolute";

	var _width, _height;

	var _circles = [];
	var _fonts = [];

	_instance.init = function( mode ) {
		drawLined();
	};

	_instance.setSize = function( width, height ) {
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

		var l = data.children.length;
		var offsetY = height * 0.5 - _height* 0.5;
		for( var i = 0; i < l; i++ ) {
			TweenMax.set(_circles[i], {
				y:offsetY + _height * 0.5 + settings.spacing * (i % 2),
				x:settings.radius * 2 * spacingPrc * i + settings.radius
			});

			_fonts[i].style.width = settings.radius * 2 + "px";
			TweenMax.set(_fonts[i], {
				y:offsetY + _height * 0.5,
				x:settings.radius * 2 * spacingPrc * i
			});
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
		var l = data.children.length;

		// drawCircle(text);

		for( var i = 0; i < l; i++ ) {
			var text = data.children[i].innerHTML;
			drawCircle(text);
		}
	}

	function drawCircle( text, angle ) {
		var font = Text.getNewLight(18);
		font.style.textAlign = "center";
		font.innerHTML = text;

		font.style.color = UIColors.WHITE;
		_fonts.push(font);

		var circle = new LinedCircle(settings);
		circle.init();

		_instance.appendChild(circle);
		_instance.appendChild(font);
		_circles.push( circle );
	}

	function getCircleWidth( height ) {
		var rad = height * 0.5;
		var spacing = rad * 2 * (1 - spacingPrc) * (_circles.length - 1);
		return rad * 2 * _circles.length - spacing;
	}

	return _instance;
}