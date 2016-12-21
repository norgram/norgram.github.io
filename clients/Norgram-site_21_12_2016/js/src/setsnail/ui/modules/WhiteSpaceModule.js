function WhiteSpaceModule( width, color ) {

	var _instance = Snail.extend(new Module());
	var _color = color != null ? color : UIColors.WHITE;
	_instance.style.backgroundColor = _color;

	var _width = width != null ? width : 200;

	_instance.getWidth = function() {
		return _width;
	};

	_instance.resize_desktop = function( width, height ) {
		_height = height;

		TweenMax.set(_instance, {width:_instance.getWidth(), height:_height});
	};

	_instance.setWidth = function(width) {
		_width = width;
	};

	return _instance;
}