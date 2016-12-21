function TextArea( text, font ) {

	var _instance = document.createElement("div");
	_instance.style.position = "absolute";

	_instance.isController = true;

	var _modelMode = TextAreaModel.MODE_CONTROL;
	var _model;

	_instance.addModel = function( model, mode ) {
		_model = (model != null) ? model : new TextAreaModel();

		if(mode != null) {
			_modelMode = mode;
			if(_modelMode == TextAreaModel.MODE_LISTEN) {
				_model.addEventListener( TextAreaModel.EVENT_UPDATE, updateFontSize );
			}
		}
	};

	_instance.getModel = function() {
		return _model;
	};

	_instance.kill = function() {
		if(_model != null) {
			_model.removeEventListener( TextAreaModel.EVENT_UPDATE, updateFontSize );
		}
	};

	_instance.init = function( model, mode ) {
		font.innerHTML = text;
		_instance.appendChild(font);
		_instance.addModel( model, mode );
	};

	_instance.setColor = function( color ) {
		font.style.color = color;
	};

	_instance.setColumns = function(numOfColumns, gap){
		font.style.webkitColumnCount = numOfColumns;
		font.style.mozColumnCount = numOfColumns;
		font.style.columnCount = numOfColumns;

		if(gap != null) {
			font.style.webkitColumnGap = gap + "px";
			font.style.mozColumnGap = gap + "px";
			font.style.columnGap = gap + "px";
		}
	};

	_instance.getTextInstance = function() {
		return font;
	};

	_instance.setSize = function( width, height ) {
		if( _modelMode == TextAreaModel.MODE_LISTEN || _model == null ) {
			_instance.style.width = font.style.width = width + "px";
			// _instance.style.height = font.style.height = height + "px";
			return;
		}

		_model.setSize(width, height);

		_instance.style.width = font.style.width = _model.width + "px";
		var currentfontSize = parseInt(font.style.fontSize);

		//INCREES FONTSIZE
		while( font.offsetHeight < _model.height ) {
			currentfontSize += 1;
			if(currentfontSize >= _model.maxFontSize) {
				currentfontSize = _model.maxFontSize;
				font.style.fontSize = currentfontSize + "px";
				font.updateLineHeight();
				break;
			}

			font.style.fontSize = currentfontSize + "px";
			font.updateLineHeight();

			//Failsafe
			if(currentfontSize >= 800) {
				break;
			}
		}

		//DECREES FONTSIZE
		while( font.offsetHeight > _model.height ) {
			currentfontSize -= 1;
			if(currentfontSize <= _model.minFontSize) {
				currentfontSize = _model.minFontSize;
				font.style.fontSize = currentfontSize + "px";
				font.updateLineHeight();
				break;
			}

			font.style.fontSize = currentfontSize + "px";
			font.updateLineHeight();

			//Failsafe
			if(currentfontSize <= 1) {
				break;
			}
		}

		if(_modelMode == TextAreaModel.MODE_CONTROL) {
			if(_model != null) {
				_model.fontSize = currentfontSize;
				_model.callUpdate();
			}
		}

		TweenMax.set(font, {y: -Text.getOffsetY(font)});
	};

	function updateFontSize() {
		// _instance.style.width = font.style.width = _model.width + "px";
		font.style.fontSize = _model.fontSize + "px";
		font.updateLineHeight();
		TweenMax.set(font, {y: -Text.getOffsetY(font)});
	}

	return _instance;
}




function TextAreaModel() {
	TextAreaModel.EVENT_UPDATE = "UPDATE";

	TextAreaModel.MODE_CONTROL = "MODE_CONTROL";
	TextAreaModel.MODE_LISTEN = "MODE_LISTEN";

	var _instance = new EventDispatcher();

	_instance.minFontSize = 1;
	_instance.maxFontSize = 999999;

	_instance.minWidth = 0;
	_instance.maxWidth = 999999;
	_instance.minHeight = 0;
	_instance.maxHeight = 999999;

	_instance.fontSize = 12;

	_instance.width = 0;
	_instance.height = 0;

	_instance.callUpdate = function() {
		_instance.dispatchEvent( TextAreaModel.EVENT_UPDATE );
	};

	_instance.setSize = function(width, height) {
		if(width > _instance.maxWidth) {
			_instance.width = _instance.maxWidth;
		} else if( width < _instance.minWidth) {
			_instance.width = _instance.minWidth;
		} else {
			_instance.width = width;
		}

		if(height > _instance.maxHeight) {
			_instance.height = _instance.maxHeight;
		} else if( height < _instance.minHeight) {
			_instance.height = _instance.minHeight;
		} else {
			_instance.height = height;
		}
	};

	return _instance;
}
