function PrincipleSectionModule( data ) {

	var _instance = Snail.extend(new Module());
	_instance.style.backgroundColor = UIColors.DARK;

	var _line;
	var _width, _height;
	var _body, _headline;

	_instance.init = function () {
		_instance.super.init();

		addSiteLine();

		addHeadline();
		addBodyText();
	};

	_instance.resize_desktop = function (width, height) {
		_width = width * 0.25;
		_height = height;

		_instance.style.width = _instance.getWidth() + "px";
		_instance.style.height = height + "px";

		_body.setSize( _width - 22, _height * 0.3 );

		var headOffsetY = SiteGuides.OFFSET_TOP - Text.getOffsetY(_headline.getTextInstance());
		TweenMax.set( _headline, { x:11, y:headOffsetY } );
		var bodyOffsetY = SiteGuides.getCenterOffset();// - Text.getOffsetY(_body.getTextInstance());
		TweenMax.set( _body, { x:11, y:bodyOffsetY} );

		TweenMax.set( _line, { width:1, height:_height, x:1 });
	};

	_instance.getWidth = function() {
		return _width;
	};

	_instance.kill = function() {

	};

	function addSiteLine() {
		_line = document.createElement("div");
		_line.style.position = "absolute";
		_line.style.backgroundColor = UIColors.LINE_ON_DARK;

		_instance.appendChild(_line);
	}

	function addHeadline() {
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