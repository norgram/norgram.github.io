function CaseImageModule( data, imageIndex ) {

	var _instance = Snail.extend(new Module());

	var _image;

	var _width, _height;

	_instance.init = function() {
		addImage();
	};

	_instance.resize_desktop = function(width, height) {
		_width = width;
		_height = height;

		if(_image.hasSize()) {
			resizeImage();
		}
	};

	_instance.getWidth = function() {
		return _width;
	};

	function addImage() {
		var imgurl = data.innerHTML;

		if( BrowserDetect.MOBILE ) {
			var mobileurl = data.getAttribute("use-on-mobile");
			if(mobileurl != null) {
				imgurl = mobileurl;
			}
		}


		_image = new RetinaImage(imgurl, null, onImgLoaded );
		_image.init();
		_image.setSizeByAttribute( data );
		if(_image.hasSize()){
			_image.setPreloader( new SlidePreloader() );
		}
		_image.setResizeMode( "insideBox" );
		_instance.appendChild(_image);
	}

	function onImgLoaded() {
		resizeImage();
		_instance.callbackReposition();
	}

	function resizeImage() {
		_image.setSize( "auto", _height );
		_width = _image.getWidth();
	}


	return _instance;

}