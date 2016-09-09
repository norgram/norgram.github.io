function PageTemplate( data /* ofType TemplateData */ ) {
	var _instance					= document.createElement( "div" );
	_instance.style.position		= "absolute";
	// _instance.style.backgroundColor = "#FF0000";

	var templatePath				= ContentManager.composeFullPathFromXML( data.getXML() );
	var _scrollController			= null;
	var _modules					= [];

	_instance.pageHeight			= 0;
	_instance.visibleWidth			= 0;
	_instance.visibleHeight			= 0;

	var _modulesLayer				= null;

	var _modulesLoaded				= 0;
	var _timeoutAllModulesLoaded	= null;

	var _transitionCoverHolder		= null;
	var _transitionCover			= null;
	var _useTransitionOut			= true;
	var _useTransitionIn			= true;

	_instance.init = function(layer, useTransition) {
		// trace( "INIT PageTemplate" );
		_modulesLayer = document.createElement("div");
		_modulesLayer.style.position = "absolute";
		_instance.appendChild(_modulesLayer);

		var targetLayer = layer ? layer : Assets.LAYER_TEMPLATE;
		targetLayer.appendChild( _instance );

		_scrollController = Assets.SCROLL_CONTROLLER;
		Assets.RESIZE_MANAGER.addEventListener( ResizeEvents.RESIZE, _instance.onResize );

		_instance.setPageHeight( _instance.pageHeight );

		_scrollController.addEventListener( ScrollController.ON_SCROLL_MOVE, onPageScroll );
	};

	_instance.addModule = function(module, insertAfterThisModule) {
		if(typeof module["resize_desktop"] !== 'function') {
			console.error("module must have resize(width, height) function");
		}

		if(typeof module["getHeight"] !== 'function') {
			console.error("module must have getHeight() function");
		}

		if(typeof module["kill"] !== 'function') {
			console.error("module must have kill() function");
		}

		_modulesLayer.appendChild(module);
		module.setCallbackLoaded(onModuleLoaded);
		module.setCallbackResize(_instance.resizeModules);
		module.setCallbackReposition(_instance.repositionModules);
		module.init();

		AnimationUtils.apply( module );

		if(insertAfterThisModule) {
			var index = _modules.indexOf( insertAfterThisModule ) + 1;
			_modules.splice(index, 0, module);

			_instance.resizeModules();
		} else {
			_modules.push(module);
		}

		return module;
	};

	_instance.removeModule = function(module, kill) {
		var index = _modules.indexOf(module);

		if(kill !== false) {
			module.parentNode.removeChild(module);
			module.kill();
		}
		_modules.splice(index, 1);

		return index;
	};

	function onModuleLoaded() {
//		trace("onModuleLoaded();");
		clearTimeout(_timeoutAllModulesLoaded);

		_modulesLoaded += 1;
		_timeoutAllModulesLoaded = setTimeout(checkForAllModulesLoaded, 1000 * 0.4);
	};

	function checkForAllModulesLoaded() {
		if(_modulesLoaded === _modules.length) {
			onAllModulesLoaded();
		}
	};

	function onAllModulesLoaded() {
//		trace("onAllModulesLoaded();");
		// Assets.SCROLL_CONTROLLER.enableScroll();
		// _instance.setMenuPath();

		// if(_useTransitionIn === true) {
			// animateIn();
		// } else {
			ContentManager.nextTemplate();
		// }
	}


// 	/**
// 	 * Transitions
// 	 */
	_instance.templateIn = function() {
		// must be overriden in template and call PageTemplate.init();
		// trace("templateIn();");

		TweenMax.to(Assets.LAYER_BOT, 1.4, {
			x:0,
			onComplete:function() {
				ContentManager.nextTemplate();
			},
			ease:Expo.easeInOut
		} );

// 		if(_modules.length <= 0) {
// 			ContentManager.nextTemplate();
		// }
	};

	_instance.templateOut = function() {
		// trace("templateOut(); " +_instance.visibleWidth);
		_scrollController.scrollTo(0);

		Assets.MAIN_MENU.collapseMenu();

		TweenMax.to(Assets.LAYER_BOT, 0.6, {
			x:_instance.visibleWidth,
			onComplete:function() {
				_instance.kill();
				ContentManager.nextTemplate();
			},
			ease:Expo.easeInOut
		} );

		// Assets.SCROLL_CONTROLLER.disableScroll();

		// if( Assets.MAIN_MENU.isExpanded ) {
		// 	Assets.MAIN_MENU.collapse( 0.6, Quart.easeInOut );
		// }

		// if(data.getNextTemplateData().getTemplateName() === "search-0") {
		// 	ContentManager.nextTemplate();
		// 	setTimeout( function() {
		// 		_instance.kill();
		// 	}, 1000 );
		// } else {
		// 	if(_useTransitionOut === true) {
		// 		animateOut();
		// 	} else {
		// 		_instance.kill();
		// 		ContentManager.nextTemplate();
		// 	}
		// }
	};


	_instance.onResize = function() {
		_instance.visibleWidth				= Assets.RESIZE_MANAGER.getWindowWidth() - MainMenu.BORDER_WIDTH;// - (Assets.RESIZE_MANAGER.getBreakPoint() === "mobile" ? 0 : Assets.MAIN_MENU.menuOffsetW);
		_instance.visibleHeight				= Assets.RESIZE_MANAGER.getWindowHeight();// - Assets.MAIN_MENU.menuOffsetH;

		_instance.style.width				= _instance.visibleWidth + "px";
		_instance.style.height				= _instance.visibleHeight + "px";

		_instance.resizeModules();
	};

	_instance.resizeModules = function(target) {
		var l			= _modules.length;
		var module		= null;

		if(l === 0) {
			return;
		}

		var xPos = 0;//Assets.MAIN_MENU.menuOffsetH;

		if(!target) {
			for(var i = 0; i < l; i += 1) {
				module = _modules[ i ];
				callResizeOnModule( module, _instance.visibleWidth, _instance.visibleHeight );
				module.aniSetX( xPos );// + "px";
				module.aniRender();
				xPos += module.getWidth();
			}

			_instance.pageHeight = xPos;
			_instance.setPageHeight( _instance.pageHeight );
			// setModuleVisibilty();
		} else {
			var index = _modules.indexOf(target);

			if(index !== - 1) {
				module = _modules[index];
				callResizeOnModule( module, _instance.visibleWidth, _instance.visibleHeight );
				_instance.repositionModules(module);
			}
		}

		onPageScroll();
	};

	function callResizeOnModule( module, width, height ) {
		module["resize_" + Assets.RESIZE_MANAGER.getBreakPoint()]( width, height );
	}

	_instance.repositionModules = function(target) {
		var l			= _modules.length;
		var module		= null;

		if(l === 0) {
			return;
		}

		var yPos 		= Assets.MAIN_MENU.menuOffsetH;
		var index 		= target ? _modules.indexOf(target) : 0;

		if(index === - 1) {
			index = 0;
		}

		if(target && index !== 0) {
			module = _modules[ index - 1 ];
			yPos = parseInt( module.aniGetX(), 10 ) + module.getWidth();
		}

		for(var i = index; i < l; i += 1) {
			module = _modules[ i ];

			module.aniSetX( yPos );
			module.aniRender();
			yPos += module.getWidth();
		}

		if(l > 1 && module && yPos < _instance.visibleHeight) {
			yPos = _instance.visibleWidth - module.getWidth();
			module.aniSetX( yPos );// + "px";
			module.aniRender();
			_instance.visibleWidth = yPos;
		} else if(yPos < _instance.visibleHeight) {
			yPos = _instance.visibleWidth;
		}

		_instance.pageHeight = yPos;
		_instance.setPageHeight( _instance.pageHeight );

		setModuleVisibilty();
	};

	function killModules() {
		var l			= _modules.length;
		for(var i = 0; i < l; i += 1) {
			_modules[i].kill();
		}
	}

	_instance.setPageHeight = function( value ){
		_scrollController.setPageHeight( value );
	};

	_instance.kill = function() {
		Assets.RESIZE_MANAGER.removeEventListener( ResizeEvents.RESIZE, _instance.onResize );
		_scrollController.removeEventListener( ScrollController.ON_SCROLL_MOVE, onPageScroll );
		// _scrollController.removeEventListener( ScrollController.ON_200_PX_SCROLLED, _instance.onScrollHideMenu );

		killModules();
		_instance.parentNode.removeChild( _instance );
	};

	_instance.pageScrollRatio = function( ratio ) {
		// Assets.LAYER_TEMPLATE.aniSetX( -_scrollController.currentScroll.y + SiteGuides.MAIN_MENU_WIDTH );
		// Assets.LAYER_TEMPLATE.aniRender();

		TweenMax.set( Assets.LAYER_TEMPLATE, {x:-Assets.SCROLL_CONTROLLER.currentScroll.y} );

		// Assets.LAYER_TEMPLATE.style.left = -Assets.SCROLL_CONTROLLER.currentScroll.y + "px";

		setModuleVisibilty();
	};

	_instance.scrollToNextModule = function() {
		var l			= _modules.length;
		var module		= null;

		for(var i = 0; i < l; i += 1) {
			module = _modules[i];
			var ratio = 1 / module.getWidth() * (_scrollController.currentScroll.y - module.aniGetX() + _instance.visibleWidth);
			if(ratio > 0 && ratio < 1) {
				// console.log("NextModuleFound:: " + module.moduleId);
				break;
			}
		}
		_scrollController.scrollTo(module.aniGetX(), 1, Expo.easeInOut);

	};


	function setModuleVisibilty() {
		var l			= _modules.length;
		var module		= null;
		var ratio		= 0;

		for(var i = 0; i < l; i += 1) {
			module = _modules[i];

			ratio = 1 / module.getWidth() * (_scrollController.currentScroll.y - module.aniGetX() + _instance.visibleWidth);

			module.visibilityRatio(ratio);
		}
	}

// 	_instance.onScrollHideMenu = function() {
// 		if( !_scrollController.isDragging() ) {
// 			Assets.MAIN_MENU.collapse();
// 		}
// 	};

	function onPageScroll() {
		_instance.pageScrollRatio( _scrollController.getScrollRatio() );
		// if(BrowserDetect.MOBILE === false) {
		// 	Assets.MAIN_MENU.collapseMenu();
		// }
	}

	return _instance;
}


