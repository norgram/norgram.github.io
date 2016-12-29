function ResizeManager(settings) {
	var _instance						= new EventDispatcher();

	var _settings						= settings;

	var _screenWidth					= 0;
	var _windowWidth					= 0;
	var _windowHeight					= 0;

	var _currBreakPoint					= null;

	init();

	function init() {
		// trace("ResizeManager.init();");
		window.addEventListener("resize", onWindowResize);
		window.onorientationchange = onWindowResize;

		onWindowResize();
	};

	/**
	 * Resize based on the settings
	 */
	function onWindowResize(e) {
		// trace("ResizeManager.onWindowResize();");

		// resize
		_screenWidth = window.innerWidth;
		if(_settings.getRemoveScrollbar()) {
			_screenWidth -= 14;
		}
		_windowWidth = _screenWidth;

		var gridRoundTo = _settings.getRoundWidthTo();
		_windowWidth = Math.ceil(_windowWidth / gridRoundTo) * gridRoundTo;
		_windowHeight = window.innerHeight;

		if( BrowserDetect.DESKTOP ) {
			if(_settings.getMinWidth() !== - 1 && _windowWidth < _settings.getMinWidth()) {
				_windowWidth = _settings.getMinWidth();
			}

			if(_settings.getMinHeight() !== - 1 && _windowHeight < _settings.getMinHeight()) {
				_windowHeight = _settings.getMinHeight();
			}

			if(_settings.getMaxWidth() !== - 1 && _windowWidth > _settings.getMaxWidth()) {
				_windowWidth = _settings.getMaxWidth();
			}

			if(_settings.getMaxHeight() !== - 1 && _windowHeight > _settings.getMaxHeight()) {
				_windowHeight = _settings.getMaxHeight();
			}
		}


		// breakpoints
		var newBreakPoint = getNewBreakPoint();
		if(newBreakPoint !== _currBreakPoint) {
			_currBreakPoint = newBreakPoint;
			_instance.dispatchEvent(ResizeEvents.BREAKPOINT);
		}

		_instance.dispatchEvent(ResizeEvents.RESIZE);
	};

	function getNewBreakPoint() {
		// forced breakpoint
		var forceBreakPoint = _settings.getForceBreakPoint();

		if(forceBreakPoint !== null) {
			return forceBreakPoint;
		}

		// get all for analysis
		var breakPoints = _settings.getBreakPoints();
		if(breakPoints === null) {
			return null;
		}

		// calculate
		var l 				= breakPoints.length;
		var breakPoint		= null;
		for(var i = 0; i < l; i += 1) {
			breakPoint = breakPoints[i];
			if(_windowWidth < breakPoint.width) {
				return breakPoint;
			}
		}

		return null;
	};

	/**
	 * Listen for resize
	 */
	_instance.getWindowWidth = function() {
		return _windowWidth;
	};

	_instance.getWindowHeight = function() {
		return _windowHeight;
	};

	_instance.getSettings = function() {
		return _settings;
	};

	_instance.getScreenWidth = function() {
		return _screenWidth;
	};

	_instance.getScreenHeight = function() {
		return _instance.getWindowHeight();
	};

	_instance.getBreakPoint = function() {
		return _currBreakPoint.id;
	};

	_instance.getBreakPointIndex = function() {
		return _currBreakPoint.index;
	};

	return _instance;
}
