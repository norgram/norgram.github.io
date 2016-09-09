function Rectangle( x, y, width, height ){

	var _instance = {};

	_instance.x = x ? x : 0;
	_instance.y = y ? y : 0;
	_instance.width = width ? width : 0;
	_instance.height = height ? height : 0;

	return _instance;
}
