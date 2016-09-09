function MainMenu() {

	MainMenu.OPEN = "OPEN";
	MainMenu.CLOSED = "CLOSED";

	MainMenu.BORDER_WIDTH = SiteGuides.MAIN_MENU_WIDTH;

	var _instance = document.createElement("div");
	_instance.style.position = "absolute";

	var _state = MainMenu.CLOSED;

	var _border;
	var _content;

	_instance.init = function() {
		addMenuContent();
		addBorder();

		TweenMax.set(Assets.LAYER_TEMPLATE_OFFSET, {x:MainMenu.BORDER_WIDTH});

		// window.addEventListener("hashchange", _instance.collapseMenu);
	};

	_instance.openMenu = function() {
		if(_state == MainMenu.CLOSED) {
			toggleState();
		}
	};

	_instance.collapseMenu = function() {
		if(_state == MainMenu.OPEN) {
			toggleState();
		}
	};

	function addMenuContent() {
		_content = new MenuContent();
		_content.init();


		_instance.appendChild(_content);
	}

	function addBorder(){
		_border = new MenuBorder( SiteGuides.MAIN_MENU_WIDTH );
		_border.init();
		_border.onClick( onBorderClick );

		_instance.appendChild(_border);
	}

	function onBorderClick() {
		toggleState();
	}

	function toggleState() {
		if(_state == MainMenu.OPEN) {
			_state = MainMenu.CLOSED;
		} else {
			_state = MainMenu.OPEN;
		}

		var speed = 0.2;

		TweenMax.to(_border, speed, {x:-MainMenu.BORDER_WIDTH, ease:Quart.easeOut, onComplete:onBorderOut});

		if(_state == MainMenu.CLOSED) {
			_content.close(speed);
			TweenMax.to(Assets.LAYER_TEMPLATE_OFFSET, speed, {x:0, ease:Quart.easeOut});
		} else {
			TweenMax.to(Assets.LAYER_TEMPLATE_OFFSET, speed, {x:0, ease:Quart.easeOut});
		}
	}

	function onBorderOut() {
		_border.setState(_state);
		TweenMax.to(_border, 0.2, {x:0, ease:Quart.easeOut});

		var openSpeed = 0.5;

		if(_state == MainMenu.OPEN) {
			_content.open(openSpeed);
			TweenMax.to(Assets.LAYER_TEMPLATE_OFFSET, openSpeed, {x:MainMenu.BORDER_WIDTH + _content.getWidth(), ease:Expo.easeOut});
		} else {
			TweenMax.to(Assets.LAYER_TEMPLATE_OFFSET, 0.2, {x:MainMenu.BORDER_WIDTH, ease:Quart.easeOut});
		}
	}

	function updateContent() {

	}



	return _instance;
}
