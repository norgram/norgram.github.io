CasesInfoBox.MODE_HORRIZONTAL = "horrizontal";
CasesInfoBox.MODE_VERTICAL = "vertical";

function CasesInfoBox( data ) {
	var _instance = document.createElement("div");
	_instance.style.position = "absolute";
	_instance.style.backgroundColor = UIColors.WHITE;


	var _mode = CasesInfoBox.MODE_HORRIZONTAL;

	var _cases = [];

	var _width = 0;
	var _height = 0;

	_instance.init = function() {
		addCases();

		Assets.SCROLL_CONTROLLER.addEventListener( ScrollController.ON_SCROLL_MOVE, updateRatio );
		updateRatio();
	};

	_instance.setMode = function( mode ) {
		_mode = mode;
		for( var i = 0; i < _numOfCases; i++) {
			_cases[i].setMode(_mode);
		}
	};

	_instance.getCurrentModeWidth = function() {
		return 60;
	};

	_instance.kill = function() {
		Assets.SCROLL_CONTROLLER.removeEventListener( ScrollController.ON_SCROLL_MOVE, updateRatio );
	};

	_instance.setSize = function( width, height ) {
		_width = width;
		_height = height;

		for( var i = 0; i < _numOfCases; i++) {
			_cases[i].setSize(_width, _height);
		}

		TweenMax.set(_instance, {width:_width, height:_height});
	};

	_instance.getWidth = function() {
		return _width;
	};

	function updateRatio() {
		var ratio = Assets.SCROLL_CONTROLLER.getScrollRatio() * (_numOfCases - 1);

		for( var i = 0; i < _numOfCases; i++) {
			var infoRatio;

			if(ratio < i) {
				infoRatio = 0;
			} else if(ratio > i + 1) {
				infoRatio = 1;
			} else {
				infoRatio = ratio - i;
			}

			_cases[i].setRatio(ratio);
		}
	}

	function addCases() {
		_numOfCases = data.length;

		for( var i = 0; i < _numOfCases; i++ ) {
			// console.log( data[i]);
			//
			var info = new CaseInfo( data[i][0], i );
			info.init();
			_cases.push( info );

			_instance.appendChild(info);
		}

	}


	return _instance;
}


