function RoundCircleGroup( data, settings, spacingPrc ) {

	var _instance = document.createElement("div");
	_instance.style.position = "absolute";

	var _width, _height;

	var _circles = [];
	var _fonts = [];

	_instance.init = function() {
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

		settings.radius = _width / 3 * 0.5;
		settings.draw();

		var l = data.children.length;
		// var offsetY = height * 0.5 - _height* 0.5;

		var centerCircleX = _width * 0.5;
		var centerCircleY = _height * 0.5;


		TweenMax.set(_circles[0], {
			y:centerCircleY,
			x:centerCircleX
		});

		_fonts[0].style.width = settings.radius * 2 + "px";
		TweenMax.set(_fonts[0], {
			y:centerCircleY,
			x:centerCircleX - settings.radius
		});

		var partAngle = 1 / (l - 1) * 360;
		var overlappingLines = 50;

		var circleCenterOffset = _circles[0].getCenterLineOffset();

		// console.log(circleCenterOffset);

		TweenMax.set( _circles[1], {
			x:centerCircleX,
			y:centerCircleY + settings.spacing * 10
		} );

		for( var i = 1; i < l; i++ ) {
			var angle = partAngle * (i - 1);

			var radOffset = (settings.spacing - settings.thickness * 0.5) * overlappingLines + settings.spacing;// (settings.radius - settings.spacing * overlappingLines) * 2;
			var offsetY = Math.sin(angle / 180 * Math.PI) * radOffset + centerCircleY;

			var xPos = Math.cos(angle / 180 * Math.PI) * radOffset + centerCircleX;
			var yPos = offsetY;// + settings.spacing;

			// yPos += circleCenterOffset;

			TweenMax.set( _circles[i], {
				x:xPos,// - radOffset * Math.cos(angle / 180 * Math.PI),
				y:yPos// - (radOffset - settings.spacing) * Math.sin(angle / 180 * Math.PI)
			} );

			_fonts[i].style.width = settings.radius * 2 + "px";
			TweenMax.set( _fonts[i], {
				x:xPos - settings.radius,
				y:yPos - settings.spacing
			} );
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

		for( var i = 0; i < l; i++ ) {
			var text = data.children[i].innerHTML;

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


	}

	function getCircleWidth( height ) {
		var rad = height * 0.5;
		var spacing = rad * 2 * (1 - spacingPrc) * (_circles.length - 1);
		return rad * 2 * _circles.length - spacing;
	}

	return _instance;
}