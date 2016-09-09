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


TouchDragger.add = function( item, plugins, listeners ) {
	return new TouchDragger( new GroupDragger( [ item ], plugins ), listeners );
};

TouchDragger.addGroup = function( group, listeners ) {
	return new TouchDragger( group, listeners );
};

TouchDragger.ON_START						= "ON_START";
TouchDragger.ON_MOVE						= "ON_MOVE";
TouchDragger.ON_END							= "ON_END";

function TouchDragger( group, listeners ) {

	var _instance								= new EventDispatcher();

	_instance.dispatchEvents					= true;

	/**Type::GroupDragger*/
	var _dragger								= null;
	var _listeners								= null;

	var _isActive								= false;
	var _touchables								= [];
	var _autoKill								= true;

	/**Type::TouchDragger*/
	var _takeOver								;
	var _stopTakeOverOnUp						= false;
	var _basedOnTouchinfo						= false;
	var _isDragging								= false;

	//Callbacks
	var _start									;
	var _move									;
	var _end									;
	var _onNewTouch								;

	var _touchInfo								;

	_instance.init = function( group, listeners ) {
		_dragger	= group;
		_listeners	= listeners;

		_dragger.addEventListener( GroupDragger.NUM_OF_ITEMS_CHANGEST, onItemsUpdated );

		setActionsToThis();


		if( _listeners !== null && _listeners !== undefined ) {
			_instance.addListenerTo( _listeners );
		} else {
			// console.log("INIT = " + _dragger.getAllItems());
			_instance.addListenerTo( _dragger.getAllItems() );
		}

		_instance.activate();
	};

	_instance.enable3DTransform = function() {
		_dragger.enable3DTransform();
	};

	_instance.add = function( items, plugins ) {
		_dragger.addGroup( items, plugins );
		if( _listeners !== null && _listeners !== undefined ) {
			_instance.addListenerTo( items );
		}
	};

	_instance.enableAutokill = function() {
		_autoKill = true;
		_touchables.forEach(function( touch ){
			touch.enableAutokill();
		});
	};

	_instance.disableAutokill = function() {
		_autoKill = false;
		_touchables.forEach(function( touch ){
			touch.disableAutoKill();
		});
	};

	_instance.dispose = function() {
		while( _touchables.length !== 0 ) {
			_touchables.pop().dispose();
		}
	};

	_instance.onNewTouch = function( callback ) {
		_onNewTouch = callback;
	};

	_instance.deactivate = function() {
		_isActive = false;
		_isDragging = false;
	};

	_instance.activate = function() {
		_isActive = true;
	};

	_instance.isDragging = function() { return _isDragging; };

	_instance.takeover = function( dragger, stopOnUp ) {
		_stopTakeOverOnUp = stopOnUp;
		_takeOver = dragger;

		_start = _takeOver.start;
		_move = _takeOver.move;
		_end = _takeOver.end;
	};

	_instance.baseOn = function( touchInfo ) {
		if( _basedOnTouchinfo ) {
			return;
		}

		dispose();
		touchInfo.onDown = userDown;
		touchInfo.onMove = userMove;
		touchInfo.onUp = userUp;
		_touchInfo = touchInfo;

		_basedOnTouchinfo = true;
	};

	function setActionsToThis() {
		_start = _instance.start;
		_move = _instance.move;
		_end = _instance.end;
		_stopTakeOverOnUp = false;
	}

	function onItemsUpdated() {
		dispose();
		listen();
	}

	function listen() {
		if( _listeners ) {
			addListenerTo( _listeners );
		} else {
			addListenerTo( _dragger.getAllItems() );
		}
	}

	//Touchlistener, touchId;

	_instance.addListenerTo = function( items ) {
		var l = items.length;
		var listener;

		for( var i = 0; i < l; i++ ) {
			listener = Touchable.listen( items[ i ], { onDown:userDown, onMove:userMove, onUp:userUp }, _autoKill );
			listener.onNewTouch( newTouch );

			_touchables.push( listener );
		}
	};

	function newTouch( touchInfo ) {
		if( _onNewTouch !== undefined ) {
			_onNewTouch( touchInfo );
		}
	}

	var _preClientX = 0;
	var _preClientY = 0;

	function userDown( e ) {
		if( !_isActive ){ return; }

		var touch = _touchInfo ? _touchInfo.touch : e.touch;

		_preClientX = touch.clientX;
		_preClientY = touch.clientY;

		_isDragging = true;
		_start();

		if( _instance.dispatchEvents ) {
			_instance.dispatchEvent( TouchDragger.ON_START, { touchInfo:e } );
		}
	}

	function userMove( e ) {
		if( !_isActive ){ return; }

		var touch = _touchInfo ? _touchInfo.touch : e.touch;

		_move( touch.clientX - _preClientX, touch.clientY - _preClientY );
		_preClientX = touch.clientX;
		_preClientY = touch.clientY;

		if( _instance.dispatchEvents ) {
			_instance.dispatchEvent( TouchDragger.ON_MOVE, { touchInfo:e } );
		}
	}

	function userUp( e ) {
		if( !_isActive ) { return; }

		_isDragging = false;
		_end();

		if( _stopTakeOverOnUp ) {
			setActionsToThis();
		}

		if( _basedOnTouchinfo ) {
			listen();
			_touchInfo = null;
			_basedOnTouchinfo = false;
		}

		if( _instance.dispatchEvents ) {
			_instance.dispatchEvent( TouchDragger.ON_END, { touchInfo:e } );
		}
	}

	/**For internal use only*/
	_instance.start = function() {
		if( !_isActive ) { return; }

		_dragger.dragStartet();
	};

	/**For internal use only*/
	_instance.move = function( distX, distY ) {
		if( !_isActive ) { return; }
		// console.log(distX + " : " + distY);

		_dragger.updateDist( distX, distY );
	};

	/**For internal use only*/
	_instance.end = function() {
		if( !_isActive ) { return; }

		_dragger.dragEnded();
	};

	_instance.init( group, listeners );

	return _instance;

}
