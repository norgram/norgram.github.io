function TemplateCasesOverview( data ) {
	var _instance							= Snail.extend( new PageTemplate( data ) );
	_instance.style.backgroundColor         = UIColors.WHITE;

	var _guides								= null;

	var _cases, _infoBox, _return, _whiteSpace;

	var _numOfCases = 0;

	var _prcWidth = 0.75;

	var _infoOffsetRatio = 0;

	_instance.init = function() {
		_instance.super.init();
		setupAndAddModules();

		Assets.SCROLL_CONTROLLER.addEventListener( ScrollController.ON_SCROLL_EASE_STOP, snapToStory );
		// Assets.SCROLL_CONTROLLER.addEventListener( ScrollController.ON_SCROLL_MOVE, onScrollMove );
		_instance.onResize();
	};

	_instance.kill = function() {
		Assets.SCROLL_CONTROLLER.removeEventListener( ScrollController.ON_SCROLL_EASE_STOP, snapToStory );
		// Assets.SCROLL_CONTROLLER.removeEventListener( ScrollController.ON_SCROLL_MOVE, onScrollMove );
		_infoBox.kill();
		Assets.LAYER_TEMPLATE_OFFSET.removeChild( _infoBox );
		_instance.super.kill();
	};

	_instance.templateIn = function() {
		_instance.super.templateIn();
		_instance.init();
	};

	_instance.onResize = function() {
		var infoWidth = Math.floor(Assets.RESIZE_MANAGER.getWindowWidth() * 0.15);
		if( infoWidth < 150 ) {
			_return.scaleWidth = 0.5;
			_return.setArrowVisability("none");
			// infoWidth = 150;
			_infoBox.setMode( CasesInfoBox.MODE_VERTICAL );
			infoWidth = _infoBox.getCurrentModeWidth();
			// console.log( "infowidth is less the 150" );
		} else {
			_return.scaleWidth = 1;
			_return.setArrowVisability("inline");

			_infoBox.setMode( CasesInfoBox.MODE_HORRIZONTAL );
		}


		_infoBox.setSize( infoWidth, Assets.RESIZE_MANAGER.getWindowHeight());
		var infoXPos = getStoryPos();
		// infoXPos = Assets.RESIZE_MANAGER.getWindowWidth() - infoWidth;

		// console.log(_infoOffsetRatio);
		TweenMax.set(_infoBox, {x:infoXPos + _infoOffsetRatio * infoWidth});

		_whiteSpace.setWidth( infoWidth );
		if(_numOfCases > 0 ) {
			_cases[_numOfCases - 1].offsetWidth2(infoWidth + 120 - SiteGuides.MAIN_MENU_WIDTH);
		}

		for( var i = 0; i < _numOfCases; i++ ) {
			_cases[i].setOffset( -_infoBox.getWidth() - _return.getWidth() + SiteGuides.MAIN_MENU_WIDTH);
		}

		_instance.super.onResize();
		snapToStory();
	};


	function getActiveStory() {
		var ratio = Assets.SCROLL_CONTROLLER.getScrollRatio();
		var partRatio = 1 / (_numOfCases - 1);
		return Math.round(ratio / partRatio);
	}

	function onScrollMove() {
		var infoXPos = getStoryPos();
		var infoOffset = Assets.RESIZE_MANAGER.getWindowWidth() - infoXPos - 120 - _infoBox.getWidth();

		var totalHeight = Assets.SCROLL_CONTROLLER.getPageHeight();
		var height = totalHeight - Assets.SCROLL_CONTROLLER.getScrollRatio() * totalHeight;

		// if( height < infoOffset ) {
		// 	_infoOffsetRatio = Power1.easeInOut.getRatio((infoOffset - height) / infoOffset);
		// } else {
			_infoOffsetRatio = 0;
		// }

		TweenMax.set(_infoBox, {x:infoXPos + _infoOffsetRatio * infoOffset});
	}

	function snapToStory() {
		easeToStory( getActiveStory() );
	}

	function easeToStory( storyIndex ) {
		var storyWidth = getStoryPos();
		Assets.SCROLL_CONTROLLER.scrollTo( storyWidth * storyIndex, 1, Expo.easeInOut );
	}

	function getStoryPos() {
		return Math.floor((Assets.RESIZE_MANAGER.getWindowWidth()) - _infoBox.getWidth() - _return.getWidth());
	}

	function setupAndAddModules() {
		var casesData = ContentManager.getChildrenByAttr(data.getXML(), "template", "case-0");
		var infoData = [];
		_cases = [];

		_numOfCases = casesData.length;

		for( var i = 0; i < _numOfCases; i++ ) {
			// console.log(ContentManager.getChildrenByAttr(casesData[i], "name", "info"));
			infoData.push(ContentManager.getChildrenByAttr(casesData[i], "name", "info"));

			var project = new OverviewCaseModule(casesData[i], 0.75, i);

			project.onModuleClick = onCaseClick;
			_instance.addModule(project);
			_cases.push(project);
		}

		_whiteSpace = new WhiteSpaceModule();

		_return = new ReturnModule();
		_return.addLine(UIColors.LINE_ON_WHITE);

		_instance.addModule(_whiteSpace);
		_instance.addModule( _return );

		addInfoBox( infoData );

		// for( var i = 0; i < _numOfCases; i++ ) {
		// 	infoData.push(ContentManager.getChildrenByAttr(casesData[i], "name", "info"));
		//
		// 	var project = new OverviewCaseModule(casesData[i], 0.75, i);
		//
		// 	project.onModuleClick = onCaseClick;
		// 	_instance.addModule(project);
		// 	_cases.push(project);
		// }

	}

	function addInfoBox( infoData ) {
		_infoBox = new CasesInfoBox(infoData);
		_infoBox.init();

		Assets.LAYER_TEMPLATE_OFFSET.appendChild( _infoBox );
	}

	function onCaseClick( caseID ) {
		if(getActiveStory() == caseID) {
			var casePath = _cases[caseID].getData().getAttribute("data-path");
			var parentPath = data.getXML().getAttribute("data-path");
			window.location.hash = "/"+ parentPath + "/" + casePath + "/";
		} else {
			easeToStory(caseID)
		}
	}

	return _instance;
}
