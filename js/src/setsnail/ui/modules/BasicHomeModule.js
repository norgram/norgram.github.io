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

	var _extendedWidth = 0;

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

	_instance.resize_mobile = function(width, height) {
		_guides.setGuide( "start", 54 - MainMenu.BORDER_WIDTH );
		_width = width * _widthScale;
		_height = height;

		if(_story != null && _width < 700) {
			_width = width;
			_extendedWidth = Math.floor(_width * 0.7);
		} else {
			_extendedWidth = 0;
		}


		_instance.style.width = _width + _extendedWidth + "px";
		_instance.style.height = _height + "px";

		var endLine = _width * 0.8 - MainMenu.BORDER_WIDTH;
		var bodyHeight = _height * 0.4;

		if( _link != null) {
			// endLine = _width * 0.5 - MainMenu.BORDER_WIDTH;
			bodyHeight = _height * 0.25;

			TweenMax.set(_link, {x:_guides.getGuide("start"), y:Math.round(_height * 0.75)});
		}

		_header.setSize( _width * 0.2, 60 );
		TweenMax.set(_header, {x:_guides.getGuide("start"), y:SiteGuides.OFFSET_TOP});

		var headerEndX = _header.offsetWidth + _guides.getGuide("start");

		// console.log(width * 0.5);
		if(_story != null) {
			var storyX = 0;
			var storyY = SiteGuides.OFFSET_TOP;
			if( _extendedWidth > 0 ) {
				storyX = _width + _guides.getGuide("start");
				storyY = SiteGuides.getCenterOffset();
				// console.log(_extendedWidth);

				_story.getModel().maxWidth = 999999;
				_story.getModel().minWidth = 0;

				_story.getModel().minFontSize = 8;
				_story.getModel().maxFontSize = 30;


				_story.setSize(_extendedWidth - _guides.getGuide("start") * 2, _height - storyY );
				_story.setColumns(1, 0);

			} else {

				_story.getModel().minWidth = 468;
				_story.getModel().maxWidth = 468;
				_story.getModel().minFontSize = 13;
				_story.getModel().maxFontSize = 13;

				_story.setSize(_width * 0.3, _height * 0.15 );
				_story.setColumns(2, 20);
				storyX = endLine - _story.getModel().maxWidth;
				if(storyX < headerEndX) {
					storyX = headerEndX + 10;
				}
			}
			
			TweenMax.set(_story, {x:storyX, y:storyY});
		}

		_body.setSize(endLine, bodyHeight);

		TweenMax.set(_body, {x:_guides.getGuide("start") - 2 * SiteGuides.getDesignWidthRatio(), y:SiteGuides.getCenterOffset()});

		_footer.updateLayout();

		var arrowOffset = -10;

		if(_arrow.isLoaded()) {
			TweenMax.set(_arrow, {x:_width - _arrow.getWidth() + arrowOffset, y:SiteGuides.getCenterOffset()});
		}
	};

	_instance.resize_desktop = function(width, height) {
		_guides.setGuide( "start", 74 - MainMenu.BORDER_WIDTH );
		_width = width * _widthScale;
		_height = height;

		if(_story != null && _width < 700) {
			_width = width;
			_extendedWidth = Math.floor(_width * 0.7);
		} else {
			_extendedWidth = 0;
		}


		_instance.style.width = _width + _extendedWidth + "px";
		_instance.style.height = _height + "px";

		var endLine = _width * 0.8 - MainMenu.BORDER_WIDTH;
		var bodyHeight = _height * 0.4;

		if( _link != null) {
			// endLine = _width * 0.5 - MainMenu.BORDER_WIDTH;
			bodyHeight = _height * 0.25;

			TweenMax.set(_link, {x:_guides.getGuide("start"), y:Math.round(_height * 0.75)});
		}

		_header.setSize( _width * 0.2, 60 );
		TweenMax.set(_header, {x:_guides.getGuide("start"), y:SiteGuides.OFFSET_TOP});

		var headerEndX = _header.offsetWidth + _guides.getGuide("start");

		// console.log(width * 0.5);
		if(_story != null) {
			var storyX = 0;
			var storyY = SiteGuides.OFFSET_TOP;
			if( _extendedWidth > 0 ) {
				storyX = _width + _guides.getGuide("start");
				storyY = SiteGuides.getCenterOffset();
				// console.log(_extendedWidth);

				_story.getModel().maxWidth = 999999;
				_story.getModel().minWidth = 0;

				_story.getModel().minFontSize = 8;
				_story.getModel().maxFontSize = 30;


				_story.setSize(_extendedWidth - _guides.getGuide("start") * 2, _height - storyY );
				_story.setColumns(1, 0);

			} else {

				_story.getModel().minWidth = 468;
				_story.getModel().maxWidth = 468;
				_story.getModel().minFontSize = 13;
				_story.getModel().maxFontSize = 13;

				_story.setSize(_width * 0.3, _height * 0.15 );
				_story.setColumns(2, 20);
				storyX = endLine - _story.getModel().maxWidth;
				if(storyX < headerEndX) {
					storyX = headerEndX + 10;
				}
			}
			
			TweenMax.set(_story, {x:storyX, y:storyY});
		}

		_body.setSize(endLine, bodyHeight);

		_footer.updateLayout();

		TweenMax.set(_body, {x:_guides.getGuide("start") - 2 * SiteGuides.getDesignWidthRatio(), y:SiteGuides.getCenterOffset()});
		if(_arrow.isLoaded()) {
			TweenMax.set(_arrow, {x:_width - _arrow.getWidth() + ARROW_OFFSET_X, y:SiteGuides.getCenterOffset()});
		}

		updateArrowAnimation();

	};

	_instance.kill = function() {

	};

	_instance.getWidth = function() {
		return _width + _extendedWidth;
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

		var txtInstance = Text.getNewReg(13);
		txtInstance.lineHeightOffset = 1;
		_story = new TextArea(text.innerHTML, txtInstance );
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
		

		_instance.appendChild(_link);

	}

	function addHeaderInfo() {
		var text = ContentManager.getChildByAttr(data, "name", "founded").innerHTML;

		var textInstance = Text.getNewReg(13);
		textInstance.lineHeightOffset = 1;
		_header = new TextArea( text, textInstance );

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
		TweenMax.set(_arrow, {x:_width - _arrow.getWidth() + ARROW_OFFSET_X, y:SiteGuides.getCenterOffset() + 4});
		_instance.appendChild(_arrow);

		updateArrowAnimation();
	}

	var _timelineAnimation = null;
	function updateArrowAnimation() {
		if( !BrowserDetect.MOBILE ) {
			if(_timelineAnimation != null) {
				_timelineAnimation.kill();
			}

			_timelineAnimation = new TimelineMax({repeat:-1, repeatDelay:0.5});
			_timelineAnimation.to( _arrow, 2.2, {x: _width - _arrow.getWidth() + ARROW_OFFSET_X - 12, ease:Quad.easeInOut} );
			_timelineAnimation.to( _arrow, 2, {x: _width - _arrow.getWidth() + ARROW_OFFSET_X, ease:Elastic.easeOut} );
		}
	}

	return _instance;

}