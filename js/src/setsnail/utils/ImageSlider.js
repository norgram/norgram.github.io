function ImageSlider( urls ) {

	var _instance = document.createElement("div");
	_instance.style.position = "absolute";

	var _mask = document.createElement("div");
	_mask.style.position = "absolute";
	_mask.style.overflow = "hidden";

	var _imageContainer = document.createElement("div");
	_imageContainer.style.position = "absolute";

	_mask.appendChild(_imageContainer);
	_instance.appendChild(_mask);

	var _spacing = 0;//18;

	var _width = 0;
	var _height = 0;

	var _images = [];

	var _currImgId = 0;
	var _totalWidth = 0;

	var _isActive = false;

	var _currIndex = 0;

	_instance.init = function() {
		TweenMax.set( _mask, {width:_width, height:_height} );
		setupImages();
	};

	_instance.setSize = function( width, height ) {
		_width = width;
		_height = height;
		resizeContent();
	};

	_instance.nextImg = function() {
		muteCurrent();
		_currImgId++;
		tweenToImgId();
	};

	_instance.prevImg = function() {
		muteCurrent();
		_currImgId--;
		tweenToImgId();
	};

	_instance.setActive = function() { 
		_isActive = true; 
		updateMute();
	};
	_instance.setInactive = function() { 
		_isActive = false; 
		updateMute();
	};

	function muteCurrent() {
		if(_images[_currIndex]["mute"] != undefined){
			_images[_currIndex].mute();
		}
	}

	function updateMute() {
		if(_images[_currIndex]["mute"] != undefined){
			if( _isActive ) {
				_images[_currIndex].unmute();
			} else {
				_images[_currIndex].mute();
			}
		}
	}

	function tweenToImgId() {
		_currIndex = Math.abs(_currImgId % _images.length);
		updateMute();
		TweenMax.to(_imageContainer, 1, {x:(_width + _spacing) * _currImgId, onUpdate:updateImgPos, ease:Expo.easeOut});
	}

	function resizeContent() {
		TweenMax.set( _mask, {width:_width, height:_height} );

		var l = _images.length;
		var xPos = 0;

		for( var i = 0; i < l; i++ ) {
			var img = _images[i];
			img.setSize(_width, _height);

			TweenMax.set( img, {x:xPos} );
			xPos += _width + _spacing;
		}
		_totalWidth = xPos;

		TweenMax.killTweensOf(_imageContainer);
		TweenMax.set(_imageContainer, {x:(_width + _spacing) * _currImgId});
		updateImgPos();
	}

	function updateImgPos() {
		var l = _images.length;
		var containerX = _imageContainer._gsTransform.x;

		for( var i = 0; i < l; i++ ) {
			var img = _images[i];
			var imgX = img._gsTransform.x;

			while( imgX < -containerX - _width - _spacing ) {
				imgX += _totalWidth;
			}

			while( imgX > -containerX + _width + _spacing ) {
				imgX -= _totalWidth;
			}

			TweenMax.set( img, {x:imgX} );
		}
	}

	function setupImages() {
		var l = urls.length;
		var xPos = 0;

		for( var i = 0; i < l; i++ ) {
			var type = urls[i].split(".").pop();
			var img;

			if( type == "mp4" ) {
				console.log("SÆLKDFJLKSDJFLKSJDFLKDJS");
				img = new VideoPlayer( urls[i] );
				img.init( "AUTOPLAY" );
				img.setScaleMode("OUTSIDE");
				img.enableLoop();
				img.mute();
				img.play();
			} else {
				img = new RetinaImage( urls[i] );
				img.init();
				img.setPreloader(new SlidePreloader( "#f4f4f4", "#e9e9e9"));
				img.setResizeMode("insideBox");
				img.setPosition("center/center");
			}
			
			img.setSize(_width, _height);
			TweenMax.set( img, { x:xPos } );

			_images.push(img);
			_imageContainer.appendChild(img);

			xPos += _width + _spacing;
		}
		_totalWidth = xPos;
	}

	return _instance;
}