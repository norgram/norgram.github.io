function TemplateHome( data ) {

	var _instance							= Snail.extend( new PageTemplate( data ) );
	_instance.style.backgroundColor         = UIColors.WHITE;

	var _storyModule, _basicModule, _returnModule;

	var _useCollapse = BrowserDetect.DESKTOP;

	var _psycho;

	_instance.init = function() {
		_instance.super.init();
		setupAndAddModules();

		addPsycho();

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
		_psycho.style.display = "none";
		setTimeout( function() {
				_psycho.style.display = "inline";
				Assets.SCROLL_CONTROLLER.addEventListener( ScrollController.ON_OVERSCROLLING_TOP, onOverScrollingTop );
				Assets.SCROLL_CONTROLLER.addEventListener( ScrollController.ON_SCROLL_MOVE, onScrollMove );
			}, 1000 );

		_instance.super.templateIn();
	};

	_instance.templateOut = function() {
		if(_isPhychoOpen){
			Assets.SCROLL_CONTROLLER.removeEventListener( ScrollController.ON_OVERSCROLLING_TOP, onOverScrollingTop );
			Assets.SCROLL_CONTROLLER.removeEventListener( ScrollController.ON_SCROLL_MOVE, onScrollMove );

			TweenMax.killTweensOf(_offsetEase);
			_isPhychoOpen = false;
			TweenMax.to( _offsetEase, 0.8, { x:0, delay:0.1, onUpdate:updateOffsetToEase, onComplete:function() {
				_psycho.style.display = "none";
				_instance.super.templateOut();
			}, ease:Expo.easeOut });
		} else {
			_psycho.style.display = "none";
			_instance.super.templateOut();
		}
		_psycho.kill();

	};

	_instance.onResize = function() {
		_instance.super.onResize();

		if( _useCollapse ) {
			_instance.ignoreScrollAfter((Assets.RESIZE_MANAGER.getWindowWidth() - SiteGuides.MAIN_MENU_WIDTH) * 0.5 + SiteGuides.MAIN_MENU_WIDTH - 120);
			_returnModule.setWidth(_instance.visibleWidth * 0.5 + SiteGuides.MAIN_MENU_WIDTH);
		}

		if(_isPhychoOpen) {
			_offsetEase.x = Assets.RESIZE_MANAGER.getWindowWidth();
			updateOffsetToEase();
		}

		_instance.repositionModules(_returnModule);
		snapToStory();
	};

	_instance.kill = function() {
		Assets.SCROLL_CONTROLLER.removeEventListener( ScrollController.ON_OVERSCROLLING_TOP, onOverScrollingTop );
		Assets.SCROLL_CONTROLLER.removeEventListener( ScrollController.ON_SCROLL_MOVE, onScrollMove );
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

	function addPsycho() { 
		_psycho = new PsychodelicLines();
		_instance.appendChild( _psycho );
		_psycho.init();

		
	}

	var _offscrollTicks = 0;
	var _isPhychoOpen = false;

	var _offsetEase = { x:0 };
	function onOverScrollingTop() {
		_offscrollTicks++;

		if(!_isPhychoOpen && _offscrollTicks > 30) {
			TweenMax.killTweensOf(_offsetEase);
			TweenMax.to( _offsetEase, 0.6, { x:Assets.RESIZE_MANAGER.getWindowWidth(), delay:0.1, onUpdate:updateOffsetToEase, ease:Expo.easeOut });
			_isPhychoOpen = true;
			_psycho.startRender();

			if( typeof ga !== null ) {
				// Google Analytics tracking
				var getLocation = "#/home/" + "psycho";
				ga('send', "pageview", getLocation);
			}

		} else {
			if(_isPhychoOpen) {
				return;
			}
			// _psycho.resetLinePositions();
			TweenMax.killTweensOf(_offsetEase);
			TweenMax.set(_offsetEase, { x: _offsetEase.x + 5 });
			updateOffsetToEase();
			TweenMax.to( _offsetEase, 0.6, { x:0, delay:0.1, onUpdate:updateOffsetToEase, onComplete:onOffsetEaseComplete, ease:Expo.easeOut });
		}
	}

	function onScrollMove() {
		if( _isPhychoOpen && Assets.SCROLL_CONTROLLER.currentScroll.y > 0 ) {
			TweenMax.killTweensOf(_offsetEase);
			_isPhychoOpen = false;
			TweenMax.to( _offsetEase, 0.8, { x:0, delay:0.1, onUpdate:updateOffsetToEase, onComplete:function() {
				_psycho.resetLinePositions();
			}, ease:Expo.easeOut });
			_offscrollTicks = 0;
			_psycho.stopRender();
		}
	}

	function updateOffsetToEase() {
		TweenMax.set( Assets.LAYER_TEMPLATE_PHYCHO_OFFSET, { x:_offsetEase.x } )
	}

	function onOffsetEaseComplete(){
		_offscrollTicks = 0;
	}

	function onNextClick() {
		_instance.scrollToNextModule();
	}

	function onStoryClick( storyNumber ) {
		easeToStory(storyNumber, 1);
	}

	return _instance;
}
