function MenuBorder( thickness ) {

	var _instance = document.createElement("div");
	_instance.style.position = "absolute";
	_instance.style.cursor = "pointer";

	Touchable.apply( _instance );

	var PICKER_HEIGHT = 30;

	var _logo;
	var _line;
	var _picker;

	var _state;

	_instance.init = function() {
		addLogo();
		addLine();
		addPicker();

		Assets.RESIZE_MANAGER.addEventListener(ResizeEvents.RESIZE, updateLayout);

		_instance.setState(MainMenu.CLOSED);

		updateLayout();
	};

	_instance.toggleState = function() {
		if(_state == MainMenu.OPEN) {
			_instance.setState(MainMenu.CLOSED);
		} else {
			_instance.setState(MainMenu.OPEN);
		}
	};

	_instance.setState = function( state ) {
		_state = state;
		switch( _state ) {
			case MainMenu.OPEN : {
				_instance.style.backgroundColor = UIColors.DARK;
				_logo.setRatio(0);
				_picker.setRatio(0);

				_line.style.backgroundColor = UIColors.LINE_ON_DARK;
				break;
			}
			case MainMenu.CLOSED : {
				_instance.style.backgroundColor = UIColors.WHITE;
				_logo.setRatio(1);
				_picker.setRatio(1);

				_line.style.backgroundColor = UIColors.LINE_ON_WHITE;
				break;
			}
			default : break;
		}
	};

	function addLogo() {
		var imgOffset = 31;

		_logo = new MenuLogo();
		_logo.init();
		TweenMax.set( _logo, {x:thickness * 0.5, y: SiteGuides.OFFSET_TOP + imgOffset});
		_instance.appendChild(_logo);
	}

	function addLine() {
		_line = document.createElement("div");
		_line.style.position = "absolute";

		_instance.appendChild(_line);
	}

	function updateLayout() {
		_instance.style.width = thickness + "px";
		_instance.style.height = Assets.RESIZE_MANAGER.getWindowHeight() + "px";

		var lineThickness = 1;
		_line.style.width = lineThickness + "px";
		_line.style.height = Assets.RESIZE_MANAGER.getWindowHeight() + "px";
		_line.style.left = thickness - lineThickness + "px";

		TweenMax.set( _picker, {
			y:SiteGuides.getCenterOffset() + PICKER_HEIGHT * 0.5,
			x:thickness * 0.5 - 5 * 0.5 + 2
		} );
	}

	function addPicker() {
		_picker = new MenuBorderLines(6, 1, PICKER_HEIGHT);
		_picker.init();

		_instance.appendChild(_picker);
	}

	return _instance;
}
