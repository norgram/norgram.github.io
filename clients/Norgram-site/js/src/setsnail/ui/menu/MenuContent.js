function MenuContent() {

	var _instance = document.createElement("div");
	_instance.style.position = "absolute";

	_instance.style.backgroundColor = UIColors.FONT_DARK;

	var _width = 0;
	var _state = MainMenu.CLOSED;

	var _selector;
	var _social;
	var _contact;
	var _footer;

	var _menuData;

	var _guides;

	var _isOpen = false;

	_instance.init = function() {
		setupGuideLines();

		_menuData = ContentManager.getChildByAttr(Assets.CONTENT_GENERAL, "name", "menu" );
		addPageSelector();
		addSocial();
		addContactInfo();
		addFooter();

		Assets.RESIZE_MANAGER.addEventListener(ResizeEvents.RESIZE, updateLayout);
		updateLayout();
	};

	_instance.open = function( speed) {
		if(speed == null) {
			speed = 0.5;
		}
		TweenMax.to(_instance, speed, {x:MainMenu.BORDER_WIDTH, ease:Expo.easeOut});
		_isOpen = true;
	};

	_instance.close = function(speed) {
		if(speed == null) {
			speed = 0.2;
		}
		TweenMax.to(_instance, speed, {x:-_width, ease:Quart.easeOut});
		_isOpen = false;
	};

	_instance.getWidth = function() {
		return _width;
	};

	function setupGuideLines() {
		// if desktop
		_guides = new GuideLines();
		_guides.addGuide( "start", 74 - MainMenu.BORDER_WIDTH );
		_guides.addGuide( "contact", 758 - MainMenu.BORDER_WIDTH );
		_guides.addGuide( "end", 1219 - MainMenu.BORDER_WIDTH );
	}

	function addPageSelector() {
		_selector = new MenuSelector(Assets.CONTENT_PAGES, _guides);
		_instance.appendChild( _selector );
		_selector.init();
	}

	function addSocial() {
		var socialData = ContentManager.getChildByAttr(_menuData, "name", "social");
		_social = new MenuSocial(socialData, _guides);
		_instance.appendChild(_social);
		_social.init();
	}

	function addContactInfo() {
		var contactData = ContentManager.getChildByAttr(_menuData, "name", "contact");
		_contact = new MenuContactInfo( contactData, _guides );
		_instance.appendChild(_contact);
		_contact.init();
	}

	function addFooter() {
		var footerData = ContentManager.getChildByAttr(_menuData, "name", "footer");
		_footer = new MenuFooter(footerData, _guides);
		_instance.appendChild( _footer );
		_footer.init();
	}

	function updateLayout() {
		_guides.setWidthTo("contact", Assets.RESIZE_MANAGER.getScreenWidth());
		_guides.setWidthTo("end", Assets.RESIZE_MANAGER.getScreenWidth());

		_width = _guides.getGuide("end");

		if(!_isOpen) {
			TweenMax.set(_instance, {x:-_width});
		}

		TweenMax.set(_instance, {width:_width, height:Assets.RESIZE_MANAGER.getScreenHeight()});
	}

	return _instance;
}