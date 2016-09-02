function ProfileInfoModule( data, infoShow, slideNumber ) {

	var _instance = Snail.extend(new Module());
	_instance.style.backgroundColor = UIColors.DARK;

	var START_OFFSET_X = 0;

	var _slideNumber;
	var _line;

	var _body, _headline;

	var _width, _height;

	_instance.init = function () {
		_instance.super.init();

		_instance.moduleId = "INFO" + slideNumber;
		addSiteLine();
		addSlideNumber();

		addHeadlineText();
		addBodyText();
	};

	_instance.resize_desktop = function (width, height) {
		_width = width;
		_height = height;

		_body.setSize( _width / 3, _height / 4 );
		_headline.getTextInstance().style.fontSize = _body.getTextInstance().style.fontSize;
		_headline.getTextInstance().updateLineHeight();

		var headOffsetY = SiteGuides.OFFSET_TOP - Text.getOffsetY(_headline.getTextInstance());
		TweenMax.set( _headline, { x:11, y:headOffsetY } );
		TweenMax.set( _body, { x:11, y:headOffsetY + parseInt(_body.getTextInstance().style.lineHeight) + 8} );

		_instance.style.width = _instance.getWidth() + "px";
		_instance.style.height = height + "px";

		TweenMax.set( _line, { width:1, height:_height, x:1 });

		TweenMax.set(_slideNumber, {
			x: START_OFFSET_X + 11,
			y: _height - _slideNumber.offsetHeight - SiteGuides.OFFSET_BOTOM + 12
		});
	};

	_instance.getWidth = function () {
		return _width;
	};

	_instance.kill = function () {

	};

	function addSiteLine() {
		_line = document.createElement("div");
		_line.style.position = "absolute";
		_line.style.backgroundColor = UIColors.LINE_ON_DARK;

		_instance.appendChild(_line);
	}

	function addSlideNumber() {
		_slideNumber = Text.getNewReg(90);
		_slideNumber.innerHTML = slideNumber;
		_slideNumber.style.color = UIColors.WHITE;

		_instance.appendChild(_slideNumber);
	}

	function addHeadlineText() {
		var textData = ContentManager.getChildByAttr( data, "name", "headline" );

		_headline = new TextArea( textData.innerHTML, Text.getNewLight(28) );
		_headline.style.color = UIColors.WHITE;
		_headline.getTextInstance().style.whiteSpace = "nowrap";

		_headline.init();

		_instance.appendChild(_headline);
	}

	function addBodyText() {
		var textData = ContentManager.getChildByAttr( data, "name", "body" );

		_body = new TextArea( textData.innerHTML, Text.getNewLight(28) );
		_body.style.color = UIColors.FONT_MED_ON_DARK;
		_body.init();


		_instance.appendChild(_body);
	}

	return _instance;
}