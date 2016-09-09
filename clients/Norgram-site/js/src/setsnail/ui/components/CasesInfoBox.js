function CasesInfoBox( data ) {
	var _instance = document.createElement("div");
	_instance.style.position = "absolute";
	_instance.style.backgroundColor = UIColors.WHITE;

	var _cases = [];

	_instance.init = function() {
		addCases();

		Assets.SCROLL_CONTROLLER.addEventListener( ScrollController.ON_SCROLL_MOVE, updateRatio );
		updateRatio();
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

	var _ratio = 0;

	var _width, _height;

	var _headline, _client, _project, _year;

	var _smallContentContainer;

	_instance.init = function() {
		addHeadline();
		addBottomInfo();
	};

	_instance.setSize = function( width, height ) {
		_width = width;
		_height = height;

		TweenMax.set( _instance, { width:_width, height:_height } );

		if( _headline != null ) {
			TweenMax.set( _headline, { x:10, y:SiteGuides.getCenterOffset() - Text.getOffsetY(_headline)} );
			_headline.updateLineHeight();
		}

		TweenMax.set(_smallContentContainer, {x:10, y:_height - SiteGuides.OFFSET_BOTOM - 39} );
	};

	_instance.setRatio = function(ratio) {
		_ratio = MathUtils.ratioFromRatio( index - 0.5, index + 0.5, ratio );
		var doubleRatio = _ratio * 2;
		_ratio = doubleRatio;

		if(doubleRatio > 1) {
			_ratio = 2 - doubleRatio;
		}

		_instance.style.opacity = _ratio;
	};

	function addHeadline() {
		var textData = ContentManager.getChildByAttr(data, "name", "headline");

		if(textData == null ) {
			return;
		}
		_headline = Text.getNewLight(23);
		_headline.innerHTML = textData.innerHTML;
		_headline.style.color = UIColors.DARK;

		_instance.appendChild(_headline);
	}

	function addBottomInfo() {
		_smallContentContainer = new CaseSmallInfo(data);
		_instance.appendChild( _smallContentContainer );
	}

	return _instance;
}


function CaseSmallInfo(data) {

	var _instance = document.createElement("div");
	_instance.style.position = "absolute";

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
		return text;

	}

	addBottomInfo();

	return _instance;
}