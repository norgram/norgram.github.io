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

TouchInfo._objectPool = [];

TouchInfo.getInfo = function( touch, clickOrHold, clickOrUp, clickWithinBounds, listenOn ) {
	var info = TouchInfo._objectPool.length !== 0 ? TouchInfo._objectPool.pop() : new TouchInfo();

	info.touch = touch;
	info.clickOrHold = clickOrHold;
	info.clickOrUp = clickOrUp;
	info.clickWithinBounds = clickWithinBounds;
	info.listenOn = listenOn;

	return info;
};

TouchInfo.pool = function( touchInfo ) {
	touchInfo.removeAllCallbacks();
	touchInfo.touch = null;
	touchInfo.listenOn = null;
	TouchInfo._objectPool.push( touchInfo );
};

TouchInfo.touches = function( touch, item ) {
	var hitPt			= item.globalToLocal( new Point( touch.globalX, touch.globalY ) );
	var hitObj			= item.hitTest( hitPt, true );

	if( hitObj ){
		return true;
	}

	return false;
};


/**
* TouchInfo only lives from finger down til finger up;
* Then it gets reset and objectpooled.
*
*/
function TouchInfo() {

	var _instance						= {};

	//MS
	var HOLD_TIME						= 250;
	//In xPixel + yPixel move;
	var MAX_CLICK_DRAG_DIST				= 14;
	//In MS, if useClickHold
	var MAX_CLICK_HOLD_TIME				= 300;

	var _holding						= false;
	var _clickable						= false;
	var _holdTimeout					;
	var _clickHoldTimeout				;
	var _isOver							= false;
	var _currentMoveDist				= 0;

	var _preClientX						= 0;
	var _preClientY						= 0;

	/** for internal use only */
	_instance.onDown					= null;
	_instance.onMove					= null;
	_instance.onUp						= null;
	_instance.onClick					= null;
	_instance.onOver					= null;
	_instance.onOut						= null;
	_instance.onHold					= null;

	_instance.touch						= null;

	/**Callback click only within hold time, else callback hold;**/
	_instance.clickOrHold				= false;
	/**Callback only onClick or onUp. Never both at the same time;**/
	_instance.clickOrUp					= false;
	/**Used for Buttons, calls back onClick undepended of hold time or drag distance. As long as the finger is within the DisplayObjects bounds**/
	_instance.clickWithinBounds			= true;
	/**The object that is being listened on. /currentTarget/*/
	_instance.listenOn					= null;

	// _instance.toString = function() { return touch.toString(); }

	_instance.removeAllCallbacks = function() {
		_instance.onDown = _instance.onMove = _instance.onUp = _instance.onClick = _instance.onOver = _instance.onOut = _instance.onHold = null;
	};

	_instance.handleBegan = function() {
		_holding = true;
		_clickable = true;

		_preClientX = _instance.touch.clientX;
		_preClientY = _instance.touch.clientY;

		if( _holdTimeout ) {
			clearTimeout( _holdTimeout );
		}

		if( _clickHoldTimeout ) {
			clearTimeout( _clickHoldTimeout );
		}

		_holdTimeout = setTimeout( checkIfHold, HOLD_TIME );

		if( _instance.clickOrHold ) {
			_clickHoldTimeout = setTimeout( killClick, MAX_CLICK_HOLD_TIME );
		}

		callback( _instance.onDown );
	};

	_instance.handleMoved = function() {
		_holding = false;

		_currentMoveDist += Math.abs( _preClientX - _instance.touch.clientX + _preClientY - _instance.touch.clientY );
		_preClientX = _instance.touch.clientX;
		_preClientY = _instance.touch.clientY;

		callback( _instance.onMove );

		if( _instance.onOver !== null || _instance.onOut !== null ) {
			if( _isOver ) {
				if( !touches( _instance.touch, _instance.touch.target ) ) {
					_isOver = false;

					callback( _instance.onOut );
				}
			} else {
				if( touches( _instance.touch, _instance.touch.target ) ) {
					_isOver = true;

					callback( _instance.onOver );
				}
			}
		}
	};

	_instance.handleEnded = function() {
		var clickDispatched	= false;

		if( !_instance.clickOrUp ) {
			callback( _instance.onUp );

			//Call if clicked
			if( _clickable && _currentMoveDist < MAX_CLICK_DRAG_DIST ) {
				clickDispatched = true;
				callback( _instance.onClick );
			}
		} else {
			//Call if clicked
			if( _clickable && _currentMoveDist < MAX_CLICK_DRAG_DIST ) {
				clickDispatched = true;
				callback( _instance.onClick );
			} else {
				callback( _instance.onUp );
			}
		}

		if( _instance.clickWithinBounds && !clickDispatched ) {
			if( touches( _instance.touch, _instance.touch.target ) ) {
				callback( _instance.onClick );
			}
		}

		_isOver = false;
		_currentMoveDist = 0;
		_holding = false;
	};

	function killClick() {
		_clickable = false;
	}

	function checkIfHold() {
		if( _holding )
			callback( _instance.onHold );
	}

	function callback( func ) {
		if( func !== null && func !== undefined ) {
			func( _instance );
		}
	}

	function touches( touch, target ){
		var deltaX = touch.clientX - parseInt( target.style.left );
		var deltaY = touch.clientY - parseInt( target.style.top );

		if( deltaX > 0 && deltaX < parseInt( target.style.width )){
			if(deltaY > 0 && deltaY < parseInt( target.style.height )){
				return true;	//IS INSIDE;
			}
		}
		return false;	//IS OUTSIDE;
	}

	return _instance;
}
