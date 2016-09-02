function BasicHomeModule(data, onArrowClick, scaleWidth ) {

	var _instance = Snail.extend(new Module());
	_instance.style.backgroundColor = UIColors.WHITE;

	var ARROW_OFFSET_X = -40;

	var _widthScale = scaleWidth != null ? scaleWidth : 0.9;

	var _guides;

	var _header;
	var _story;
	var _body;
	var _link;

	var _footer;

	var _arrow;

	var _width = 0;
	var _height = 0;

	_instance.init = function() {
		_instance.super.init();

		_instance.moduleId = "HOME";

		setupGuides();

		addHeaderInfo();
		addStory();
		addLink();
		addBody();
		addFooter();

		addArrow();
	};

	_instance.resize_desktop = function(width, height) {
		_width = width * _widthScale;
		_height = height;

		_instance.style.width = _width + "px";
		_instance.style.height = _height + "px";

		var endLine = _width * 0.8 - MainMenu.BORDER_WIDTH;
		var bodyHeight = _height * 0.4;

		if( _link != null) {
			// endLine = _width * 0.5 - MainMenu.BORDER_WIDTH;
			bodyHeight = _height * 0.25;

			TweenMax.set(_link, {x:_guides.getGuide("start"), y:_height * 0.75});
		}

		_header.setSize( _width * 0.2, 60 );
		TweenMax.set(_header, {x:_guides.getGuide("start"), y:SiteGuides.OFFSET_TOP});

		// console.log(width * 0.5);
		if(_story != null) {
			_story.setSize(_width * 0.3, _height * 0.15 );
			TweenMax.set(_story, {x:endLine - _story.getModel().maxWidth, y:SiteGuides.OFFSET_TOP});
		}

		_body.setSize(endLine, bodyHeight);
		TweenMax.set(_body, {x:_guides.getGuide("start"), y:SiteGuides.getCenterOffset()});

		if(_arrow.isLoaded()) {
			TweenMax.set(_arrow, {x:_width - _arrow.getWidth() + ARROW_OFFSET_X, y:SiteGuides.getCenterOffset()});
		}
	};

	_instance.kill = function() {

	};

	_instance.getWidth = function() {
		return _width;
	};

	_instance.getHeight = function() {
		return _height;
	};

	function setupGuides() {
		_guides = new GuideLines();
		_guides.addGuide( "start", 74 - MainMenu.BORDER_WIDTH );
	}

	function addStory() {
		var text = ContentManager.getChildByAttr(data, "name", "story");
		if( text == null ) {
			return;
		}

		_story = new TextArea(text.innerHTML, Text.getNewReg(13));
		_story.setColor(UIColors.FONT_MED_ON_WHITE);

		var model = new TextAreaModel();

		model.minFontSize = 13;
		model.maxFontSize = 13;

		model.minWidth = 468;
		model.maxWidth = 468;

		_instance.appendChild(_story);

		_story.init(model);
		_story.setColumns(2, 20);

	}

	function addLink() {
		var text = ContentManager.getChildByAttr(data, "name", "link");
		if( text == null ) {
			return;
		}

		_link = new TextButton(Text.getNewLight(18), UIColors.FONT_MED_ON_WHITE, text.getAttribute("data-link"));
		_link.innerHTML = text.innerHTML;
		_link.init();
		_link.addClass("sliding-grey-small");

		_instance.appendChild(_link);

	}

	function addHeaderInfo() {
		var text = ContentManager.getChildByAttr(data, "name", "founded").innerHTML;
		_header = new TextArea( text, Text.getNewReg(13) );

		var model = new TextAreaModel();

		model.minFontSize = 13;
		model.maxFontSize = 13;

		model.minWidth = 215;
		model.maxWidth = 215;

		_header.setColor(UIColors.FONT_MED_ON_WHITE);
		_instance.appendChild(_header);

		_header.init(model);
	}

	function addBody() {
		var text = ContentManager.getChildByAttr(data, "name", "body").innerHTML;
		_body = new TextArea( text, Text.getNewLight(15) );
		_instance.appendChild( _body );

		_body.init();
	}

	function addFooter() {
		_footer = new Footer(_guides);
		_instance.appendChild(_footer);
		_footer.init();
	}

	function addArrow() {
		_arrow = new RetinaImage( "assets/images/logo/arrow-left.png", Assets.RETINA_HANDLE, onArrowLoaded );
		_arrow.init();
		_arrow.style.cursor = "pointer";

		if(onArrowClick != null) {
			Touchable.apply( _arrow );
			_arrow.onClick( onArrowClick );
		}
	}


	function onArrowLoaded() {
		TweenMax.set(_arrow, {x:_width - _arrow.getWidth() + ARROW_OFFSET_X, y:SiteGuides.getCenterOffset()});
		_instance.appendChild(_arrow);
	}

	return _instance;

}