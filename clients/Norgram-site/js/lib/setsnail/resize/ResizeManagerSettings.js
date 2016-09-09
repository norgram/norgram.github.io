function ResizeManagerSettings() {
	var _instance					= {};

	// settings
	var _minWidth					= - 1;
	var _maxWidth					= - 1;
	var _minHeight					= - 1;
	var _maxHeight					= - 1;
	var _roundWidthTo				= 1;
	var _removeScrollbar			= true;

	var _breakPoints				= null;
	var _idToBreakPoint				= {};
	var _forceBreakPointId			= null;

	_instance.setBreakPoints = function(data /*[{width: int, id: string}]*/) {
		_breakPoints = data;

		var l				= _breakPoints.length;
		var breakPoint		= null;

		for(var i = 0; i < l; i += 1) {
			breakPoint 							= _breakPoints[i];
			breakPoint.index 					= (l - 1) - i;
			_idToBreakPoint[breakPoint.id] 		= breakPoint;
//			trace(breakPoint.id + " - " + breakPoint.index);
		}
	};

	_instance.forceBreakPoint = function(id) {
		_forceBreakPointId = id;
	};

	_instance.getForceBreakPoint = function() {
		if(_forceBreakPointId === null) {
			return null;
		}

		return _idToBreakPoint[_forceBreakPointId];
	};

	_instance.getBreakPoints = function() {
		return _breakPoints;
	};


	/**
	 * Change settings here
	 */
	_instance.setMinWidth = function(width)	{
		_minWidth = width;
	};
	_instance.getMinWidth = function() {
		return _minWidth;
	};

	_instance.setMaxWidth = function(width) {
		_maxWidth = width;
	};

	_instance.getMaxWidth = function() {
		return _maxWidth;
	};

	_instance.setMinHeight = function(height) {
		_minHeight = height;
	};
	_instance.getMinHeight = function() {
		return _minHeight;
	};

	_instance.setMaxHeight = function(height) {
		_maxHeight = height;
	};
	_instance.getMaxHeight = function() {
		return _maxHeight;
	};


	_instance.setRoundWidthTo = function(val) {
		_roundWidthTo = val;
	};

	_instance.getRoundWidthTo = function(val) {
		return _roundWidthTo;
	};

	_instance.setRemoveScrollbar = function(val) {
		_removeScrollbar = val;
	};

	_instance.getRemoveScrollbar = function() {
		return _removeScrollbar;
	};

	return _instance;
}
