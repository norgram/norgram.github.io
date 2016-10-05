Image.prototype.load = function( url, callback ) {
	var thisImg = this;

	// Chrome, Firefox, IE7+, Opera, Safari
	if (window.XMLHttpRequest ) {
		var xmlHTTP = new XMLHttpRequest();
	}else {
		thisImg.src = url;
		return false;
	}

	thisImg.completedPercentage = 0;

	xmlHTTP.open( 'GET', url , true );
	xmlHTTP.responseType = 'arraybuffer';

	xmlHTTP.onload = function( e ) {
		var h = xmlHTTP.getAllResponseHeaders(),
			m = h.match( /^Content-Type\:\s*(.*?)$/mi ),
			mimeType = m[ 1 ] || 'image/png';

		var blob = new Blob( [ this.response ], { type: mimeType } );
		thisImg.src = window.URL.createObjectURL( blob );
		if ( callback ) callback( this );
	};

	xmlHTTP.onprogress = function( e ) {
		if ( e.lengthComputable )
			thisImg.completedPercentage = parseInt( ( e.loaded / e.total ) * 100 );

		if(thisImg.onProgress != null){
			thisImg.onProgress( thisImg.completedPercentage );
		}
	};

	xmlHTTP.onloadstart = function() {
		thisImg.completedPercentage = 0;
	};

	xmlHTTP.onloadend = function() {
		thisImg.completedPercentage = 100;
	};

	xmlHTTP.send();

	return true;
};

function RetinaImage(src, retinaHandle, callbackLoad, callbackError) {

	var _instance = document.createElement("div");
	_instance.style.position = "absolute";

	var _src				= src;
	var _retinaHandle		= retinaHandle ? retinaHandle : null;
	var _image				;
	var _midContainer		= document.createElement( "div" );
	_midContainer.id = "MidContainer";

	var  _preLoader;

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

	_instance.setPreloader = function( preloader ) {
		// console.log("SET PRELOADER");
		_preLoader = preloader;

		if(_image != null) {
			_image.removeEventListener("load", onImageLoaded);
		}
		_preLoader.onEaseComplete = onImageLoaded;


		_midContainer.appendChild(_preLoader);
	};

	function updateSize() {

		var width = _newW;
		var height = _newH;

		if( _isLoaded ) {
			if(_resizeMode === "insideBox") {
				var ratio = _originalHeight / _originalWidth;
				var areaRatio = _newH / _newW;
				if(ratio > areaRatio) {
					// width = _newW;
					_image.width = _newW;
					// height = _newW * ratio
					_image.height = _newW * ratio;
				} else {
					ratio = _originalWidth / _originalHeight;
					_image.height = _newH;
					_image.width = _newH * ratio;
					// width = _newH * ratio;
				}
			} else if(_newW === "auto") {
				if(_newH !== null) {
					var ratio = _originalWidth / _originalHeight;
					_image.height = _newH;
					_image.width = _newH * ratio;
					// width = _newH * ratio;
				}
			} else if(_newH === "auto") {
				if(_newW !== null) {
					var ratio = _originalHeight / _originalWidth;
					_image.width = _newW;
					_image.height = _newW * ratio;
					// height = _newW * ratio;
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

		if( _preLoader != null ) {
			if(isNumber(width) && isNumber(height)) {
				_preLoader.setSize( width, height );
				_midContainer.style.width = _newW + "px";
				_midContainer.style.height = _newH + "px";
			}
		}
	}

	_instance.setPosition = function(value) {
		_position = value;
		updatePosition();
	};

	function isNumber (o) {
		return !isNaN (o-0) && o !== null && o !== "" && o !== false;
	}

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

		// if( _preLoader != null ) {
		// 	if(isNumber(_newW) && isNumber(_newH)) {
		// 		TweenMax.set(_preLoader, {x:_newW * 0.5, y:_newH * 0.5});
				// _preLoader.setSize( width, height );
		// 	}
		// }
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

		if(_preLoader == null) {
			_image.addEventListener("load", onImageLoaded);
		} else {
			_midContainer.appendChild( _preLoader );
		}
		_image.addEventListener("error", onImageError);

		// _image.onerror = function( e ){
		// 	return true;
		// };

		if(_preLoader != null) {
			_image.onProgress = onProgress;
			if(!_image.load(loadPath)) {
				_image.addEventListener("load", onImageLoaded);
			}
		} else {
			_image.src = loadPath;
		}
	}

	function onImageError( e ) {
		// e.preventDefault();
		// e.stopPropagation();
		// trace("onImageError();");
		doCallback(_callbackError);

		return true;
	}

	function onProgress( progress ) {
		_preLoader.setProgress( progress );
		// console.log("ON PROGRESS = " + progress);
	}

	function onImageLoaded() {
		_image.removeEventListener("load", onImageLoaded);
		_image.removeEventListener("error", onImageError);

		var scalePercent	= _retinaHandle ? _retinaHandle.getAssetScalePercent() : 1;

		_originalWidth 		= _image.width * scalePercent;
		_originalHeight 	= _image.height * scalePercent;
		_image.width 		= _originalWidth;
		_image.height 		= _originalHeight;


		if(_preLoader != null) {
			// var scaleOffset = 0;
			// if(_position === "center/center") {
			// 	scaleOffset = 0.5;
			//
			// }

			if(isNumber(_newW)){
				TweenMax.set( _image, {x:_newW} );
			}
			TweenMax.to(_image, 1, {x:0, ease:Expo.easeInOut});
			TweenMax.to(_preLoader, 1, {x:-_newW, onComplete:function() {
				_midContainer.removeChild(_preLoader);
				_preLoader = null;
			}, ease:Expo.easeInOut});
		}

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


function SlidePreloader( bgColor, slideColor ) {

	var _instance = new ImagePreloader();
	_instance.style.backgroundColor = bgColor;

	var _slider = document.createElement("div");
	_slider.style.position = "absolute";
	_slider.style.backgroundColor = slideColor;

	_instance.appendChild(_slider);

	var _ratio = 0;
	var _width, _height;

	_instance.onEaseComplete;

	_instance.setSize = function( width, height ){
		_width = Math.ceil(width);
		_height = Math.ceil(height);

		_instance.style.width = _width + "px";
		_instance.style.height = _height + "px";

		//Update to ratio;
		if( _ratio >= 0.99 ) {
			_slider.style.height = _height + "px";
			// _slider.style.width = _width + "px";
		} else {
			TweenMax.set( _slider, {width:_width * _ratio} );
			_slider.style.height = _height + "px";
		}
	};

	var __progress = 0;
	_instance.setProgress = function( progress ){
		if( __progress == progress ) {
			return;
		}
		__progress = progress;
		_ratio = __progress / 100;
		if(_ratio >= 0.99) {
			_ratio = 1;
		}

		TweenMax.to( _slider, 0.75 + Math.random() * 0.5, {width:_width * _ratio, onComplete:easeComplete} );
		_slider.style.height = _height + "px";
	};

	function easeComplete() {
		if(_ratio >= 0.99) {
			if(_instance.onEaseComplete != null) {
				_instance.onEaseComplete();
			}
		}
	}

	return _instance;
}


function ImagePreloader() {
	var _instance = document.createElement("div");
	_instance.style.position = "absolute";
	_instance.setSize = function( width, height ){};
	_instance.setProgress = function( progress ){};
	return _instance;
}