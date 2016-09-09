function RetinaImage(src, retinaHandle, callbackLoad, callbackError) {

	var _instance = document.createElement("div");
	_instance.style.position = "absolute";

	var _src				= src;
	var _retinaHandle		= retinaHandle ? retinaHandle : null;
	var _image				;
	var _midContainer		= document.createElement( "div" );

	var _originalWidth		= 0;
	var _originalHeight		= 0;

	var _newW				= null;
	var _newH				= null;

	var _isLoaded			= false;

	var _resizeMode			= "";

	var _callbackLoad		= callbackLoad ? callbackLoad : null;
	var _callbackError		= callbackError ? callbackError : null;

	var _position			= "";

	_instance.init = function() {
		loadResolutionSpecificImage();

		if(_retinaHandle !== null) {
			_retinaHandle.addEventListener(RetinaHandleEvents.CHANGE, loadResolutionSpecificImage);
		}
	};

	_instance.kill = function() {
		if(_retinaHandle !== null) {
			_retinaHandle.removeEventListener(RetinaHandleEvents.CHANGE, loadResolutionSpecificImage);
		}
	};

	_instance.getWidth = function() {
		if(!_isLoaded) {
			return 0;
		}
		return _image.width;
	};

	_instance.getHeight = function() {
		if(!_isLoaded) {
			return 0;
		}
		return _image.height;
	};

	_instance.setSize = function( width, height ) {
		_newW = width;
		_newH = height;

		// trace( _newW + " : " + _newH);
		updateSize();
	};


	_instance.setWidth = function(val) {
		_newW = val;
		updateSize();
	};

	_instance.setHeight = function(val) {
		_newH = val;
		updateSize();
	};

	_instance.setResizeMode = function(mode) {
		_resizeMode = mode;
		if( _resizeMode === "insideBox" ) {
			_midContainer.style.overflow = "hidden";
		} else {
			_midContainer.style.overflow = "visible";
		}
		updateSize();
	};

	_instance.getContent = function(){
		return _image;
	};

	function updateSize() {

		if( _isLoaded ) {
			if(_resizeMode === "insideBox") {
				var ratio = _originalHeight / _originalWidth;
				var areaRatio = _newH / _newW;
				if(ratio > areaRatio) {
					_image.width = _newW;
					_image.height = _newW * ratio;
				} else {
					ratio = _originalWidth / _originalHeight;
					_image.height = _newH;
					_image.width = _newH * ratio;
				}
			} else if(_newW === "auto") {
				if(_newH !== null) {
					var ratio = _originalWidth / _originalHeight;
					_image.height = _newH;
					_image.width = _newH * ratio;
				}
			} else if(_newH === "auto") {
				if(_newW !== null) {
					var ratio = _originalHeight / _originalWidth;
					_image.width = _newW;
					_image.height = _newW * ratio;
				}
			} else {
				if(_newW !== null) {
					_image.width = _newW;
				}
				if(_newH !== null) {
					_image.heigth = _newH;
				}
			}

			_instance.style.width = _midContainer.style.width = _newW + "px";
			_instance.style.height = _midContainer.style.height = _newH + "px";

			updatePosition();
		}
	}

	_instance.setPosition = function(value) {
		_position = value;
		updatePosition();
	};

	function updatePosition() {
		if(_isLoaded) {
			var x = 0;
			var y = 0;

			if(_position === "center/center") {
				x = 0.5;
				y = 0.5;
			}

			_image.style.left = _newW * x - _image.width * x + "px";
			_image.style.top = _newH * y - _image.height * y + "px";
		}
	}

	_instance.getOriginalWidth = function() {
		if(!_isLoaded) {
			return 0;
		}
		return _originalWidth;
	};

	_instance.getOriginalHeight = function() {
		if(!_isLoaded) {
			return 0;
		}
		return _originalHeight;
	};

	_instance.getWidthRatio = function() {
		if(!_isLoaded) {
			return 0;
		}
		return _instance.getOriginalHeight() / _instance.getOriginalWidth();
	};

	_instance.isLoaded = function() {
		return _isLoaded;
	};

	function loadResolutionSpecificImage() {
		if(_image) {
			_midContainer.removeChild(_image);

			_instance.removeChild( _midContainer );
			_image = null;
		}

		var loadPath = _src;

		if(_retinaHandle !== null) {
			var imagePathArr = _src.split(".");
			var lastPart = imagePathArr.pop();
			loadPath = imagePathArr.join(".") + _retinaHandle.getAssetScaleStr() + "." + lastPart;
		}

		_image = new Image();
		_image.style.visibility = "hidden";
		_image.style.position = "absolute";

		_midContainer.style.position = "absolute";
		_midContainer.appendChild( _image );

		_instance.appendChild( _midContainer );

		_image.addEventListener("load", onImageLoaded);
		_image.addEventListener("error", onImageError);

		// _image.onerror = function( e ){
		// 	return true;
		// };

		_image.src = loadPath;
	}

	function onImageError( e ) {
		// e.preventDefault();
		// e.stopPropagation();
		// trace("onImageError();");

		doCallback(_callbackError);

		return true;

	}

	function onImageLoaded() {
		_image.removeEventListener("load", onImageLoaded);
		_image.removeEventListener("error", onImageError);

		var scalePercent	= _retinaHandle ? _retinaHandle.getAssetScalePercent() : 1;

		_originalWidth 		= _image.width * scalePercent;
		_originalHeight 	= _image.height * scalePercent;
		_image.width 		= _originalWidth;
		_image.height 		= _originalHeight;

		_isLoaded = true;

		updateSize();

		_image.style.visibility = "visible";

		doCallback(_callbackLoad);
	}

	function doCallback(callback) {
		if(callback !== null) {
			if(callback.length) {
				callback(_instance);
			} else {
				callback();
			}
			callback = null;
		}
	}

	return _instance;
}
