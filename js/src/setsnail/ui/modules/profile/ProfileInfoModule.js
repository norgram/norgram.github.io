function ProfileInfoModule( data, infoShow, slideNumber, addLine ) {

	if(addLine === undefined) {
		addLine = false;
	}

	var _instance = Snail.extend(new Module());
	_instance.style.backgroundColor = UIColors.WHITE;

	var START_OFFSET_X = 0;

	var _slideNumber;
	var _line;

	var _circleContainer = document.createElement("div");
	_circleContainer.style.position = "absolute";

	_instance.appendChild(_circleContainer);

	var _groupedCircle;
	var _circleText = [];

	var _circleType = "";

	var _body, _headline;

	var _width, _height;

	_instance.init = function () {
		_instance.super.init();

		_instance.moduleId = "INFO" + slideNumber;
		if(addLine) {
			addSiteLine();
		}
		addSlideNumber();

		addCircles();

		// addHeadlineText();
		addBodyText();
	};

	_instance.setBodyTextModel = function( model, mode ) {
		if( mode == null ) {
			mode = TextAreaModel.MODE_CONTROL;
		}
		_body.addModel( model, mode );
	};

	_instance.resize_desktop = function (width, height) {
		_width = Math.floor(height * 1.3);
		_height = height;

		_body.setSize( _width / 3, _height / 4 );
		// _headline.getTextInstance().style.fontSize = _body.getTextInstance().style.fontSize;
		// _headline.getTextInstance().updateLineHeight();

		var headOffsetY = SiteGuides.OFFSET_TOP - Text.getOffsetY(_body.getTextInstance());
		// TweenMax.set( _headline, { x:11, y:headOffsetY } );
		// TweenMax.set( _body, { x:11, y:headOffsetY + parseInt(_headline.getTextInstance().style.lineHeight) + 8 } );
		TweenMax.set( _body, { x:11, y:headOffsetY } );

		_instance.style.width = _instance.getWidth() + "px";
		_instance.style.height = height + "px";

		if(_line) {
			TweenMax.set( _line, { width:1, height:_height, x:1 });
		}

		if( _groupedCircle != null ) {
			switch( _circleType ) {
				case "round" : {
					var width = _width * 0.8;
					var height = _height * 0.8;
					_groupedCircle.setSize( width, height );
					TweenMax.set(_groupedCircle, {
						x:_width * 0.5 - width * 0.4,
						y:_height * 0.15
					} );
					break;
				}
				case "straight": {
					var width = _width * 0.8;
					var height = _height * 0.5;
					_groupedCircle.setSize( width, height );
					TweenMax.set(_groupedCircle, {
						x:_width * 0.5 - width * 0.5,
						y:_height * 0.3
					} );
					break;
				}
			}

			updateCircleTextPositions();
		}

		TweenMax.set(_slideNumber, {
			x: START_OFFSET_X + 11,
			y: _height - _slideNumber.offsetHeight - SiteGuides.OFFSET_BOTOM + 12
		});
	};

	

	_instance.getWidth = function () {
		return _width;
	};

	_instance.kill = function() {
		_groupedCircle.kill();
	};

	_instance.getBodyCharCount = function() {
		return ContentManager.getChildByAttr( data, "name", "body" ).innerHTML.length;
	};

	function addCircles() {
		var circleData = ContentManager.getChildByAttr(data, "name", "circles");
		if(circleData == null) {
			return;
		}

		var numOfCirles = circleData.children.length;
		_circleType = circleData.getAttribute("data-type");
		switch( _circleType ) {
			case "round" : {
				_groupedCircle = new CirclesInACircle( 200, 300, numOfCirles - 1 );
				break;
			}
			case "straight": {
				_groupedCircle = new CirclesOnALine( 200, 300, numOfCirles );
				break;
			}
		}

		if(BrowserDetect.DESKTOP) {
			_groupedCircle.addMouseEffect();
		}
		_instance.appendChild( _groupedCircle );


		for( var i = 0; i < numOfCirles; i++ ) {
			var text = Text.getNewLight(18);
			text.style.color = UIColors.FONT_DARK;
			text.style.textAlign = "center";
			text.innerHTML = circleData.children[i].innerHTML;
			_instance.appendChild(text);
			_circleText.push( text );
		}

	}


	function updateCircleTextPositions() {
		var l = _circleText.length;
		var currGroupIndex = 0;
		var currShapeIndex = 0;

		var scale = _width / SiteGuides.BASE_DESIGN_WIDTH;

		for( var i = 0; i < l; i++ ) {
			var group = _groupedCircle.getGroupAt(currGroupIndex);
			if( group.numOfShapes() <= currShapeIndex ) {
				currGroupIndex++;


				currShapeIndex = 0;
				group =_groupedCircle.getGroupAt(currGroupIndex);
			}

			var fontSize = 23 * scale;

			if(fontSize < 12) {
				fontSize = 12;
			}

			_circleText[i].style.fontSize = fontSize + "px";
			_circleText[i].updateLineHeight();
			// console.log(_circleText[i].offsetWidth);

			TweenMax.set( _circleText[i], {
				x:group.getShapeAt(currShapeIndex).getScaledPosition().x + _groupedCircle._gsTransform.x + _groupedCircle.getCanvasOffset().x - _circleText[i].offsetWidth * 0.5 + 5 * SiteGuides.getDesignHeightRatio(),
				y:group.getShapeAt(currShapeIndex).getScaledPosition().y + _groupedCircle._gsTransform.y + _groupedCircle.getCanvasOffset().y - parseInt(_circleText[i].style.fontSize ) * 0.5// - _circleText[i].offsetHeight * 0.5
			} );



			currShapeIndex++;
		}
	}



	function addSiteLine() {
		_line = document.createElement("div");
		_line.style.position = "absolute";
		_line.style.backgroundColor = UIColors.LINE_ON_WHITE;

		_instance.appendChild(_line);
	}

	function addSlideNumber() {
		_slideNumber = Text.getNewMed(90);
		_slideNumber.innerHTML = slideNumber;
		_slideNumber.style.color = UIColors.FONT_DARK;

		_instance.appendChild(_slideNumber);
	}

	// function addHeadlineText() {
	// 	var textData = ContentManager.getChildByAttr( data, "name", "headline" );
	//
	// 	_headline = new TextArea( textData.innerHTML, Text.getNewLight(28) );
	// 	_headline.style.color = UIColors.FONT_DARK;
	// 	_headline.getTextInstance().style.whiteSpace = "nowrap";
	//
	// 	_headline.init();
	//
	// 	_instance.appendChild(_headline);
	// }

	function addBodyText() {
		var bodyData = ContentManager.getChildByAttr( data, "name", "body" );
		var headlineData = ContentManager.getChildByAttr( data, "name", "headline" );

		var text = headlineData.innerHTML + "<br>" + bodyData.innerHTML;

		_body = new TextArea( text, Text.getNewLight(28) );
		_body.style.color = UIColors.FONT_DARK;
		_body.init();

		_instance.appendChild(_body);
	}

	return _instance;
}