function TemplateHome( data ) {

	var _instance							= Snail.extend( new PageTemplate( data ) );
	_instance.style.backgroundColor         = UIColors.WHITE;

	var _storyModule, _basicModule, _returnModule;

	var _useCollapse = BrowserDetect.DESKTOP;

	_instance.init = function() {
		_instance.super.init();
		setupAndAddModules();

		Assets.SCROLL_CONTROLLER.addEventListener( ScrollController.ON_SCROLL_EASE_STOP, snapToStory );
		_instance.onResize();
	};

	_instance.scrollToNextModule = function() {
		easeToStory( getCurrentIndex() + 1, 1);
	};

	_instance.scrollToPrevModule = function() {
		easeToStory( getCurrentIndex() - 1, 1);
	};

	_instance.templateIn = function() {
		_instance.init();
		_instance.super.templateIn();
	};

	_instance.templateOut = function() {
		_instance.super.templateOut();
	};

	_instance.onResize = function() {
		_instance.super.onResize();

		if( _useCollapse ) {
			_instance.ignoreScrollAfter((Assets.RESIZE_MANAGER.getWindowWidth() - SiteGuides.MAIN_MENU_WIDTH) * 0.5 + SiteGuides.MAIN_MENU_WIDTH - 120);
			_returnModule.setWidth(_instance.visibleWidth * 0.5 + SiteGuides.MAIN_MENU_WIDTH);
		}

		_instance.repositionModules(_returnModule);
		snapToStory();
	};

	_instance.kill = function() {
		Assets.SCROLL_CONTROLLER.removeEventListener( ScrollController.ON_SCROLL_EASE_STOP, snapToStory );
		_instance.super.kill();
	};

	function snapToStory() {
		easeToStory( getCurrentIndex() );
	}

	function getCurrentIndex() {
		var scrollX = Assets.SCROLL_CONTROLLER.currentScroll.y;
		var storyX = _storyModule.aniGetX();
		var numOfStories = _storyModule.getNumOfStories();

		var ratio = scrollX / storyX / numOfStories;
		var partRatio = 1 / numOfStories;

		return Math.round(ratio / partRatio);
	}

	function easeToStory( storyIndex, speed ) {
		speed = speed != null ? speed : 0.4;
		var storyWidth = _storyModule.getExpandedStoryWidth();
		Assets.SCROLL_CONTROLLER.scrollTo( storyWidth * storyIndex, speed, Expo.easeInOut );
	}

	function setupAndAddModules() {
		var frontpageData = ContentManager.getChildByAttr( data.getXML(), "name", "frontpage" );
		var storyData = ContentManager.getChildByAttr( data.getXML(), "name", "stories" );

		var homeStartOffset = 0.5;
		if(BrowserDetect.TABLET) {
			homeStartOffset = 0.6;
		} else if( BrowserDetect.MOBILE ) {
			homeStartOffset = 1;
		}

		_basicModule = new BasicHomeModule( frontpageData, onNextClick, homeStartOffset );
		_storyModule = new HomeStoryModule(storyData, homeStartOffset, _useCollapse);
		_storyModule.onStoryClick = onStoryClick;

		if( _useCollapse ) {
			_returnModule = new ReturnModule((Assets.RESIZE_MANAGER.getWindowWidth() - SiteGuides.MAIN_MENU_WIDTH) * 0.5 + SiteGuides.MAIN_MENU_WIDTH);
			_instance.ignoreScrollAfter((Assets.RESIZE_MANAGER.getWindowWidth() - SiteGuides.MAIN_MENU_WIDTH) * 0.5 + SiteGuides.MAIN_MENU_WIDTH - 120);
		} else {
			_returnModule = new ReturnModule();
		}

		_returnModule.addLine( UIColors.LINE_ON_WHITE );

		_instance.addModule( _basicModule );
		_instance.addModule( _storyModule );
		_instance.addModule( _returnModule );
	}

	function onNextClick() {
		_instance.scrollToNextModule();
	}

	function onStoryClick( storyNumber ) {
		easeToStory(storyNumber, 1);
	}

	return _instance;
}
