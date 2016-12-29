/*--------------------------------------------------------*/
/*                                                        */
/*   Copyright Set Snail                                  */
/*   All rights reserved.                                 */
/*                                                        */
/*                                                        */
/*        /^\    /^\                                      */
/*       {  O}  {  O}                                     */
/*        \ /    \ /                                      */
/*        //     //       _------_                        */
/*       //     //     ./~        ~-_                     */
/*      / ~----~/     /              \                    */
/*    /         :   ./       _---_    ~-                  */
/*   |  \________) :       /~     ~\   |                  */
/*   |        /    |      |  :~~\  |   |                  */
/*   |       |     |      |  \___-~    |                  */
/*   |        \ __/`\______\.        ./                   */
/*    \                     ~-______-~\.                  */
/*    .|                                ~-_               */
/*   /_____________________________________~~____         */
/*                                                        */
/*--------------------------------------------------------*/


/**
 *
 * @param listener parsed DisplayObject if another object is to be listened on.
 * @param params every public var and callbacks of Touchable can be set throu this params
 * @param autokill disposes and removes eventlisteners on REMOVED_FROM_STAGE. Default disposes on overrided dispose();
 * @return Touchable
 *
 */
Touchable.listen = function( listener, params, autokill ) {
	//Default Autokill to true;
	autokill = autokill !== null && autokill !== undefined ? autokill : true;

	var touchDispatcher							= new Touchable( listener, autokill );

	touchDispatcher.clickOrUp					= params.clickOrUp !== undefined			? params.clickOrUp			: false;
	touchDispatcher.clickWithinBounds			= params.clickWithinBounds !== undefined	? params.clickWithinBounds	: false;
	touchDispatcher.clickOrHold					= params.useClickHold !== undefined			? params.useClickHold		: false;
	touchDispatcher.preventDefault				= params.preventDefault !== undefined		? params.preventDefault		: true;

	touchDispatcher.onDown( params.onDown );
	touchDispatcher.onMove( params.onMove );
	touchDispatcher.onClick( params.onClick );
	touchDispatcher.onUp( params.onUp );
	touchDispatcher.onOver( params.onOver );
	touchDispatcher.onOut( params.onOut );

	return touchDispatcher;
};

Touchable.apply = function( target, autokill ) {
	return new Touchable( target, autokill, true );
};


/**
 *
 * @param listenOn : parsed DisplayObject if another object is to be listened on. this is default;
 * @param autokill : disposes and removes eventlisteners on REMOVED_FROM_STAGE. Default disposes on overrided dispose();
 *
 */
