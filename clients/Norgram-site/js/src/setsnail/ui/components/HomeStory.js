function HomeStory( data, storyNumber, bodyTextModel ) {
	var _instance = document.createElement("div");
	_instance.style.position = "absolute";
	_instance.style.backgroundColor = ColorUtils.WHITE;

	_instance.style.cursor = "pointer";

	_instance.onStoryClick;

	Touchable.apply(_instance);

	var _ratio, _oldRatio, _ratioOffset = 0;

	var _widthExpanded, _widthCollapsed;

	var _line, _imageSlider, _body, _bodyTop, _bodyMask, _headline, _tag, _date, _number;

	var _numberColorActive = ColorUtils.hex2rgb( UIColors.FONT_DARK );
	var _numberColorDeactive = ColorUtils.hex2rgb( UIColors.LINE_ON_WHITE );

	var _mode = TextAreaModel.MODE_LISTEN;

	var _leftButton, _rightButton;
	var _buttonContainer = document.createElement("div");
	_buttonContainer.style.position = "absolute";

	_instance.setBodyModelController = function() {
		_mode = TextAreaModel.MODE_CONTROL;
	};

	_instance.init = function() {
		// Touchable.apply(_instance);
		_instance.onClick(onEverywhereClick);

		addSiteLine();
		addSlideButtons();
		addImageSlide();
		addHeadline();
		addImgTag();
		addTopBody();
		addBody();
		addDate();
		addNumber();
	};

	_instance.setExpandedWidth = function(width) {
		_widthExpanded = width;
	};
	_instance.setCollapsedWidth = function( width) {
		_widthCollapsed = width;
	};

	_instance.setHeight = function(height) {
		_height = height;
		_instance.style.height = _height + "px";
		TweenMax.set( _line, { width:1, height:_height, x:0 });
	};

	_instance.getWidth = function() {
		var delta = _widthExpanded - _widthCollapsed;
		return _widthCollapsed + delta * _ratio;
	};

	_instance.setRatioOffset = function(offsetStart) {
		_ratioOffset = offsetStart;
	};

	_instance.setRatio = function(ratio, forceUpdate) {
		_ratio = MathUtils.ratioFromRatio(_ratioOffset, _ratioOffset + 1, ratio);
		if(_ratio < 0) {
			_ratio = 0;
		} else if(_ratio > 1) {
			_ratio = 1;
		}

		_instance.style.width = _instance.getWidth() + "px";

		updateToRatio(forceUpdate);
	};

	function onEverywhereClick(){
		if(_instance.onStoryClick != null) {
			_instance.onStoryClick( storyNumber );
		}
	}

	function updateToRatio( force ) {
		if(!force && _ratio == _oldRatio ) {
			return;
		}

		var delta = _widthExpanded - _widthCollapsed;
		var deltaRatio = delta * _ratio;

		var margin = 9;
		var doubleMargin = margin * 2;

		var imgYPos = SiteGuides.getCenterOffset() + 125;

		var collapsedImgHeight = (_widthCollapsed - doubleMargin) * 0.51;
		var expImgHeight = _height - imgYPos;

		var imgHeight = collapsedImgHeight + (expImgHeight - collapsedImgHeight) * _ratio;


		//UPDATE NUMBER
		TweenMax.set(_number, {x:deltaRatio + margin, y:SiteGuides.OFFSET_TOP - Text.getOffsetY(_number) - 40 * Math.cos(_ratio * Math.PI + Math.PI * 0.5),  width:_widthCollapsed - doubleMargin });
		var easeColor = ColorUtils.interpolateRGB(_numberColorDeactive, _numberColorActive, _ratio);
		_number.style.color = 'rgb(' + easeColor.r + ',' + easeColor.g + ',' + easeColor.b + ')';

		//UPDATE HEADLINE
		TweenMax.set(_headline, {x:deltaRatio + margin, y:SiteGuides.getCenterOffset() - Text.getOffsetY(_headline),  width:_widthCollapsed - doubleMargin });

		//UPATE BUTTONS
		var buttonLeftEase = Back.easeOut.getRatio(MathUtils.ratioFromRatio(0.1, 0.8, _ratio));
		var buttonRightEase = Back.easeOut.getRatio(MathUtils.ratioFromRatio(0.3, 1, _ratio));
		TweenMax.set(_leftButton, {y:imgYPos + 40 - 72 * buttonLeftEase, x:margin});
		TweenMax.set(_rightButton, {y:imgYPos + 40 - 72 * buttonRightEase, x:margin + 32});

		//UPDATE IMAGE
		TweenMax.set(_imageSlider, {y:imgYPos , x:margin});
		_imageSlider.setSize(_instance.getWidth() - doubleMargin, imgHeight );

		//UPDATE BODY TOP MASK
		TweenMax.set(_bodyMask, {x:deltaRatio + margin, y:0,  width:_widthCollapsed - doubleMargin, height:1000 });

		//UPDATE BODY TOP
		TweenMax.set(_bodyTop, {x:0, y:130 - 30 * Math.cos(-1 + _ratio * 2 * Math.PI), width:_widthCollapsed - doubleMargin, alpha:(-1 + _ratio * 2) });

		//UPDATE BODY
		TweenMax.set(_body, {x:deltaRatio + margin, y:imgYPos + imgHeight + margin,  width:_widthCollapsed - doubleMargin, alpha:(1 - _ratio * 2) });
		_body.setSize( _widthCollapsed - doubleMargin, (_height - imgYPos - collapsedImgHeight - margin) * 0.5 );

		//UPDATE IMG TAG
		TweenMax.set(_tag, {x:deltaRatio + margin, y:imgYPos - Text.getOffsetY(_tag) - doubleMargin,  width:_widthCollapsed - doubleMargin });

		//UPDATE DATE
		TweenMax.set(_date, {x:deltaRatio + margin, y:SiteGuides.getCenterOffset() - Text.getOffsetY(_date) - 40,  width:_widthCollapsed - doubleMargin });

		_oldRatio = _ratio;
	}

	function addSiteLine() {
		_line = document.createElement("div");
		_line.style.position = "absolute";
		_line.style.backgroundColor = UIColors.LINE_ON_WHITE;

		_instance.appendChild(_line);
	}

	function addSlideButtons() {
		_leftButton = new RetinaImage("assets/images/logo/arrow_short.png", Assets.RETINA_HANDLE);
		_rightButton = new RetinaImage("assets/images/logo/arrow_short.png", Assets.RETINA_HANDLE);
		_leftButton.init();
		_rightButton.init();

		_leftButton.getContent().style.transform = "rotatey(" + 180 + "deg)";

		// TweenMax.set( _leftButton, { width:40, height:40 } );
		// TweenMax.set( _rightButton, { width:40, height:40 } );

		_buttonContainer.appendChild(_leftButton);
		_buttonContainer.appendChild(_rightButton);
		_instance.appendChild(_buttonContainer);
	}

	function addImageSlide() {
		var slideData = ContentManager.getChildByAttr(data, "name", "images");
		var slides = ContentManager.getChildrenByAttr(slideData, "name", "image");
		// console.log(slides[0].innerHTML);

		_imageSlider = new RetinaImage(slides[0].innerHTML);
		_imageSlider.init();
		_imageSlider.setResizeMode("insideBox");
		_imageSlider.setPosition("center/center");

		// _imageSlider.setSize(_width, _height);

		_instance.appendChild(_imageSlider);
	}

	function addNumber() {
		_number = Text.getNewMed(95);
		_number.innerHTML = storyNumber;
		_number.style.color = UIColors.FONT_MED_ON_WHITE;

		_instance.appendChild(_number);
	}

	function addDate() {
		var dateData = ContentManager.getChildByAttr(data, "name", "date");

		_date = Text.getNewLight(13);//new TextArea(bodyData.innerHTML, TEXT.getNewReg(13));
		_date.innerHTML = dateData.innerHTML;
		_date.style.color = UIColors.FONT_DARK;

		_instance.appendChild(_date);
	}

	function addHeadline() {
		var headlineData = ContentManager.getChildByAttr(data, "name", "headline");

		_headline = Text.getNewReg(23);//new TextArea(bodyData.innerHTML, TEXT.getNewReg(13));
		_headline.innerHTML = headlineData.innerHTML;
		_headline.style.color = UIColors.FONT_DARK;

		_instance.appendChild(_headline);
	}

	function addTopBody() {
		var bodyData = ContentManager.getChildByAttr(data, "name", "body");

		_bodyTop = new TextArea(bodyData.innerHTML, Text.getNewReg(13));
		_bodyTop.init(bodyTextModel, TextAreaModel.MODE_LISTEN );
		// _bodyTop.innerHTML = bodyData.innerHTML;
		_bodyTop.style.color = UIColors.FONT_MED_ON_WHITE;

		_bodyMask = document.createElement("div");
		_bodyMask.style.position = "absolute";
		// _bodyMask.style.overflow = "hidden";

		_bodyMask.appendChild(_bodyTop);
		_instance.appendChild(_bodyMask);
	}

	function addBody() {
		var bodyData = ContentManager.getChildByAttr(data, "name", "body");

		_body = new TextArea( bodyData.innerHTML, Text.getNewReg(13) );//new TextArea(bodyData.innerHTML, TEXT.getNewReg(13));
		//
		// var mode = TextAreaModel.MODE_LISTEN;
		// if(storyNumber == 8) {
		// 	mode = TextAreaModel.MODE_CONTROL;
		// }

		_body.init(bodyTextModel, _mode );
		_body.style.color = UIColors.FONT_MED_ON_WHITE;

		_instance.appendChild(_body);
	}

	function addImgTag() {
		var tagData = ContentManager.getChildByAttr(data, "name", "image-tag-name");

		_tag = Text.getNewReg(13);//new TextArea(bodyData.innerHTML, TEXT.getNewReg(13));
		_tag.innerHTML = tagData.innerHTML;
		_tag.style.color = UIColors.FONT_DARK;

		_instance.appendChild(_tag);
	}

	return _instance;
}