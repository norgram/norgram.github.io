function CaseHomeModule( data, infoData, onArrowClick ) {

	var _instance = Snail.extend(new Module());
	_instance.style.backgroundColor = UIColors.WHITE;

	var ARROW_OFFSET_X = -40;

	var _guides;
	var _footer, _arrow, _body, _case, _name, _headline;

	var _width, _height;

	var _model;

	_instance.init = function() {
		_instance.super.init();
		_model = new TextAreaModel();

		setupGuides();

		addHeadline();
		addDetails();
		addName();
		addCaseInfo();
		addBody();

		addFooter();

		addArrow();
	};

	_instance.resize_desktop = function(width, height) {
		_width = width * 0.9;
		_height = height;

		_instance.style.width = _width + "px";
		_instance.style.height = _height + "px";

		var textStartX = _width * 0.4;
		var bodyHeight = _height * 0.4;

		TweenMax.set(_name, {x:_guides.getGuide("start"), y:SiteGuides.getCenterOffset()});

		TweenMax.set(_headline, {x:textStartX - 85, y:SiteGuides.OFFSET_TOP - Text.getOffsetY(_headline) } );

		TweenMax.set(_case, {x:textStartX, y:SiteGuides.OFFSET_TOP});

		TweenMax.set(_details, {x:textStartX, y:SiteGuides.OFFSET_TOP + 50});

		_body.setSize(_width - textStartX - 100, bodyHeight);
		TweenMax.set(_body, {x:textStartX, y:SiteGuides.getCenterOffset()});

		if(_arrow.isLoaded()) {
			TweenMax.set(_arrow, {x:_width - _arrow.getWidth() + ARROW_OFFSET_X, y:SiteGuides.getCenterOffset()});
		}
	};

	_instance.getWidth = function() {
		return _width;
	};

	function setupGuides() {
		_guides = new GuideLines();
		_guides.addGuide( "start", 74 - MainMenu.BORDER_WIDTH );
	}

	function addHeadline() {
		_headline = Text.getNewReg(13);
		_headline.style.color = UIColors.DARK;
		_headline.style.whiteSpace = "nowrap";
		_headline.innerHTML = "Project";

		_instance.appendChild(_headline);
	}

	function addDetails() {
		_details = Text.getNewReg(13);
		_details.style.color = UIColors.FONT_MED_ON_WHITE;
		_details.style.whiteSpace = "nowrap";
		_details.innerHTML = ContentManager.getChildByAttr(data, "name", "details" ).innerHTML;

		_instance.appendChild(_details);
	}


	function addName() {
		var text = ContentManager.getChildByAttr(data, "name", "headline").innerHTML;

		_name = new TextArea(text, Text.getNewLight(50));
		_name.init(_model, TextAreaModel.MODE_LISTEN);
		// _name.innerHTML = ContentManager.getChildByAttr(data, "name", "headline" ).innerHTML;

		_instance.appendChild(_name);
	}

	function addCaseInfo() {
		_case = new CaseSmallInfo( infoData );
		_instance.appendChild(_case);
	}

	function addBody() {
		var text = ContentManager.getChildByAttr(data, "name", "body").innerHTML;
		_body = new TextArea( text, Text.getNewLight(15) );
		_instance.appendChild( _body );

		// var model = new TextAreaModel();
		// model.maxFontSize = 50;
		_body.init(_model, TextAreaModel.MODE_CONTROL);
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