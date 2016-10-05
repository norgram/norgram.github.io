function LineMaskDrawer() {

	var _instance = document.createElement("div");
	_instance.style.position = "absolute";
	CSS.makeUnselectable(_instance);

	var _canvas = document.createElement("canvas");
	_canvas.style.position = "absolute";
	_canvas.width = 400;
	_canvas.height = 400;

	//DEBUG COLORS
	// _instance.style.backgroundColor = "#0f0";
	// _canvas.style.backgroundColor = "#00f";

	_instance.appendChild(_canvas);

	var _groups = [];
	var _context = _canvas.getContext("2d");

	var _width = 200;
	var _height = 200;

	_instance.addGroup = function(group) {
		_groups.push(group);
		render();
	};

	_instance.setSize = function( width, height ) {
		_width = width;
		_height = height;
		_canvas.width = _width;
		_canvas.height = _height;

		TweenMax.set( _instance, {width:_width, height:_height} );
		render();
	};

	_instance.getGroupAt = function(index) {
		return _groups[index];
	};

	_instance.numOfGroups = function() {
		return _groups.length;
	};

	_instance.getCanvasOffset = function() {
		return {x:_canvas._gsTransform.x, y:_canvas._gsTransform.y};
	};


	function render() {
		var l = _groups.length;

		//Find and set Scale
		var minScale = 9999;
		for(var i = 0; i < l; i++) {
			_groups[i].setSize(_canvas.width, _canvas.height);
			if(_groups[i].getScale() < minScale) {
				minScale = _groups[i].getScale();
			}
		}

		//Find and setSize;
		var shapesWidth = 0;
		var shapesHeight = 0;
		for(var i = 0; i < l; i++) {
			_groups[i].scale = minScale;
			var width = _groups[i].getScaledWidth();
			var height = _groups[i].getScaledHeight();

			if(width > shapesWidth) {
				shapesWidth = width;
			}
			if( height > shapesHeight) {
				shapesHeight = height;
			}
		}
		_canvas.width = shapesWidth;
		_canvas.height = shapesHeight;
		TweenMax.set( _canvas, {
			x:_width * 0.5 - shapesWidth * 0.5,
			y:_height * 0.5 - shapesHeight * 0.5
		} );

		for(var i = 0; i < l; i++) {
			_groups[i].render( _context );
		}


	}

	return _instance;
}


function LineMaskGroup( lineSpacing, lineThickness, lineOffset, color, shapes ) {

	var _instance = {};

	_instance.spacing = lineSpacing;
	_instance.thickness = lineThickness;
	_instance.offset = lineOffset;

	_instance.color = color != null ? color : "#f00";

	_instance.scale = 1;

	var _origWidth = 10;
	var _origHeight = 10;
	var _width, _height;

	var _shapes = shapes != null ? shapes : [];

	_instance.addShape = function( shape ) {
		_shapes.push(shape);
		calcOrigSize();
	};

	_instance.numOfShapes = function() {
		return _shapes.length;
	};

	_instance.getShapeAt = function(index) {
		return _shapes[index];
	};

	_instance.setSize = function( width, height ) {
		_width = width;
		_height = height;
	};

	_instance.getScale = function() {
		var xRatio = _width / _origWidth;
		var yRatio = _height / _origHeight;

		if( xRatio < yRatio ) {
			return xRatio;
		} else {
			return yRatio;
		}
	};

	_instance.getScaledWidth = function(){
		return _origWidth * _instance.scale;
	};
	_instance.getScaledHeight = function(){
		return _origHeight * _instance.scale;
	};

	_instance.render = function( context ) {
		context.clearRect(0, 0, context.width, context.height);

		var linePartOffset = (_instance.spacing + _instance.thickness );
		var numOfShapes = _shapes.length;
		var numOfLines = Math.floor(_height / linePartOffset );

		var yPos = lineOffset;
		for( var i = 0; i < numOfLines; i++ ) {

			for( var j = 0; j < numOfShapes; j++ ) {
				var shape = _shapes[j];
				shape.lineScale = _instance.scale;

				var line = shape.getLineAt( yPos );
				if(line != null) {
					drawLine( line.x, line.y, line.length, context);
				}
			}

			yPos += linePartOffset;
		}

	};

	function calcOrigSize() {
		_origHeight = _origWidth = 0;
		var numOfShapes = _shapes.length;

		for( var i = 0; i < numOfShapes; i++ ) {
			var shape = _shapes[i];

			var borderX = shape.x + shape.getWidth();
			if( borderX > _origWidth ){
				_origWidth = borderX;
			}

			var borderY = shape.y + shape.getHeight();
			if( borderY > _origHeight ) {
				_origHeight = borderY;
			}
		}
	}

	function drawLine( x, y, length, context ) {
		context.beginPath();
		context.moveTo(x, y - _instance.thickness * 0.5);
		context.lineTo(x + length, y - _instance.thickness * 0.5);
		context.lineWidth = _instance.thickness;

		context.strokeStyle = _instance.color;
		context.stroke();
	}


	return _instance;
}