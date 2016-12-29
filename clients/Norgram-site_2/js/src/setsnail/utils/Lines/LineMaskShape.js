function LineMaskShape() {
	var _instance = {};

	_instance.x = 0;
	_instance.y = 0;

	_instance.lineScale = 1;

	_instance.getLineAt = function( yPos ) {
		console.logError( "THIS FUNCTION IS MENT TO BE ABSTRACT" );
	};
	_instance.getWidth = function() {
		console.logError( "THIS FUNCTION IS MENT TO BE ABSTRACT" );
	};
	_instance.getHeight = function() {
		console.logError( "THIS FUNCTION IS MENT TO BE ABSTRACT" );
	};

	_instance.getScaledPosition = function() {
		return {
			x:_instance.x * _instance.lineScale,
			y:_instance.y * _instance.lineScale
		};
	};

	return _instance;
}


LineMaskShape.OFFSET_Y = 0;

function LineCircle() {

	var _instance = new LineMaskShape();
	_instance.radius = 50;

	_instance.getLineAt = function( yPos ) {
		yPos += LineMaskShape.OFFSET_Y;
		var radius = _instance.radius * _instance.lineScale;
		var x = _instance.x * _instance.lineScale;
		var y = _instance.y * _instance.lineScale;


		if( yPos < -radius * 2 + y ) {
			return null;
		} else if( yPos > radius * 2 + y ) {
			return null;
		}

		var hypotenuseL = radius * radius;
		var yNormal = yPos - radius - y;// - _instance.y;
		var sidedL = yNormal * yNormal;
		var xLength = Math.sqrt(hypotenuseL - sidedL);

		var xPos = radius - xLength + x;
		return {x:xPos, y:yPos, length:xLength * 2};
	};

	_instance.getScaledPosition = function() {
		return {
			x:(_instance.radius + _instance.x) * _instance.lineScale,
			y:(_instance.radius + _instance.y) * _instance.lineScale
		};
	};

	_instance.getWidth = function() {
		return _instance.radius * 2;
	};
	_instance.getHeight = function() {
		return _instance.radius * 2;
	};

	return _instance;
}





function LineRect(width, height) {
	var _instance = new LineMaskShape();
	_instance.width = width;
	_instance.height = height;


	_instance.getLineAt = function( yPos ) {
		yPos += LineMaskShape.OFFSET_Y;
		var x = _instance.x * _instance.lineScale;
		var y = _instance.y * _instance.lineScale;

		var width = _instance.width * _instance.lineScale;
		var height = _instance.height * _instance.lineScale;

		if( yPos < y ) {
			return null;
		} else if( yPos > height + y ) {
			return null;
		}

		return {x:x, y:yPos, length:width};
	};


	_instance.getWidth = function() {
		return _instance.width;
	};
	_instance.getHeight = function() {
		return _instance.height;
	};

	return _instance;
}

function LineTriangleRight( width, height ) {
	var _instance = new LineMaskShape();
	_instance.width = width;
	_instance.height = height;

	_instance.getLineAt = function( yPos ) {
		yPos += LineMaskShape.OFFSET_Y;
		var x = _instance.x * _instance.lineScale;
		var y = _instance.y * _instance.lineScale;

		var width = _instance.width * _instance.lineScale;
		var height = _instance.height * _instance.lineScale;

		if( yPos < y ) {
			return null;
		} else if( yPos > height + y ) {
			return null;
		}

		var ratio = yPos / height * 2;
		var xLength = width * ratio;

		if( xLength > width ) {
			xLength = width - xLength % width;
		}

		return {x:x, y:yPos, length:xLength};
	};

	_instance.getWidth = function() {
		return _instance.width;
	};
	_instance.getHeight = function() {
		return _instance.height;
	};

	return _instance;
}

function LineTriangle(width, height) {
	var _instance = new LineMaskShape();
	_instance.width = width;
	_instance.height = height;


	_instance.getLineAt = function( yPos ) {
		yPos += LineMaskShape.OFFSET_Y;
		var x = _instance.x * _instance.lineScale;
		var y = _instance.y * _instance.lineScale;

		var width = _instance.width * _instance.lineScale;
		var height = _instance.height * _instance.lineScale;

		if( yPos < y ) {
			return null;
		} else if( yPos > height + y ) {
			return null;
		}

		var ratio = yPos / height;
		var xLength = width * ratio;

		return {x:(width - xLength) * 0.5, y:yPos, length:xLength};
	};


	_instance.getWidth = function() {
		return _instance.width;
	};
	_instance.getHeight = function() {
		return _instance.height;
	};

	return _instance;
}


