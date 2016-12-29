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

	var _centerOffset = 50000;
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

	_instance.getCenterLineOffset = function() {
		return _centerOffset;
	};

	function drawLines() {
		// _centerOffset = 5000;
		var l = Math.floor( settings.radius / settings.spacing );

		_centerOffset = settings.spacing + settings.offset;


		for( var i = 0; i < l; i++) {
			var ratio = i / l;
			var yPos = -settings.radius + settings.radius * 2 * ratio;// + settings.spacing + settings.offset;

			// _centerOffset = getClosetToZero(yPos, _centerOffset);

			var hypotenuseL = settings.radius * settings.radius;
			var sidedL = yPos * yPos;

			var xlength = Math.sqrt(hypotenuseL - sidedL);

			var xPos = -xlength + settings.radius;
			yPos += settings.radius;

			drawLine( xPos, yPos, xlength * 2 );
		}
	}

	function getClosetToZero(numOne, numTwo) {
		var numOneAbs = numOne;
		var numTwoAbs = numTwo;
		if(numOneAbs < 0) {
			numOneAbs = numOneAbs * -1;
		}
		if(numTwoAbs < 0) {
			numTwoAbs = numTwoAbs * -1;
		}

		// console.log(numTwoAbs + " " + numOneAbs + " : " + numTwo + " " + numOne );
		if(numTwoAbs < numOneAbs) {
			return numTwo;
		}
		return numOne;
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