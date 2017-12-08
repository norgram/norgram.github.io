function ScrollController() {
	// Events
	ScrollController.ON_SCROLL_START 				= "ON_SCROLL_START";
	ScrollController.ON_SCROLL_MOVE 				= "ON_SCROLL_MOVE";
	ScrollController.ON_SCROLL_STOP 				= "ON_SCROLL_STOP";
	ScrollController.ON_SCROLL_EASE_STOP 			= "ON_SCROLL_EASE_STOP";

	ScrollController.ON_200_PX_SCROLLED		 		= "ON_200_PX_SCROLLED";
	ScrollController.ON_OVERSCROLLING_TOP 			= "ON_OVERSCROLLING_TOP";
	ScrollController.ON_OVERSCROLLING_BOT 			= "ON_OVERSCROLLING_BOT";

	var _instance					= new EventDispatcher();
	var _target						= null;

	var _pageHeight					= 0;
	_instance.currentScroll			= {x:0, y:0};

	// For touch
	var _fakeDragItem				= null;
	var _dragBounds					= null;
	var _touchDragger				= null;

	var _isScrolling = false;


	var _startScroll				= {x: 0, y: 0};
	var _200PxScrolled				= false;

	ScrollController.DEBUG_TOUCH_ON_DESKTOP 		= false;

	ScrollController.DEFAULT_SCROLL_SPEED = 0.5;

	_instance.scrollSpeed = ScrollController.DEFAULT_SCROLL_SPEED;

	/**
		@Params
		body:Typically use body - Used for the events
	*/
	_instance.init = function( target ) {
		_target = target;

		if( BrowserDetect.TABLET === true || BrowserDetect.MOBILE === true || ScrollController.DEBUG_TOUCH_ON_DESKTOP === true ) {
			_fakeDragItem = document.createElement( "div" );
			// _fakeDragItem.style.position = "absolute";
			// _fakeDragItem.style.top = "0px";
			// _fakeDragItem.style.left = "0px";
			_fakeDragItem.style.width = "0px";
			_fakeDragItem.style.height = "0px";
			// _fakeDragItem.style.display = "none";

			AnimationUtils.apply( _fakeDragItem );
			_fakeDragItem.aniDisableRender();

			_basic = new DragBasic();
			_basic.lockY = true;

			var easePlugin = new DragEase();
			//For how long should the ease last;
			easePlugin.time = 2;
			//How fare the item be thrown based on drag amount
			easePlugin.distance = 1.5;
			//What ease should be used for the throw; Expo.easeOut is Default;
			easePlugin.ease = Expo.easeOut;

			easePlugin.onStart(touchStart);
			easePlugin.onMove(touchMove);
			easePlugin.onEnd(touchEnd);

			var bounds = new Rectangle( 0, -_pageHeight + Assets.RESIZE_MANAGER.getWindowHeight(), window.innerWidth, _pageHeight );

			_dragBounds = new DragBounds( bounds );
			// _dragBounds.easeEase = Back.easeOut;
			_dragBounds.easeDist = 4;
			_dragBounds.boundsEase = 0.4;
			_dragBounds.useItemsSize = false;

			_touchDragger = TouchDragger.add( _fakeDragItem, [ _basic, easePlugin, _dragBounds ], [ _target ], false );
			_touchDragger.enable3DTransform();

			// console.log("ScrollController :: TOUCH SCROLL ENABLED");
		} else {
			window.addEventListener( "scroll", desktopHandle );

			//Prevent overscrolling in some Browsers on Desktop;
			window.addEventListener("mousewheel", function(e) {
				if(e.wheelDelta > 0 && window.pageYOffset <= 0 ){
					overscrollingTop(e.wheelDelta);
					e.preventDefault();
				} else if(e.wheelDelta < 0 && window.pageYOffset >= Math.floor(_pageHeight - Assets.RESIZE_MANAGER.getWindowHeight()) ) {
					overscrollingBot(e.wheelDelta);
					e.preventDefault();
				}
			}, false);

		}

		Assets.RESIZE_MANAGER.addEventListener( ResizeEvents.RESIZE, updateBounds );
	};


	function overscrollingTop( amount ) {
		_instance.dispatchEvent(ScrollController.ON_OVERSCROLLING_TOP);
	}

	function overscrollingBot( amount ) {
		_instance.dispatchEvent(ScrollController.ON_OVERSCROLLING_BOT);
	}

	_instance.disableScroll = function() {
		if( BrowserDetect.TABLET || ScrollController.DEBUG_TOUCH_ON_DESKTOP ) {
			_basic.lockY = true;
		} else {
			window.removeEventListener( "scroll", desktopHandle );
		}
	};

	_instance.enableScroll = function() {
		if( BrowserDetect.TABLET || ScrollController.DEBUG_TOUCH_ON_DESKTOP ) {
			_basic.lockY = false;
		} else {
			window.addEventListener( "scroll", desktopHandle );
			desktopHandle();
		}
	};

	_instance.setPageHeight = function( value ){
		//DIRTY:: USED ONLY OF SCROLLING HORRIZONTAL; ELSE SET TO ZERO;
		var xOffset = Assets.RESIZE_MANAGER.getWindowHeight() - Assets.RESIZE_MANAGER.getWindowWidth();

		_pageHeight = value + xOffset;

		updateBounds();
	};

	_instance.scrollToTop = function( speed, ease ) {

		if(_touchDragger){
			_fakeDragItem.aniSetY( 0 );// = "0px";
			touchMove();
		} else {
			_scrollToSpeed = speed != null ? speed : -1;
			_scrollToEase = ease;
			window.scrollTo(0, 0);
		}
	};

	var _scrollToSpeed = -1;//ScrollController.DEFAULT_SCROLL_SPEED;
	var _scrollToEase = null;

	_instance.scrollTo = function( pos, speed, ease ) {
		if(_touchDragger){
			_fakeDragItem.aniSetX( pos );// = "0px";
			touchMove();
		} else {
			_scrollToSpeed = speed != null ? speed : -1;
			_scrollToEase = ease;

			if( ease == null ) {
				_instance.currentScroll.y = pos;
			}
			window.scrollTo(0, pos);
		}

	};

	_instance.getScrollRatio = function(){
		return _instance.currentScroll.y / ( _pageHeight - Assets.RESIZE_MANAGER.getWindowHeight() );
	};

	_instance.getPageHeight = function() {
		return _pageHeight;
	};

	_instance.scrollToBottom = function( onComplete ) {
		TweenMax.to( _instance.currentScroll, 0.6,
			{
				y:_pageHeight - Assets.RESIZE_MANAGER.getWindowHeight(),

				onUpdate:function() {
					_instance.dispatchEvent( ScrollController.ON_SCROLL_MOVE );
				},

				onComplete:onComplete,
				ease:Expo.easeIn
			} );
	};

	_instance.isDragging = function(){
		return _touchDragger ? _touchDragger.isDragging() : false;
	};

	_instance.isScrolling = function() {
		return _isScrolling;
	};

	function updateBounds(){
		if( _touchDragger === null ){
			Assets.SCROLL_LAYER.style.height = _pageHeight + "px";
			return;
		}

		if( _pageHeight < Assets.RESIZE_MANAGER.getWindowWidth() ){
			_touchDragger.deactivate();
			//Force update;
			_touchDragger.end();
			return;
		}else{
			_touchDragger.activate();
		}

		if( _dragBounds ){
			// console.log(Assets.MAIN_MENU.menuOffsetH);

			_dragBounds.bounds.x = -_pageHeight + Assets.RESIZE_MANAGER.getWindowHeight();
			_dragBounds.bounds.width = _pageHeight - Assets.RESIZE_MANAGER.getWindowHeight();
		}


		//Force update;
		_touchDragger.end();
	}

	function touchStart( e ){
		// trace("touchStart");
		_200PxScrolled = false;
		_startScroll.x = _instance.currentScroll.x;
		_startScroll.y = _instance.currentScroll.y;

		_instance.dispatchEvent( ScrollController.ON_SCROLL_START );
	}

	function touchMove( e ){
		// trace("touchMove");
		_instance.currentScroll.y = -_fakeDragItem.aniGetX();//-parseInt( _fakeDragItem.style.top );
		// console.log( "CURRENT SCROLL = " + _instance.currentScroll.y);

		// special scroll events :)
		if(_200PxScrolled === false && Math.abs(_instance.currentScroll.y - _startScroll.y) > 200) {
			_200PxScrolled = true;
			_instance.dispatchEvent(ScrollController.ON_200_PX_SCROLLED);
		}

		_instance.dispatchEvent( ScrollController.ON_SCROLL_MOVE );
		// e.preventDefault();
	}

	function touchEnd( e ){
		// trace("touchEnd");
		_instance.dispatchEvent( ScrollController.ON_SCROLL_STOP );
	}

	function desktopHandle(e){
		// console.log( "HANDLE SCROLL" );
		var speed = _scrollToSpeed != -1 ? _scrollToSpeed : _instance.scrollSpeed;
		var ease = _scrollToEase != null ? _scrollToEase : Expo.easeOut;

		_isScrolling = true;

		// console.log(window.pageYOffset);

		var delta =  window.pageYOffset - _instance.currentScroll.y;


		if(Math.abs(delta) > 1000){
			_instance.dispatchEvent(ScrollController.ON_200_PX_SCROLLED);
		}

		// console.log(delta);

		TweenMax.killTweensOf( _instance.currentScroll );

		TweenMax.to( _instance.currentScroll, speed, {
			y:window.pageYOffset,
			onUpdate:function(){
				_instance.dispatchEvent( ScrollController.ON_SCROLL_MOVE );
			},
			onComplete:function() {
				_isScrolling = false;
				_instance.dispatchEvent( ScrollController.ON_SCROLL_EASE_STOP );
			},
			roundProps:["y"],
			ease:ease });

		_scrollToSpeed = -1;
		_scrollToEase = null;
	}

	return _instance;

}
