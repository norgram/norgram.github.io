function ReturnModule( width ) {

	var _instance = Snail.extend(new Module());
	_instance.style.backgroundColor = UIColors.WHITE;
	_instance.style.cursor = "pointer";

	_instance.scaleWidth = 1;

	var _height;
	var _width = width != null ? width : 120;

	var _line;

	_instance.init = function() {
		addArrow();

		Touchable.apply(_instance);
		_instance.onClick(onClick);
	};

	_instance.addLine = function( color ) {
		_line = document.createElement("div");
		_line.style.position = "absolute";
		_line.style.backgroundColor = color;//UIColors.LINE_ON_WHITE;

		_instance.appendChild(_line);
	};

	_instance.resize_desktop = function( width, height ) {
		_height = height;

		TweenMax.set(_instance, {width:_instance.getWidth(), height:_height});

		if( _line != null ) {
			TweenMax.set( _line, { width:1, height:_height, x:0 });
		}

		if(_arrow.isLoaded()) {
			positionArrow();
		}
	};

	_instance.setWidth = function(width) {
		_width = width;
		if(_arrow.isLoaded()) {
			positionArrow();
		}
	};

	_instance.setArrowVisability = function( display ) {
		_arrow.style.display = display;
	};

	_instance.getWidth = function() {
		return _width * _instance.scaleWidth;
	};

	function addArrow() {
		_arrow = new RetinaImage( "assets/images/logo/arrow-left.png", Assets.RETINA_HANDLE, onArrowLoaded );
		_arrow.init();
	}

	function onArrowLoaded() {
		_arrow.getContent().style.transform = "rotatey(" + 180 + "deg)";
		positionArrow();
		_instance.appendChild(_arrow);
	}

	var _timelineAnimation = null;
	function updateArrowAnimation() {
		if( !BrowserDetect.MOBILE ) {
			if(_timelineAnimation != null) {
				_timelineAnimation.kill();
			}
			_timelineAnimation = new TimelineMax({repeat:-1, repeatDelay:0.5});
			_timelineAnimation.to( _arrow, 2.2, {x: 17+ 10, ease:Quad.easeInOut} );
			_timelineAnimation.to( _arrow, 2, {x: 17, ease:Elastic.easeOut} );
		}
	}

	function positionArrow() {
		TweenMax.set(_arrow, {x:17, y:27});
		updateArrowAnimation();
	}

	function onClick() {
		Assets.SCROLL_CONTROLLER.scrollToTop(1, Expo.easeInOut);
	}

	return _instance;
}
