function OverviewCaseModule( data ) {

	var _instance = Snail.extend(new Module());
	_instance.style.backgroundColor = UIColors.WHITE;

	var _width, _height;

	_instance.init = function () {
		_instance.super.init();



	};

	_instance.resize_desktop = function (width, height) {
		_width = width * 0.75;
		_height = height;

		_instance.style.width = _instance.getWidth() + "px";
		_instance.style.height = height + "px";
	};

	_instance.getWidth = function() {
		return _width;
	};

	_instance.kill = function() {
	};

	return _instance;

}