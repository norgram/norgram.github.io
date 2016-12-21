Module.DEFAULT_SPACING			= [80, 80, 40];

Module.getDefaultSpace = function() {
	return Module.DEFAULT_SPACING[Assets.RESIZE_MANAGER.getBreakPointIndex()];
};

function Module(guides) {
	var _instance = document.createElement("div");
	_instance.style.position = "absolute";

	_instance.width				= 0;
	_instance.height			= 0;
	_instance.guides			= guides;

	_instance.moduleId = "NOT STE";

	_instance.dispatcher		= null;

	//Used in ModulesScroller for performance boosting;
	_instance.scrollInfo 		= { y:0, index:0 };

	var _callbackResize			= null;
	var _callbackReposition		= null;
	var _callbackLoaded			= null;

	var _space					= 0;

	_instance.theme				= UIColors.LIGHT;

	_instance.init = function() {
		// _instance.setColorTheme(_instance.theme);
		_instance.doneLoading();
	};

	_instance.doneLoading = function() {
		if(_callbackLoaded !== null) {
			_callbackLoaded();
		}
	};

	_instance.setSpace = function(space) {
		_space = space;
	};

	_instance.getSpace = function() {
		if(_space === - 1) {
			return Module.getDefaultSpace();
		}
		return _space;
	};

	_instance.resize_desktop = function(width, height) {
		_instance.width = width;
		_instance.height = height;
	};

	_instance.resize_tablet = function(width, height) {
		_instance.resize_desktop(width, height);
	};

	_instance.resize_mobile = function(width, height) {
		_instance.resize_tablet(width, height);
	};

	// _instance.setColorTheme = function( theme ) {
	// 	_instance.theme = theme;
	// 	_instance.setBackgroundColor(_instance.theme);
	// };

	_instance.setCallbackResize = function( callback ) {
		_callbackResize = callback;
	};

	_instance.setCallbackReposition = function( callback ) {
		_callbackReposition = callback;
	};

	_instance.setCallbackLoaded = function( callback ) {
		_callbackLoaded = callback;
	};

	_instance.callbackResize = function() {
		if(_callbackResize !== null) {
			_callbackResize(_instance);
		}
	};

	_instance.visibilityRatio = function(ratio) {
	};

	_instance.callbackReposition = function() {
		if(_callbackReposition !== null) {
			_callbackReposition(_instance);
		}
	};

	_instance.scrollToModule = function() {

	};

	_instance.getX = function() {
		return _instance.aniGetX();
	};

	// _instance.setBackgroundColor = function( color ) {
	// 	_instance.style.backgroundColor = color;
	// };

	_instance.kill = function() {
	};

	_instance.getWidth = function() {
		return _instance.width + _instance.getSpace();
	};

	_instance.getHeight = function() {
		return _instance.height + _instance.getSpace();
	};

	return _instance;
}
