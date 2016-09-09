function OverviewCaseModule( data, prcWidth, index ) {

	var _instance = Snail.extend(new Module());
	_instance.style.backgroundColor = UIColors.WHITE;
	_instance.style.cursor = "pointer";

	_instance.onModuleClick;

	var _width, _height;

	var _image;

	_instance.init = function () {
		_instance.super.init();
		Touchable.apply(_instance);

		_instance.onClick(onModuleClick);

		addImage();
	};

	_instance.getData = function() {
		return data;
	};

	_instance.resize_desktop = function (width, height) {
		_width = width * prcWidth;
		_height = height;

		_instance.style.width = _instance.getWidth() + "px";
		_instance.style.height = height + "px";

		if( _image.isLoaded() ) {
			updateImgSize();
		}
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

		_image = new RetinaImage( url, null, updateImgSize);
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