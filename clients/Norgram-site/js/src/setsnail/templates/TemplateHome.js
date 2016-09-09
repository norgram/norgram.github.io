function TemplateHome( data ) {

	var _instance							= Snail.extend( new PageTemplate( data ) );
	_instance.style.backgroundColor         = UIColors.WHITE;

	var _storyModule, _basicModule, _returnModule;

	_instance.init = function() {
		_instance.super.init();
		setupAndAddModules();

		Assets.SCROLL_CONTROLLER.addEventListener( ScrollController.ON_SCROLL_EASE_STOP, snapToStory );
		_instance.onResize();
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

		_returnModule.setWidth(_instance.visibleWidth * 0.5 + SiteGuides.MAIN_MENU_WIDTH);
		_instance.repositionModules(_returnModule);
		snapToStory();
	};

	_instance.kill = function() {
		Assets.SCROLL_CONTROLLER.removeEventListener( ScrollController.ON_SCROLL_EASE_STOP, snapToStory );
		_instance.super.kill();
	};

	function snapToStory() {
		var scrollX = Assets.SCROLL_CONTROLLER.currentScroll.y;
		var storyX = _storyModule.aniGetX();
		var numOfStories = _storyModule.getNumOfStories();

		var ratio = scrollX / storyX / numOfStories;
		var partRatio = 1 / numOfStories;

		var index = Math.round(ratio / partRatio);

		easeToStory(index);
	}

	function easeToStory( storyIndex ) {
		var storyWidth = _storyModule.getExpandedStoryWidth();
		Assets.SCROLL_CONTROLLER.scrollTo( storyWidth * storyIndex, 1, Expo.easeInOut );
	}

	function setupAndAddModules() {
		var frontpageData = ContentManager.getChildByAttr( data.getXML(), "name", "frontpage" );
		var storyData = ContentManager.getChildByAttr( data.getXML(), "name", "stories" );


		var homeStartOffset = 0.5;

		_basicModule = new BasicHomeModule( frontpageData, onNextClick, homeStartOffset );
		_storyModule = new HomeStoryModule(storyData, homeStartOffset);
		_storyModule.onStoryClick = onStoryClick;
		_returnModule = new ReturnModule((Assets.RESIZE_MANAGER.getWindowWidth() - SiteGuides.MAIN_MENU_WIDTH) * 0.5 + SiteGuides.MAIN_MENU_WIDTH);
		_returnModule.addLine( UIColors.LINE_ON_WHITE );

		_instance.addModule( _basicModule );
		_instance.addModule( _storyModule );
		_instance.addModule( _returnModule );
	}

	function onNextClick() {
		_instance.scrollToNextModule();
	}

	function onStoryClick( storyNumber ) {
		easeToStory(storyNumber)
	}

	return _instance;
}
