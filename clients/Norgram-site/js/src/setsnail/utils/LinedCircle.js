function LinedCircle( settings ) {

	var _instance = document.createElement("div");
	_instance.style.position = "absolute";
	CSS.makeUnselectable(_instance);

	var _container = document.createElement("canvas");
	_container.style.position = "absolute";
	_instance.appendChild(_container);

	if(settings == null) {
		settings = new LinedCircleSettings();
	}





	var _context = _container.getContext("2d");

	_instance.init = function() {
		settings.addEventListener( LinedCircleSettings.ON_UPDATE, _instance.updateLines);
		_instance.updateLines();
	};

	_instance.updateLines = function() {
		_container.width = settings.radius * 2 + settings.thickness;
		_container.height = settings.radius * 2 + settings.thickness;
		TweenMax.set( _container, {x:-settings.radius, y:-settings.radius} );
		_context.clearRect(0, 0, _context.width, _context.height);
		drawLines();
	};

	_instance.kill = function() {
		settings.removeEventListener( LinedCircleSettings.ON_UPDATE, _instance.updateLines);
	};

	function drawLines() {

		var l = Math.floor( settings.radius / settings.spacing );

		for( var i = 0; i < l; i++) {
			var ratio = i / l;

			var yPos = -settings.radius + settings.radius * 2 * ratio + settings.spacing + settings.offset;

			var hypotenuseL = settings.radius * settings.radius;
			var sidedL = yPos * yPos;

			var xlength = Math.sqrt(hypotenuseL - sidedL);

			var xPos = -xlength + settings.radius;
			yPos += settings.radius;

			drawLine( xPos, yPos, xlength * 2 );
		}
	}

	function drawLine( x, y, length ) {
		_context.beginPath();
		_context.moveTo(x, y - settings.thickness * 0.5);
		_context.lineTo(x + length, y - settings.thickness * 0.5);
		_context.lineWidth = settings.thickness;

		_context.strokeStyle = settings.color;
		_context.stroke();
	}

	return _instance;
}


function LinedCircleSettings() {
	var _instance = new EventDispatcher();

	LinedCircleSettings.ON_UPDATE = "ON_UPDATE";

	_instance.thickness = 2;
	_instance.radius = 300;
	_instance.spacing = 10;
	_instance.offset = 0;

	_instance.color = "#fff";

	_instance.draw = function() {
		_instance.dispatchEvent(LinedCircleSettings.ON_UPDATE);
	};

	return _instance;
}