function CaseInfo( data, index ) {

	var _instance = document.createElement("div");
	_instance.style.position = "absolute";
	_instance.style.backgroundColor = UIColors.WHITE;

	_instance.y;

	var _ratio = 0;
	var _mode = CasesInfoBox.MODE_HORRIZONTAL;

	var _width = 0;
	var _height = 0;

	var _headline;

	var _smallContentContainer;

	_instance.init = function() {
		addHeadline();
		addBottomInfo();
	};

	function updateSize() {
		_instance.setSize(_width, _height);
	}

	_instance.setMode = function( mode ) {
		_mode = mode;

		switch(_mode) {
			case CasesInfoBox.MODE_HORRIZONTAL : {
				TweenMax.set(_headline, {rotation:0});
				TweenMax.set(_smallContentContainer, {rotation:0});
				break;
			}
			case CasesInfoBox.MODE_VERTICAL : {
				TweenMax.set(_headline, {rotation:-90});
				TweenMax.set(_smallContentContainer, {rotation:-90});
				break;
			}
		}

		_instance.setSize(_width, _height);

	};

	_instance.setSize = function( width, height ) {
		_width = width;
		_height = height;

		TweenMax.set( _instance, { width:_width, height:_height } );

		if( _headline != null ) {
			switch(_mode) {
				case CasesInfoBox.MODE_HORRIZONTAL : {
					var yPos = _instance.y == null ? SiteGuides.getCenterOffset() : _instance.y;
					TweenMax.set( _headline, { rotation:0, x:10, y:yPos - Text.getOffsetY(_headline.text)} );
					TweenMax.set(_smallContentContainer, {x:10, y:_height - SiteGuides.OFFSET_BOTOM - 39} );
					break;
				}
				case CasesInfoBox.MODE_VERTICAL : {
					TweenMax.set(_headline, {rotation:-90, x:10 - Text.getOffsetY(_headline.text), y:_height - SiteGuides.OFFSET_BOTOM });
					TweenMax.set(_smallContentContainer, {x:10, y:SiteGuides.OFFSET_BOTOM + 39 + _smallContentContainer.getWidth() + 10 } );
					break;
				}
			}
		}

		if(_height < 380) {
			_smallContentContainer.style.display = "none";
		}else {
			_smallContentContainer.style.display = "inline";
		}
		
	};

	_instance.setRatio = function(ratio) {
		_ratio = MathUtils.ratioFromRatio( index - 0.5, index + 0.5, ratio );

		var doubleRatio = _ratio * 2;
		_ratio = doubleRatio;

		var offsetAmount = 10;

		if(doubleRatio > 1) {
			_ratio = 2 - doubleRatio;
			offsetAmount = 30;
		}else {
			offsetAmount = -30;
		}

		if( _ratio <= 1 ) {
			_ratio = Quad.easeOut.getRatio(_ratio);
		} else {
			_ratio = Quad.easeIn.getRatio(_ratio - 1);
		}

		switch(_mode) {
			case CasesInfoBox.MODE_HORRIZONTAL : {
				TweenMax.set(_smallContentContainer, { x:10, y:_height - SiteGuides.OFFSET_BOTOM - 39 - offsetAmount * 0.5 * (doubleRatio - 1)} );
				TweenMax.set( _headline, { x:10 + offsetAmount * (doubleRatio - 1) } );
				break;
			}
			case CasesInfoBox.MODE_VERTICAL : {
				TweenMax.set( _headline, { x:10 - Text.getOffsetY(_headline.text), y:_height - SiteGuides.OFFSET_BOTOM - offsetAmount * 0.5 * (doubleRatio - 1) } );
				TweenMax.set(_smallContentContainer, { x:10, y:SiteGuides.OFFSET_BOTOM + 39 + _smallContentContainer.getWidth() +10+ offsetAmount * 0.5 * (doubleRatio - 1)} );
				break;
			}
		}

		_instance.style.opacity = _ratio;
	};

	function addHeadline() {
		var textData = ContentManager.getChildByAttr(data, "name", "headline");

		if(textData == null ) {
			return;
		}

		_headline = document.createElement("div");
		_headline.style.position = "absolute";

		var text = Text.getNewLight(23);
		text.innerHTML = textData.innerHTML;
		text.style.color = UIColors.DARK;
		text.style.whiteSpace = "nowrap";

		_headline.text = text;

		_headline.appendChild(text);
		_instance.appendChild(_headline);
	}

	function addBottomInfo() {
		_smallContentContainer = new CaseSmallInfo(data);
		_instance.appendChild( _smallContentContainer );
		_smallContentContainer.onAllTextReady( updateSize );
	}

	return _instance;
}


function CaseSmallInfo(data) {

	var _instance = document.createElement("div");
	_instance.style.position = "absolute";

	var _textArr = [];

	function addBottomInfo() {
		var yPos = 0;
		var spacing = 14;

		var clientTag = getSmallText( "Client:", yPos, 0 );
		var client = getSmallText( ContentManager.getChildByAttr(data, "name", "client").innerHTML, yPos, 50 );
		yPos += spacing;

		var projectTag = getSmallText( "Project:", yPos, 0 );
		var project = getSmallText( ContentManager.getChildByAttr(data, "name", "project").innerHTML, yPos, 50 );
		yPos += spacing;

		var yearTag = getSmallText( "Year:", yPos, 0 );
		var year = getSmallText( ContentManager.getChildByAttr(data, "name", "year").innerHTML, yPos, 50 );

		_instance.appendChild(clientTag);
		_instance.appendChild(projectTag);
		_instance.appendChild(yearTag);
		_instance.appendChild(client);
		_instance.appendChild(project);
		_instance.appendChild(year);
	}

	function getSmallText( content, yPos, xPos ) {
		var text = Text.getNewReg(13);
		TweenMax.set(text, { x:xPos, y:yPos - Text.getOffsetY(text) });
		text.style.color = UIColors.FONT_MED_ON_WHITE;
		text.style.whiteSpace = "nowrap";
		text.innerHTML = content;

		_textArr.push( text );

		return text;
	}

	_instance.onAllTextReady = function( callback ) {
		Text.listenForSize(_textArr, callback);
	};

	_instance.getWidth = function() {
		var l = _textArr.length;
		var maxSize = 0;

		for( var i = 0; i < l; i++) {
			var w = _textArr[i].offsetWidth;
			if( w > maxSize ){
				maxSize = w;
			}
		}

		return maxSize;
	};

	addBottomInfo();

	return _instance;
}