function Touchable( listenOn, autokill, apply ) {
	var _instance								;


	//SETUP INSTANCE;
	if( listenOn ) {
		if( apply === true ){
			_instance = listenOn;
		}else{
			_instance = {};
		}
	}else{
		_instance = document.createElement("div");
		_instance.style.position = "absolute";
	}



	//MS
	var HOLD_TIME								= 250;
	//In xPixel + yPixel move;
	var MAX_CLICK_DRAG_DIST						= 14;
	//In MS, if useClickHold
	var MAX_CLICK_HOLD_TIME						= 300;

	var _onNewTouch								= null;

	var _touches								= [];
	var _numOfTouches							= null;
	var _singleTouchInfo						= null;

	var _unifiedToucher 						= null;

	var _listenOn								= listenOn ? listenOn : _instance;

	var _autoKill 								= autokill !== null && autokill !== undefined ? autokill : false;
	var _autoKillListener 						= null;


	/**Callback click only within hold time, else callback hold;**/
	_instance.clickOrHold						= false;
	/**Callback only onClick or onUp. Never both at the same time;**/
	_instance.clickOrUp							= false;
	/**Used for Buttons, calls back onClick undepended of hold time or drag distance. As long as the finger is within the DisplayObjects bounds**/
	_instance.clickWithinBounds					= false;

	_instance.preventDefault					= true;
	_instance.stopPropagation					= false;

	/**
	 *	Kills/disposes the class and all its content on REMOVED FROM STAGE
	 */
	_instance.enableAutokill = function() {
		if( _autoKillListener !== null) {
			return;
		}

		var checkTime = 1000;
		var totalCheckTime = 0;
		var hasHadParent = false;

		_autoKillListener = setInterval( function(){
			if( _listenOn === null ) {
				_instance.disableAutoKill();
				return;
			}

			var node = _listenOn.parentNode;
			totalCheckTime += checkTime;

			if( !hasHadParent || totalCheckTime >= 20000 ){
				hasHadParent = node !== null;
			}


	 		if( node === null ) {
	 			_instance.disableAutoKill();
	 			return;
			}

			var kill = true;
			do {
				if( node === document ){
					kill = false;
				}
				node = node.parentNode;

			} while ( node );

			if( hasHadParent && kill ) {
				_instance.dispose();
			}

		}, checkTime );
	};

	/**
	 *	Disables autokill, remember to call dispose manualy if the function has been called
	 */
	_instance.disableAutoKill = function() {
		// _listenOn.removeEventListener( Event.REMOVED_FROM_STAGE, dispose );
		clearInterval(_autoKillListener);
		_autoKillListener = null;
	};


	/*------------------------
	* CALLBACKS
	*-------------------------*/

	/**
	 *
	 * @param callback callback when the user sets finger down on object
	 * @param fingerId used for multitouch. use this parameter to listen for a specific touch on object
	 *
	 */
	_instance.onDown = function( callback, fingerId ) {
		setupListeners();

		fingerId = fingerId ? fingerId : -1;

		var touchInfo = _instance.getTouchInfo( fingerId );
		if( touchInfo ) {
			// trace("ON DOWN LISTENING");
			touchInfo.onDown = callback;
		}
	};

	/**
	 *
	 * @param callback callback when the user removes the finger from object
	 * @param fingerId used for multitouch. use this parameter to listen for a specific touch on object
	 *
	 */
	_instance.onUp = function( callback, fingerId ) {
		setupListeners();

		fingerId = fingerId ? fingerId : -1;

		var touchInfo = _instance.getTouchInfo( fingerId );
		if( touchInfo ) {
			touchInfo.onUp = callback;
		}
	};

	/**
	 *
	 * @param callback callback when the user moves the finger on object
	 * @param fingerId used for multitouch. use this parameter to listen for a specific touch on object
	 *
	 */
	_instance.onMove = function( callback, fingerId ) {
		setupListeners();

		fingerId = fingerId ? fingerId : -1;

		var touchInfo = _instance.getTouchInfo( fingerId );
		if( touchInfo ) {
			touchInfo.onMove = callback;
		}
	};

	/**
	 * See also clickOrHold, clickOrUp and clickWithinBounds
	 *
	 * @param callback callback when the user clicks object;
	 * @param fingerId used for multitouch. use this parameter to listen for a specific touch on object
	 *
	 */
	_instance.onClick = function( callback, fingerId ) {
		setupListeners();

		fingerId = fingerId ? fingerId : -1;

		var touchInfo = _instance.getTouchInfo( fingerId );
		if( touchInfo ) {
			touchInfo.onClick = callback;
		}
	};

	/**
	 *
	 * @param callback callback when the user holdes the finger down on object
	 * @param fingerId used for multitouch. use this parameter to listen for a specific touch on object
	 *
	 */
	_instance.onHold = function( callback, fingerId ) {
		setupListeners();

		fingerId = fingerId ? fingerId : -1;

		var touchInfo = _instance.getTouchInfo( fingerId );
		if( touchInfo ) {
			touchInfo.onHold = callback;
		}
	};

	/**
	 *
	 * @param callback callback when the user moves the finger over the object
	 * @param fingerId used for multitouch. use this parameter to listen for a specific touch on object
	 *
	 */
	_instance.onOver = function( callback, fingerId ) {
		if(callback === undefined || callback === null){
			return;
		}

		setupListeners();

		fingerId = fingerId ? fingerId : -1;

		var touchInfo = _instance.getTouchInfo( fingerId );
		if( touchInfo ) {
			touchInfo.onOver = callback;
		}
	};

	/**
	 *
	 * @param callback callback when the user moves the finger out of the object
	 * @param fingerId used for multitouch. use this parameter to listen for a specific touch on object
	 *
	 */
	_instance.onOut = function( callback, fingerId ) {
		if(callback === undefined || callback === null){
			return;
		}

		setupListeners();

		fingerId = fingerId ? fingerId : -1;

		var touchInfo = _instance.getTouchInfo( fingerId );
		if( touchInfo ) {
			touchInfo.onOut = callback;
		}
	};

	/**
	 * This callback is used for MultiTouching. <br />
	 * #Optional returns a TouchInfo as param on callback
	 *
	 * touchInfo.touch.id can then be used to listen for other calllback by parsing the id with it as second param
	 *
	 * @param callback callback when the user adds a finger on the object
	 * @param fingerId used for multitouch. use this parameter to listen for a specific touch on object
	 */
	_instance.onNewTouch = function( callback ) {
		if(callback === undefined || callback === null){
			return;
		}

		setupListeners();
		_onNewTouch = callback;
	};

	/*-------------------------*/

	_instance.getTouchInfo = function( touchId ) {
		touchId = touchId === undefined ? -1 : touchId;
		if( touchId == -1 ) {
			if( !_singleTouchInfo ) {

				_singleTouchInfo = new TouchInfo();
				_singleTouchInfo.clickOrHold = _instance.clickOrHold;
				_singleTouchInfo.clickOrUp = _instance.clickOrUp;
				_singleTouchInfo.clickWithinBounds = _instance.clickWithinBounds;
				_singleTouchInfo.listenOn = _listenOn;

			}
			return _singleTouchInfo;
		}
		return _touches[ touchId ];
	};

	/**
	 *  @return the number of finger currently on
	 */
	_instance.numOfFingers = function() { return _numOfTouches; };

	_instance.getListener = function() { return _listenOn; };

	_preTouches = null;

	function handleTouch( event ){
		var e = event.activeEvent.event;

		//Quickfix - Remake this with
		if( _instance.preventDefault === true ){
			if( event.activeEvent.phase === TouchPhase.MOVED && BrowserDetect.TABLET || BrowserDetect.MOBILE ) {
				e.preventDefault();
			} else if( !BrowserDetect.TABLET && !BrowserDetect.MOBILE) {
				e.preventDefault();
			}
		}

		if( _instance.stopPropagation === true ){
			e.stopPropagation();
		}

		var touchesTemp = e.touches || e.changedTouches;
		var phase = event.activeEvent.phase;

		var touch;
		var touchInfo;

		_numOfTouches = touchesTemp.length;

		if( phase === TouchPhase.ENDED && touchesTemp.length === 0 ){
			touchesTemp = _preTouches;
			_numOfTouches = touchesTemp.length;
		}

		for( var i = 0; i < _numOfTouches; i++ ){
			// console.log(touchesTemp.length);
			touch = touchesTemp.item( i );
			if( !touch ) {
				continue;
			}
			// console.log( "PAGE X = " + touch.pageX );

			//Callback and setup if new finger;
			if( !_touches[ touch.identifier ] ) {
				_touches[ touch.identifier ] = TouchInfo.getInfo( touch, _instance.clickOrHold, _instance.clickOrUp, _instance.clickWithinBounds, _listenOn );
				if( _onNewTouch !== null ) {
					_onNewTouch( _touches[ touch.identifier ] );
				}
			}

			// console.log( touch.identifier );

			// touchInfo = _touches[ touch.identifier ];

			touchInfo = TouchInfo.getInfo( touch, _instance.clickOrHold, _instance.clickOrUp, _instance.clickWithinBounds, _listenOn );

			// console.log(touchInfo.touch.pageX);

			if( _singleTouchInfo ){
				_singleTouchInfo.touch = touchInfo.touch;
			}

			//Calc and callback
			switch( phase ) {
				case TouchPhase.BEGAN: {
					touchInfo.handleBegan();
					if( _singleTouchInfo && i === _numOfTouches - 1 ) {
						_singleTouchInfo.handleBegan();
					}
					break;
				}
				case TouchPhase.MOVED: {
					touchInfo.handleMoved();
					if( _singleTouchInfo && i === _numOfTouches - 1 ) {
						_singleTouchInfo.handleMoved();
					}
					break;
				}
				case TouchPhase.ENDED: {
					touchInfo.handleEnded();
					if( _singleTouchInfo && i === _numOfTouches - 1 && _numOfTouches == 1 ) {
						_singleTouchInfo.handleEnded();
					}

					//remove touch
					TouchInfo.pool( _touches[ touch.identifier ] );
					delete _touches[ touch.identifier ];
					_numOfTouches--;

					break;
				}
			}

		}

		_preTouches = touchesTemp;

	}

	/**
	 * Listeners and cleaners;
	 */
	var _listening					= false;

	function setupListeners() {
		if( !_listening ){
			_unifiedToucher = new UnifiedTouch( _listenOn );

			_unifiedToucher.onDown( handleTouch );
			_unifiedToucher.onMove( handleTouch );
			_unifiedToucher.onUp( handleTouch );

			_listening = true;

			if( _autoKill ){
				_instance.enableAutokill();
			}
		}
	}

	_instance.dispose = function() {
		_instance.disableAutoKill();

		if( !_listening ) {
			if(_unifiedToucher !== null){
				_unifiedToucher.dispose();
				_unifiedToucher = null;
			}
		}

		_listening = false;
	};

	return _instance;
}












