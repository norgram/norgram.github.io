function TemplateCasesOverview( data ) {
	var _instance							= Snail.extend( new PageTemplate( data ) );
	_instance.style.backgroundColor         = UIColors.WHITE;

	var _guides								= null;

	var _cases, _infoBox, _return, _whiteSpace;

	var _numOfCases;

	var _prcWidth = 0.65;

	_instance.init = function() {
		_instance.super.init();
		setupAndAddModules();

		Assets.SCROLL_CONTROLLER.addEventListener( ScrollController.ON_SCROLL_EASE_STOP, snapToStory );
		_instance.onResize();
	};

	_instance.kill = function() {
		Assets.SCROLL_CONTROLLER.removeEventListener( ScrollController.ON_SCROLL_EASE_STOP, snapToStory );
		_infoBox.kill();
		Assets.LAYER_TEMPLATE_OFFSET.removeChild( _infoBox );
		_instance.super.kill();
	};

	_instance.templateIn = function() {
		_instance.super.templateIn();
		_instance.init();
	};

	_instance.onResize = function() {
		var infoXPos = Math.floor((Assets.RESIZE_MANAGER.getWindowWidth() - SiteGuides.MAIN_MENU_WIDTH) * _prcWidth);
		var infoWidth = Assets.RESIZE_MANAGER.getWindowWidth() * 0.15;

		_whiteSpace.setWidth( infoWidth );

		_return.setWidth(Assets.RESIZE_MANAGER.getWindowWidth() - infoXPos - infoWidth );
		_instance.super.onResize();

		TweenMax.set(_infoBox, {x:infoXPos});
		_infoBox.setSize( infoWidth, Assets.RESIZE_MANAGER.getWindowHeight());
	};


	function getActiveStory() {
		var ratio = Assets.SCROLL_CONTROLLER.getScrollRatio();
		var partRatio = 1 / (_numOfCases - 1);
		return Math.round(ratio / partRatio);
	}

	function snapToStory() {
		easeToStory( getActiveStory() );
	}

	function easeToStory( storyIndex ) {
		var storyWidth = Math.floor((Assets.RESIZE_MANAGER.getWindowWidth() - SiteGuides.MAIN_MENU_WIDTH) * _prcWidth);
		Assets.SCROLL_CONTROLLER.scrollTo( storyWidth * storyIndex, 1, Expo.easeInOut );
	}

	function setupAndAddModules() {
		var casesData = ContentManager.getChildrenByAttr(data.getXML(), "template", "case-0");
		var infoData = [];
		_cases = [];

		_numOfCases = casesData.length;

		for( var i = 0; i < _numOfCases; i++ ) {
			infoData.push(ContentManager.getChildrenByAttr(casesData[i], "name", "info"));

			var project = new OverviewCaseModule(casesData[i], _prcWidth, i);
			project.onModuleClick = onCaseClick;
			_instance.addModule(project);
			_cases.push(project);
		}

		_whiteSpace = new WhiteSpaceModule();
		_return = new ReturnModule();

		_instance.addModule(_whiteSpace);
		_instance.addModule( _return );

		addInfoBox( infoData );
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
