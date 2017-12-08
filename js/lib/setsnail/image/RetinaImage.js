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

	_instance.onPreloaderAnimationDone;

	var _src				= src;
	var _retinaHandle		= retinaHandle ? retinaHandle : null;
	var _image				;
	var _midContainer		= document.createElement( "div" );
	_midContainer.id = "MidContainer";

	var  _preLoader;

	var _hasOrigSize = false;

	var _width = 0;
	var _height = 0;

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
		return _width;//_image.width;
	};

	_instance.getHeight = function() {
		return _height;// _image.height;
	};

	_instance.setSizeByAttribute = function( dom ) {
		var width = parseInt(dom.getAttribute( "width" ));
		var height = parseInt(dom.getAttribute( "height" ));

		if( _instance.getOriginalWidth() <= 0 && _instance.getOriginalHeight() <= 0 ) {
			setOrigSize( width, height );
		}

		if(isNumber(width) && isNumber(height)) {
			_instance.setSize( width, height );
			return;
		}

		if(isNumber(width) ) {
			_instance.setWidth( width );
		}
		if(isNumber(height) ) {
			_instance.setHeight( height );
		}
	};

	_instance.hasSize = function() {
		return _instance.getWidth() > 0 && _instance.getHeight() > 0;
	};

	_instance.setSize = function( width, height ) {
		_newW = width;
		_newH = height;

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
			_image.onProgress = onProgress;
			if(!_image.load(_src)) {
				_image.addEventListener("load", onImageLoaded);
			} else {
				// console.log("easeComplete");
				_preLoader.onEaseComplete = onImageLoaded;
			}
		}else {
			_preLoader.onEaseComplete = onImageLoaded;
		}

		_midContainer.appendChild(_preLoader);
	};

	function updateSize() {
		
		if( _hasOrigSize ) {
			if(_resizeMode === "insideBox") {
				var ratio = _originalHeight / _originalWidth;
				var areaRatio = _newH / _newW;
				if(ratio > areaRatio) {
					_width = _newW;
					_height = Math.ceil(_newW * ratio);
				} else {
					ratio = _originalWidth / _originalHeight;

					_width = Math.ceil(_newH * ratio);
					_height = _newH;
				}
			} else if(_newW === "auto") {
				if(_newH !== null) {
					var ratio = _originalWidth / _originalHeight;

					_width = Math.ceil(_newH * ratio);
					_height = _newH;
				}
			} else if(_newH === "auto") {
				if(_newW !== null) {
					var ratio = _originalHeight / _originalWidth;

					_width = _newW;
					_height = Math.ceil(_newW * ratio);
				}
			} else {
				if(_newW !== null) {
					_width = _newW;
				}
				if(_newH !== null) {
					_height = _newH;
				}
			}
		} else {

			if(_newW !== null) {
				_width = _newW;
			}
			if(_newH !== null) {
				_height = _newH;
			}

		}


		if( isNumber( _width ) ) {
			if( _width == 0 ) {
				_width = _originalWidth;
			}

			if( _isLoaded ) {
				_image.width = _width;
			}
			_instance.style.width = _width + "px";
		}
		if( isNumber(_height) ) {
			if( _height == 0 ) {
				_height = _originalHeight;
			}

			if( _isLoaded ) {
				_image.height = _height;
			}
			_instance.style.height = _height + "px";
		}

		updatePosition();

		if( _preLoader != null ) {
			if(isNumber(_width) && isNumber(_height)) {
				_preLoader.setSize( _width, _height );
			}
		}
		_midContainer.style.width = _newW + "px";
		_midContainer.style.height = _newH + "px";
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

			if( _width != null ) {
				var offW = 0;
				if(_newW != null) {
					offW = _newW;
				}

				_image.style.left = Math.floor(offW * x - _width * x) + "px";
			}
			if( _height != null ) {
				var offH = 0;
				if(_newH != null) {
					offH = _newH;
				}

				_image.style.top = Math.floor(offH * y - _height * y) + "px";
			}

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

		if(_preLoader == null) {
			_image.addEventListener("load", onImageLoaded);
		} else {
			_midContainer.appendChild( _preLoader );
		}
		_image.addEventListener("error", onImageError);

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
		doCallback(_callbackError);
		return true;
	}

	function onProgress( progress ) {
		_preLoader.setProgress( progress );
		// console.log("ON PROGRESS = " + progress);
	}

	function setOrigSize( width, height ) {
		var scalePercent	= _retinaHandle ? _retinaHandle.getAssetScalePercent() : 1;

		if( isNumber(width) ) {
			_originalWidth 		= width * scalePercent;
			_image.width 		= _originalWidth;
		}

		if( isNumber(height) ) {
			_originalHeight 	= height * scalePercent;
			_image.height 		= _originalHeight;
		}

		_hasOrigSize = true;
	}

	function onImageLoaded() {
		_image.removeEventListener("load", onImageLoaded);
		_image.removeEventListener("error", onImageError);

		setOrigSize( _image.width, _image.height );

		if(_preLoader != null) {

			if(isNumber(_width)){
				TweenMax.set( _image, {x:_width} );
			}
			TweenMax.to(_image, 1, {x:0, ease:Expo.easeInOut});
			TweenMax.to(_preLoader, 1, {x:-_width, onComplete:function() {
				_midContainer.removeChild(_preLoader);
				_preLoader = null;
				if(_instance.onPreloaderAnimationDone != null) {
					_instance.onPreloaderAnimationDone();
				}
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
	
	var _background = document.createElement( "div" );
	_background.style.position = "absolute";
	_background.style.backgroundColor = bgColor != null ? bgColor : UIColors.PRELOADER_COLOR_ONE;	

	var _slider = document.createElement("div");
	_slider.style.position = "absolute";
	_slider.style.backgroundColor = slideColor != null ? slideColor : UIColors.PRELOADER_COLOR_TWO;


	_instance.appendChild( _background );
	_instance.appendChild(_slider);

	var _ratio = 0;
	var _width, _height;

	_instance.onEaseComplete;

	_instance.setSize = function( width, height ){
		_width = Math.ceil(width);
		_height = Math.ceil(height);

		_background.style.width = _instance.style.width = _width + "px";
		_background.style.height = _instance.style.height = _height + "px";

		//Update to ratio;
		if( _ratio >= 0.99 ) {
			_slider.style.height = _height + "px";
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
			_background.style.display = "none";
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