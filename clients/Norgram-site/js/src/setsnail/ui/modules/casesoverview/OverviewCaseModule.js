function OverviewCaseModule( data, prcWidth, index ) {

	var _instance = Snail.extend(new Module());
	_instance.style.backgroundColor = UIColors.WHITE;
	_instance.style.cursor = "pointer";

	_instance.onModuleClick;

	var _width, _height;
	var _offset = 0;

	var _image;

	var _offsetWidth = 0;

	_instance.init = function () {
		_instance.super.init();
		Touchable.apply(_instance);

		_instance.onClick(onModuleClick);
		addImage();
	};

	_instance.setOffset = function( offset ) {
		_offset = offset;
	};

	_instance.getData = function() {
		return data;
	};

	_instance.offsetWidth2 = function( offsetWidth ) {
		_offsetWidth = offsetWidth;
	};

	_instance.resize_desktop = function (width, height) {
		_width = Math.floor(width + _offset);
		// console.log(_offsetWidth);
		if(_offsetWidth != 0) {
			_width = width - _offsetWidth;
		}
		_height = height;

		_instance.style.width = _instance.getWidth() + "px";
		_instance.style.height = height + "px";

		_image.setSize(_instance.getWidth(), _height);
		// if( _image.isLoaded() ) {
		// 	updateImgSize();
		// }
	};

	_instance.getWidth = function() {
		return _width;
	};

	_instance.kill = function() {
		_instance.onClick(null);
	};

	function onModuleClick() {
		if(_instance.onModuleClick != null) {
			_instance.onModuleClick(index);
		}
	}

	function addImage() {
		var url = ContentManager.getChildByAttr(data, "name", "overviewimage").innerHTML;

		if( BrowserDetect.MOBILE ) {
			if(ContentManager.getChildByAttr(data, "name", "overviewimagemobile") != null) {
				url = ContentManager.getChildByAttr(data, "name", "overviewimagemobile").innerHTML;
			}
		}
		// console.log(ContentManager.getChildByAttr(data, "name", "overviewimage").getAttribute("size"));

		var colorOne = (index % 2) == 0 ? UIColors.PRELOADER_COLOR_ONE : UIColors.PRELOADER_COLOR_TWO;
		var colorTwo = (index % 2) == 0 ? UIColors.PRELOADER_COLOR_TWO : UIColors.PRELOADER_COLOR_ONE;
		_image = new RetinaImage( url, null, updateImgSize);
		// _image.setSizeByAttribute(ContentManager.getChildByAttr(data, "name", "overviewimage")  );
		_image.setPreloader( new SlidePreloader( colorOne, colorTwo ) );
		_image.init();
		_image.setResizeMode("insideBox");
		_image.setPosition("center/center");

		_instance.appendChild(_image);
	}

	function updateImgSize() {
		_image.setSize(_instance.getWidth(), _height);
	}

	return _instance;
}