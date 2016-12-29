function PageTemplate( data /* ofType TemplateData */ ) {
	var _instance					= document.createElement( "div" );
	_instance.style.position		= "absolute";

	var _scrollController			= null;
	var _modules					= [];

	_instance.pageHeight			= 0;
	_instance.visibleWidth			= 0;
	_instance.visibleHeight			= 0;

	var _modulesLayer				= null;

	var _modulesLoaded				= 0;
	var _timeoutAllModulesLoaded	= null;

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

		document.onkeydown = onKeyPress;

		_scrollController.addEventListener( ScrollController.ON_SCROLL_MOVE, onPageScroll );
	};

	function onKeyPress( e ) {
		if(_scrollController.isScrolling()) {
			return;
		}

		var key = e.keyCode;
		if( key == 37) {
			//LEFT
			_instance.scrollToPrevModule();
		} else if( key == 39 ) {
			//RIGHT
			_instance.scrollToNextModule();
		}
	}

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
		ContentManager.nextTemplate();
	}


// 	/**
// 	 * Transitions
// 	 */
	_instance.templateIn = function() {
		if(_scrollController != null) {
			_scrollController.scrollTo(0, 0);
		}

		if(!Assets.MAIN_MENU.isCollapsed()) {
			Assets.MAIN_MENU.collapseMenu( 1, Expo.easeInOut );

			setTimeout( function() {
				ContentManager.nextTemplate();
			}, 1000 );

		} else {
			TweenMax.to(Assets.LAYER_BOT, 1, {
				x:0,
				onComplete:function() {
					ContentManager.nextTemplate();
				},
				ease:Expo.easeInOut
			} );
		}
	};

	_instance.templateOut = function() {
		if(!Assets.MAIN_MENU.isCollapsed()) {
			Assets.MAIN_MENU.openWide(0.6);

			setTimeout( function() {
				_scrollController.scrollTo(0, 0);
				_instance.kill();
				ContentManager.nextTemplate();
			}, 600 );
		} else {
			_scrollController.scrollTo(0, 0.6, Expo.easeInOut);
			TweenMax.to(Assets.LAYER_BOT, 0.6, {
				x:_instance.visibleWidth,
				onComplete:function() {
					_instance.kill();
					ContentManager.nextTemplate();
				},
				ease:Expo.easeInOut
			} );
		}
	};


	_instance.onResize = function() {
		_instance.visibleWidth				= Assets.RESIZE_MANAGER.getWindowWidth() - MainMenu.BORDER_WIDTH;
		_instance.visibleHeight				= Assets.RESIZE_MANAGER.getWindowHeight();

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

		var xPos = 0;

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

		var xPos 		= Assets.MAIN_MENU.menuOffsetH;
		var index 		= target ? _modules.indexOf(target) : 0;

		if(index === - 1) {
			index = 0;
		}

		if(target && index !== 0) {
			module = _modules[ index - 1 ];
			xPos = parseInt( module.aniGetX(), 10 ) + module.getWidth();
		}

		for(var i = index; i < l; i += 1) {
			module = _modules[ i ];

			module.aniSetX( xPos );
			module.aniRender();
			xPos += module.getWidth();
		}

		if(l > 1 && module && xPos < _instance.visibleHeight) {
			xPos = _instance.visibleWidth - module.getWidth();
			module.aniSetX( xPos );// + "px";
			module.aniRender();
			_instance.visibleWidth = xPos;
		} else if(xPos < _instance.visibleHeight) {
			xPos = _instance.visibleWidth;
		}

		_instance.pageHeight = xPos;
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

		killModules();
		_instance.parentNode.removeChild( _instance );
	};

	var _afterIgnore;
	_instance.ignoreScrollAfter = function( height ) {
		_afterIgnore = height;
	};

	_instance.pageScrollRatio = function( ratio ) {
		var totalHeight = _scrollController.getPageHeight();

		var offset = 0;
		var height = totalHeight - _scrollController.getScrollRatio() * totalHeight;
		if(_afterIgnore != null && height < _afterIgnore) {
			var ratio = (_afterIgnore - height) / _afterIgnore;
			offset = _afterIgnore * Power1.easeIn.getRatio(ratio);
		}

		TweenMax.set( Assets.LAYER_TEMPLATE, {x:-Assets.SCROLL_CONTROLLER.currentScroll.y + offset} );
		setModuleVisibilty();
	};

	_instance.getCurrentScrolledIndex = function() {
		var l			= _modules.length;
		for(var i = 0; i < l; i += 1) {
			var offset = _scrollController.currentScroll.y - _modules[i].aniGetX();
			if( offset < -1) {
				return i - 1;
			}
		}
		return 0;
	};

	_instance.scrollToNextModule = function() {
		var index =  _instance.getCurrentScrolledIndex() + 1;
		if(index >= _modules.length) {
			index = _modules.length - 1;
		}

		_scrollController.scrollTo(_modules[ index ].aniGetX(), 1, Expo.easeInOut);
	};

	_instance.scrollToPrevModule = function() {
		var index =  _instance.getCurrentScrolledIndex() - 1;
		if(index < 0 ) {
			index = 0;
		}
		_scrollController.scrollTo(_modules[ index ].aniGetX(), 1, Expo.easeInOut);
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

	function onPageScroll() {
		_instance.pageScrollRatio( _scrollController.getScrollRatio() );
	}

	return _instance;
}