TouchPhase = {};

TouchPhase.BEGAN = 1;
TouchPhase.MOVED = 2;
TouchPhase.ENDED = 4;

TouchPhase.HOVER = 8;

function UnifiedTouch( target ){

	var _instance = {};

	_instance.isTouch = BrowserDetect.TABLET || BrowserDetect.MOBILE;
	// _instance.markForTrace = false;

	_instance.activeEvent = {};

	var _callbackDown;
	var _callbackUp;
	var _callbackMove;

	function init() {
		if( _instance.isTouch ) {
			addEvent( "touchstart", target, onTouchStart );
			addEvent( "touchmove", target, onMouseMove );
			addEvent( "touchend", target, onTouchEnd );
			// target.addEventListener( "touchstart", onTouchStart );
			// target.addEventListener( "touchmove", onTouchMove );
			// target.addEventListener( "touchend", onTouchEnd );
		}else{
			addEvent( "mousedown", target, onMouseDown );
			// target.addEventListener( "mousedown", onMouseDown );
		}
	}

	_instance.onDown = function( callback ){
		_callbackDown = callback;
	};

	_instance.onUp = function( callback ){
		_callbackUp = callback;
	};

	_instance.onMove = function( callback ){
		_callbackMove = callback;
	};


	function onTouchStart( e ) {
		// console.log( "TouchStart" );
		_instance.activeEvent.event = e;
		_instance.activeEvent.phase = TouchPhase.BEGAN;

		callbackEvent( _callbackDown );
	}

	function onTouchEnd( e ) {
		// console.log( "TouchEnd" );
		_instance.activeEvent.event = e;
		_instance.activeEvent.phase = TouchPhase.ENDED;

		callbackEvent( _callbackUp );
	}

	function onTouchMove( e ) {
		// console.log( "TouchMove " + e.touches[0].pageY );

		_instance.activeEvent.event = e;
		_instance.activeEvent.phase = TouchPhase.MOVED;

		// console.log( "HAAALLOOOOO" +  e.touches[0].clientY );

		callbackEvent(_callbackMove);
	}

	function onMouseDown( e ){
		// trace("DOWN");
		_instance.activeEvent.phase = TouchPhase.BEGAN;
		_instance.activeEvent.event = e;
		_instance.activeEvent.event.touches = fillDesktopTouch( e );

		callbackEvent( _callbackDown );

		addEvent( "mousemove", window, onMouseMove );
		addEvent( "mouseup", window, onMouseUp );
		// window.addEventListener( "mousemove", onMouseMove );
		// window.addEventListener( "mouseup", onMouseUp );
	}

	function onMouseUp( e ){
		// trace("UP");
		_instance.activeEvent.phase = TouchPhase.ENDED;
		_instance.activeEvent.event = e;
		_instance.activeEvent.event.touches = fillDesktopTouch( e );

		callbackEvent( _callbackUp );

		removeEvent( "mousemove", window, onMouseMove );
		removeEvent( "mouseup", window, onMouseUp );
		// window.removeEventListener( "mousemove", onMouseMove );
		// window.removeEventListener( "mouseup", onMouseUp );
	}

	function onMouseMove( e ){
		_instance.activeEvent.phase = TouchPhase.MOVED;
		_instance.activeEvent.event = e;
		_instance.activeEvent.event.touches = fillDesktopTouch( e );

		callbackEvent( _callbackMove );
	}

	function fillDesktopTouch( e ){
		e.identifier = DesktopTouches.identifyInc;
		DesktopTouches.identifyInc++;

		return new DesktopTouches( e );
	}

	function callbackEvent( func ) {
		if( func !== null && func !== undefined ) {
			func( _instance );
		}
	}

	_instance.dispose = function() {
		if( _instance.isTouch ) {
			removeEvent( "touchstart", target, onTouchStart );
			removeEvent( "touchmove", target, onTouchMove );
			removeEvent( "touchend", target, onTouchEnd );
			// target.removeEventListener( "touchstart", onTouchStart );
			// target.removeEventListener( "touchmove", onTouchMove );
			// target.removeEventListener( "touchend", onTouchEnd );
		}else{
			removeEvent( "mousedown", target, onMouseDown );
			removeEvent( "mousemove", window, onMouseMove );
			removeEvent( "mouseup", window, onMouseUp );
			// target.removeEventListener( "mousedown", onMouseDown );
			// window.removeEventListener( "mousemove", onMouseMove );
			// window.removeEventListener( "mouseup", onMouseUp );
		}
	};

	function addEvent( evnt, elem, func ) {
	   if( elem.addEventListener ){  // W3C DOM
	      elem.addEventListener( evnt, func, false );
	  } else if( elem.attachEvent ) { // IE DOM
	      elem.attachEvent( "on" + evnt, func );
	   }
	}

	function removeEvent( evnt, elem, func ) {
	   if( elem.removeEventListener ) { // W3C DOM
	    elem.removeEventListener( evnt, func, false );
	   } else if( elem.attachEvent ) { // IE DOM
	      elem.detachEvent( "on" + evnt, func );
	   }
	}

	init();

	return _instance;
}











DesktopTouches.identifyInc = 0;

function DesktopTouches( item ){

	var _instance = {};
	_instance.length = 1;

	var _items = [item];

	_instance.item = function( id ){
		return _items[ id ];
	};

	return _instance;
}
