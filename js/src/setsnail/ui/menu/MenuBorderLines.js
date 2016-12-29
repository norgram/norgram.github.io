function MenuBorderLines( spacing, thickness, height ) {

	var _instance = document.createElement("div");
	_instance.style.position = "absolute";

	var colorOne = UIColors.DARK;
	var colorTwo = UIColors.WHITE;

	var _lineOne;
	var _lineTwo;

	var _ratio = 0;

	_instance.init = function() {
		_lineOne = getLine();
		_lineTwo = getLine();

		_instance.appendChild(_lineOne);

		Assets.RESIZE_MANAGER.addEventListener(ResizeEvents.RESIZE, updateLayout);
		updateLayout();
	};

	_instance.setRatio = function(ratio) {
		_ratio = ratio;

		if( _ratio < 0.5) {
			_lineOne.style.backgroundColor = _lineTwo.style.backgroundColor = colorTwo;
		} else {
			_lineOne.style.backgroundColor = _lineTwo.style.backgroundColor = colorOne;
		}
	};

	function updateLayout() {
		TweenMax.set(_lineOne, {x:-spacing * 0.5});
		TweenMax.set(_lineTwo, {x:spacing * 0.5});

		_lineTwo.style.top = _lineOne.style.top = -height * 0.5 + "px";

		_lineOne.style.height = _lineTwo.style.height = height + "px";
	}

	function getLine() {
		var line = document.createElement("div");
		line.style.position = "absolute";
		line.style.backgroundColor = colorOne;

		line.style.width = thickness + "px";
		// line.style.height = height + "px";

		_instance.appendChild(line);

		return line;
	}

	return _instance;
}
