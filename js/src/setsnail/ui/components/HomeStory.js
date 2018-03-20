function HomeStory( data, storyNumber, bodyTextModel ) {
	var _instance = document.createElement("div");
	_instance.style.position = "absolute";
	_instance.style.backgroundColor = ColorUtils.WHITE;

	_instance.onStoryClick;
	// _instance.style.cursor = "pointer";

	Touchable.apply(_instance);

	var _ratio = 1;
	var _oldRatio = -1;
	var _ratioOffset = 0;

	var _isLastStory = false;

	var _widthExpanded, _widthCollapsed;

	var _reverseStories = [];
	var _hasReverseStories = false;

	var _numOfImages = 0;

	var _line, _imageSlider, _body, _bodyTop, _bodyMask, _headline, _tag, _date, _number;
	var _leftButton, _rightButton;

	var _numberColorActive = ColorUtils.hex2rgb( UIColors.FONT_DARK );
	var _numberColorDeactive = ColorUtils.hex2rgb( UIColors.LINE_ON_WHITE );

	var _mode = TextAreaModel.MODE_LISTEN;

	var _overrideRatioToOne = false;

	var _ratioWidthOverflow = 0;

	var _buttonContainer = document.createElement("div");
	_buttonContainer.style.position = "absolute";

	_instance.setBodyModelController = function() {
		_mode = TextAreaModel.MODE_CONTROL;
	};

	_instance.init = function() {
		_instance.onClick(onEverywhereClick);

		var slideData = ContentManager.getChildByAttr(data, "name", "images");
		var slides = ContentManager.getChildrenByAttr(slideData, "name", "image");
		_numOfImages = slides.length;

		addSiteLine();
		if( !BrowserDetect.MOBILE ) {
			addSlideButtons();
		}
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
		TweenMax.set( _line, { width:1, x:-1, height:_height });
	};

	_instance.getWidth = function() {
		var delta = _widthExpanded - _widthCollapsed;
		return _widthCollapsed + delta * _ratio;
	};

	_instance.setRatioOffset = function(offsetStart) {
		_ratioOffset = offsetStart;

		// console.log( "Ratio " + _ratioOffset );
	};

	_instance.setRatioNoOffset = function(ratio, forceUpdate) {
		_ratio = ratio;

		// console.log(_ratio);

		if( _isLastStory ) {
			if(ratio < 0) {
				_ratio += 1;
				_overrideRatioToOne = false;
			}else {
				_overrideRatioToOne = true;
			}

			// console.log(_ratio);
		} else {
			_overrideRatioToOne = false;
		}

		if(_ratio <= 0) {
			_ratio = 0;
		} else if(_ratio >= 1) {
			_ratio = 1;
			if(_hasReverseStories) {
				// console.log(_ratio);
				if(ratio > 0) {
					updateCollapseStories();
				}
			}
		} else {
			if(_hasReverseStories) {
				// console.log(_ratio);
				if(ratio > 0) {
					updateCollapseStories();
				}
			}
		}

		_instance.style.width = _instance.getWidth() + "px";
		updateToRatio(forceUpdate);
	};

	_instance.setRatio = function(ratio, forceUpdate) {
		_ratioWidthOverflow = ratio - _ratioOffset - 1;

		if( _ratioWidthOverflow < 0.5 && _ratioWidthOverflow > -0.5 ) {
			// console.log("SET ACTIVE");
			_imageSlider.setActive();
		} else {
			// console.log("SET IN ACTIVE");
			_imageSlider.setInactive();
		}

		_instance.setRatioNoOffset(
			MathUtils.ratioFromRatio(_ratioOffset, _ratioOffset + 1, ratio, !_isLastStory),
			forceUpdate
		);
	};

	_instance.setLastStory = function() {
		_isLastStory = true;
	};

	_instance.reverseStories = function( reverseStories ) {
		_reverseStories = reverseStories;
		_hasReverseStories = _reverseStories.length > 0;
	};

	function updateCollapseStories() {
		var l = _reverseStories.length;

		var preStory = _instance;
		var collapseRatio = 1 - _ratio;

		var partRatio = 1 / l;

		for(var i = 0; i < l; i++ ) {
			var ratio = MathUtils.ratioFromRatio(1 - partRatio * (i + 1), 1 - partRatio * i, collapseRatio);
			_reverseStories[i].setRatioNoOffset(ratio, false);

			TweenMax.set(_reverseStories[i], {x:preStory._gsTransform.x - _reverseStories[i].getWidth()});
			preStory = _reverseStories[i];
		}
	}


	function onEverywhereClick(){
		if(_instance.onStoryClick != null) {
			_instance.onStoryClick( storyNumber );
		}
	}

	function updateToRatio( force ) {
		if(!force && _ratio == _oldRatio ) {
			return;
		}

		if( _isLastStory && _overrideRatioToOne ) {
			_ratio = 1;
		}

		var delta = _widthExpanded - _widthCollapsed;
		var deltaRatio = delta * _ratio;

		var margin = 9;
		var doubleMargin = margin * 2;

		var imgYPos = SiteGuides.getCenterOffset() + 125;

		var collapsedImgHeight = (_widthCollapsed - doubleMargin) * 0.51;
		var expImgHeight = _height - imgYPos;

		var imgHeight = Math.ceil(collapsedImgHeight + (expImgHeight - collapsedImgHeight) * _ratio);


		//UPDATE NUMBER
		TweenMax.set(_number, {x:deltaRatio + margin, y:SiteGuides.OFFSET_TOP - Text.getOffsetY(_number) - 40 * Math.cos(_ratio * Math.PI + Math.PI * 0.5),  width:_widthCollapsed - doubleMargin });
		var easeColor = ColorUtils.interpolateRGB(_numberColorDeactive, _numberColorActive, _ratio);
		_number.style.color = 'rgb(' + easeColor.r + ',' + easeColor.g + ',' + easeColor.b + ')';

		//UPDATE HEADLINE
		TweenMax.set(_headline, {x:deltaRatio + margin, y:SiteGuides.getCenterOffset() - Text.getOffsetY(_headline),  width:_widthCollapsed - doubleMargin });

		//UPDATE BUTTONS
		if(_numOfImages > 1 ) {
			var buttonLeftEase = Back.easeOut.getRatio(MathUtils.ratioFromRatio(0.1, 0.8, _ratio, true));
			var buttonRightEase = Back.easeOut.getRatio(MathUtils.ratioFromRatio(0.3, 1, _ratio, true));
			if( _leftButton != null && _rightButton != null ) {
				TweenMax.set(_leftButton, {y:imgYPos + 40 - 72 * buttonLeftEase, x:margin});
				TweenMax.set(_rightButton, {y:imgYPos + 40 - 72 * buttonRightEase, x:margin + 32});
			}
		}

		//UPDATE IMAGE
		TweenMax.set(_imageSlider, {y:imgYPos , x:margin});
		_imageSlider.setSize(_instance.getWidth() - doubleMargin, imgHeight );

		//UPDATE BODY TOP MASK
		TweenMax.set(_bodyMask, {x:deltaRatio + margin, y:0,  width:_widthCollapsed - doubleMargin, height:1000 });

		//UPDATE BODY TOP
		var bodyTopXPos = 0;
		var bodyTopWidth = _widthCollapsed - doubleMargin - 10;
		var bodyTopYOffset = 0;
		if( BrowserDetect.MOBILE && _widthCollapsed > _height ) {
			bodyTopXPos = Math.floor(_widthCollapsed * 0.5);
			bodyTopWidth -= bodyTopXPos;

		}
		if( BrowserDetect.MOBILE ) {
			bodyTopYOffset = -20;
		}
		TweenMax.set(_bodyTop, {x:bodyTopXPos, y:130 - 30 * Math.cos(-1 + _ratio * 2 * Math.PI) + bodyTopYOffset, width:bodyTopWidth, alpha:(-1 + _ratio * 2) });

		//UPDATE BODY
		TweenMax.set(_body, {x:deltaRatio + margin, y:imgYPos + imgHeight + margin,  width:_widthCollapsed - doubleMargin, alpha:(1 - _ratio * 2) });

		var bodyHeight = (_height - imgYPos - collapsedImgHeight - margin) * 0.5;
		if( bodyHeight < 100 ) {
			bodyHeight = 100;
		}
		_body.setSize( _widthCollapsed - doubleMargin, bodyHeight );

		//UPDATE IMG TAG
		TweenMax.set(_tag, {x:deltaRatio + margin, y:imgYPos - Text.getOffsetY(_tag) - doubleMargin,  width:_widthCollapsed - doubleMargin });

		//UPDATE DATE
		var dateOffsetY = -40;
		if( BrowserDetect.MOBILE ) {
			dateOffsetY = -30;
		}
		TweenMax.set(_date, {x:deltaRatio + margin, y:SiteGuides.getCenterOffset() - Text.getOffsetY(_date) + dateOffsetY,  width:_widthCollapsed - doubleMargin });

		_oldRatio = _ratio;
	}

	function addSiteLine() {
		_line = document.createElement("div");
		_line.style.position = "absolute";
		_line.style.backgroundColor = UIColors.LINE_ON_WHITE;


		_instance.appendChild(_line);
	}

	function addSlideButtons() {
		if(_numOfImages <= 1 ) {
			return;
		}

		_leftButton = new RetinaImage("assets/images/logo/arrow_short.png", Assets.RETINA_HANDLE);
		_rightButton = new RetinaImage("assets/images/logo/arrow_short.png", Assets.RETINA_HANDLE);

		_leftButton.style.cursor = "pointer";
		_rightButton.style.cursor = "pointer";

		Touchable.apply( _leftButton );
		Touchable.apply( _rightButton );

		_leftButton.onClick( function() {
			_imageSlider.nextImg();
		} );

		_rightButton.onClick( function() {
			_imageSlider.prevImg();
		} );

		_leftButton.init();
		_rightButton.init();

		_leftButton.getContent().style.transform = "rotatey(" + 180 + "deg)";

		_buttonContainer.appendChild(_leftButton);
		_buttonContainer.appendChild(_rightButton);
		_instance.appendChild(_buttonContainer);
	}

	function addImageSlide() {
		var slideData = ContentManager.getChildByAttr(data, "name", "images");
		var slides = ContentManager.getChildrenByAttr(slideData, "name", "image");
		
		var urls = [];
		var l = slides.length;
		for( var i = 0; i < l; i++) {
			urls.push( slides[i].innerHTML );
		}

		_imageSlider = new ImageSlider(urls);
		_instance.appendChild(_imageSlider);
		_imageSlider.init();

	}

	function addNumber() {
		_number = Text.getNewMed(95);
		_number.innerHTML = storyNumber;
		_number.style.color = UIColors.FONT_MED_ON_WHITE;

		_instance.appendChild(_number);
	}

	function addDate() {
		var dateData = ContentManager.getChildByAttr(data, "name", "date");

		_date = Text.getNewLight(13);
		_date.innerHTML = dateData.innerHTML;
		_date.style.color = UIColors.FONT_DARK;

		_instance.appendChild(_date);
	}

	function addHeadline() {
		var headlineData = ContentManager.getChildByAttr(data, "name", "headline");

		_headline = Text.getNewReg(23);
		_headline.innerHTML = headlineData.innerHTML;
		_headline.style.color = UIColors.FONT_DARK;

		_instance.appendChild(_headline);
	}

	function addTopBody() {
		var bodyData = ContentManager.getChildByAttr(data, "name", "body");
		var txtBase = Text.getNewReg(13);
		txtBase.lineHeightScale = 14/13;

		_bodyTop = new TextArea(bodyData.innerHTML, txtBase);
		_bodyTop.init(bodyTextModel, TextAreaModel.MODE_LISTEN );
		_bodyTop.style.color = UIColors.FONT_MED_ON_WHITE;

		_bodyMask = document.createElement("div");
		_bodyMask.style.position = "absolute";

		_bodyMask.appendChild(_bodyTop);
		_instance.appendChild(_bodyMask);
	}

	function addBody() {
		var bodyData = ContentManager.getChildByAttr(data, "name", "body");
		var txtBase = Text.getNewReg(13);
		txtBase.lineHeightScale = 14/13;

		_body = new TextArea( bodyData.innerHTML, txtBase );

		_body.init(bodyTextModel, _mode );
		_body.style.color = UIColors.FONT_MED_ON_WHITE;

		_instance.appendChild(_body);
	}

	function addImgTag() {
		var tagData = ContentManager.getChildByAttr(data, "name", "image-tag-name");

		_tag = Text.getNewReg(13);
		_tag.innerHTML = tagData.innerHTML;
		_tag.style.color = UIColors.FONT_DARK;

		_instance.appendChild(_tag);
	}

	return _instance;
}
