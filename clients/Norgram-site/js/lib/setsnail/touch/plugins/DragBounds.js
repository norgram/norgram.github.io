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


//States;
DragBounds.STATE_INSIDE				= "INSIDE";
DragBounds.STATE_OUTSIDE_TOP		= "OUTSIDE_TOP";
DragBounds.STATE_OUTSIDE_BOT		= "OUTSIDE_BOT";
DragBounds.STATE_OUTSIDE_LEFT		= "OUTSIDE_LEFT";
DragBounds.STATE_OUTSIDE_RIGHT		= "OUTSIDE_RIGHT";

//Internal StateChange
DragBounds.UNKNOWN					= 0;
DragBounds.INSIDE					= 1;
DragBounds.TOP						= 2;
DragBounds.BOT						= 4;
DragBounds.LEFT						= 8;
DragBounds.RIGHT					= 16;

function DragBounds( bounds ){

	var _instance						= new DraggerEasePlugin();

	var _currentState					= DragBounds.INSIDE;

	var _easeItemX						= null;
	var _easeItemY						= null;

	/**Gives the edges of the bounds an ease to your drag. 0 will give it no ease and 1 would make it seem that there are no bounds, where .5 would halfen its dragamount outside the bounds and 2 would double it*/
	_instance.boundsEase				= 0;
	/**If drag ease is added this value detirmens have fare the ease should travel out the bounds before returning (value is depended on dragamount and should be considered as a multiplyer)*/
	_instance.easeDist					= 4;
	/**Adds a border ease for the dragEase. This ease is used when the object goes out of bounds and DragEase plugin is used*/
	_instance.easeEase					= Linear.easeNone;
	/**The bounds of your drag. Modify as needed.*/
	_instance.bounds					= null;
	/**Set if the items bounds should be calculated with the bounds. Set to false if you want to do this manualy*/
	_instance.useItemsSize				= true;
	/**Dispatch Events or not. Disabling will improve performance*/
	_instance.dispacthEvents			= false;
	/**If set to true, all dragEvents will be dispatched on every object instead of the instance of DragBounds*/
	_instance.dispatchOnObjects			= false;

	_instance.init = function( bounds ){
		_instance.bounds = bounds;
	};

	/*
	* EASE DRAG;
	*/

	/**The x and y ratio from what point in the ratio the obj is going out side the bounds*/
	var _xBoundsStartEaseRatio			= -1;
	var _yBoundsStartEaseRatio			= -1;

	var _currentEaseState				= DragBounds.UNKNOWN;
	//0,0 if items are inside the bounds; This var also detirmens if the app is outside the bounds when the user releases;
	var _outsideDistToBorder			= {};

	_instance.easeStarted = function() {
		_xBoundsStartEaseRatio = -1;
		_yBoundsStartEaseRatio = -1;
		_easeItemX = null;
		_easeItemY = null;

		_outsideDistToBorder = getDistToBorder();

		_currentEaseState = DragBounds.UNKNOWN;
	};

	function getDistToBorder() {
		var dist		= { x:0, y:0 };
		if( _currentState & DragBounds.INSIDE ) {
			return dist;
		}

		var l				= _instance.dragItems.length;
		var boundsMaxX		= _instance.bounds.x + _instance.bounds.width;
		var boundsMaxY		= _instance.bounds.y + _instance.bounds.height;
		var item			= null;
		var extraWidth		= 0;
		var extraHeight		= 0;

		for( var i = 0; i < l; i++ ) {
			item = _instance.dragItems[ i ];

			var itemX = getItemX( item );
			var itemY = getItemY( item );
			var itemW = parseInt( item.style.width );
			var itemH = parseInt( item.style.height );

			//Take the items size in to account or not, depending on useItemsSize.
			extraWidth	= _instance.useItemsSize ? itemW : 0;
			extraHeight = _instance.useItemsSize ? itemH : 0;

			if( _currentState & DragBounds.LEFT ) {
				if( dist.x < _instance.bounds.x - itemX ) {
					dist.x = _instance.bounds.x - itemX;
				}
			}
			if( _currentState & DragBounds.RIGHT ) {
				if( dist.x > boundsMaxX - itemX - extraWidth ) {
					dist.x = boundsMaxX - itemX - extraWidth;
				}
			}
			if( _currentState & DragBounds.TOP ) {
				if( dist.y < _instance.bounds.y - itemY ) {
					dist.y = _instance.bounds.y - itemY;
				}
			}
			if( _currentState & DragBounds.BOT ) {
				if( dist.y > boundsMaxY - itemY - extraHeight ) {
					dist.y = boundsMaxY - itemY - extraHeight;
				}
			}
		}

		return dist;
	}

	_instance.easeUpdated = function() {
		_currentState = DragBounds.UNKNOWN;

		//Search and return farest away item x and y from the bounds;
		if( !_easeItemX ) {
			_easeItemX = findItemXEaseAndState();
		}
		if( !_easeItemY ) {
			_easeItemY = findItemYEaseAndState();
		}

		if( _easeItemX ) {
			moveEaseX( _easeItemX );
		}
		if( _easeItemY ) {
			moveEaseY( _easeItemY );
		}


		if( !_currentState ) {
			_currentState = DragBounds.INSIDE;
		}
		if( _instance.dispacthEvents ) {
			dispatchChange();
		}
	};

	function findItemXEaseAndState() {
		var l			= _instance.dragItems.length;

		var item		= null;

		var extraWidth	= 0;
		var nextX		= 0;
		var boundsMaxX	= _instance.bounds.x + _instance.bounds.width;

		var foundItem	= null;

		// console.log(l);

		//Prepare xItem and state;
		for( var i = 0; i < l; i++ ) {

			item = _instance.dragItems[i];

			extraWidth	= _instance.useItemsSize ? parseInt( item.style.width ) : 0;
			nextX		= getItemX( item ) + _instance.dragInfo.dist.x;

			if( nextX < _instance.bounds.x ) { //next position is outsite the Left side;
				//next position is outsite the Left side;
				if( _xBoundsStartEaseRatio == -1 )
					_xBoundsStartEaseRatio = _instance.easeInfo.easeRatio;

				//Set item farest to the Left;
				if( foundItem ) {
					if( getItemX( item ) < getItemX( foundItem ) ) {
						foundItem = item;
					}
				} else {
					foundItem = item;
				}

				//Set states;
				_currentState = _currentState | DragBounds.LEFT;
				_currentEaseState = _currentEaseState | DragBounds.LEFT;
			} else if( nextX + extraWidth > boundsMaxX ) { //next position is outsite the Right side;
				//next position is outsite the Left side;
				if( _xBoundsStartEaseRatio == -1 )
					_xBoundsStartEaseRatio = _instance.easeInfo.easeRatio;

				//Set item farest to the Right;
				if( foundItem ) {
					if( getItemX( item ) > getItemX( foundItem ) ) {
						foundItem = item;
					}
				} else {
					foundItem = item;
				}

				//Set states;
				_currentState = _currentState | DragBounds.RIGHT;
				_currentEaseState = _currentEaseState | DragBounds.RIGHT;
			}
		}
		return foundItem;
	}


	function findItemYEaseAndState() {
		var l			= _instance.dragItems.length;

		var item		= null;

		var extraHeight	= 0;
		var nextY		= 0;
		var boundsMaxY	= _instance.bounds.y + _instance.bounds.height;

		var foundItem	= null;

		//Prepare yItem and state;
		for( var i = 0; i < l; i++ ) {
			item = _instance.dragItems[i];

			//Take the items size in to account or not, depending on useItemsSize.
			extraHeight = _instance.useItemsSize ? parseInt( item.style.height ) : 0;
			nextY		= getItemY( item ) + _instance.dragInfo.dist.y;

			if( nextY < _instance.bounds.y ) { //next position is outsite the Top;
				//next position is outsite the Top;
				if( _yBoundsStartEaseRatio == -1 )
					_yBoundsStartEaseRatio = _instance.easeInfo.easeRatio;

				//Set item farest to the Left;
				if( foundItem ) {
					if( getItemY( item ) < getItemY( foundItem ) ) {
						foundItem = item;
					}
				} else {
					foundItem = item;
				}

				_currentState = _currentState | DragBounds.TOP;
				_currentEaseState = _currentEaseState | DragBounds.TOP;
			} else if( nextY + extraHeight > boundsMaxY ) { //next position is outsite the Bot;
				//next position is outsite the Top;
				if( _yBoundsStartEaseRatio == -1 )
					_yBoundsStartEaseRatio = _instance.easeInfo.easeRatio;

				//Set item farest to the Right;
				if( foundItem ) {
					if( getItemY( item ) > getItemY( foundItem ) ) {
						foundItem = item;
					}
				} else {
					foundItem = item;
				}

				_currentState = _currentState | DragBounds.BOT;
				_currentEaseState = _currentEaseState | DragBounds.BOT;
			}
		}

		return foundItem;
	}


	function moveEaseX( item ) {
		var extraWidth	;
		var boundRatio	;
		var toBounds	;
		var boundsMaxX	= _instance.bounds.x + _instance.bounds.width;

		if( item ) {
			extraWidth	= _instance.useItemsSize ? parseInt( item.style.width ) : 0;
		}

		if( _currentEaseState & DragBounds.LEFT ) {
			boundRatio = ratioFromRatio( _xBoundsStartEaseRatio, 1, _instance.easeInfo.easeRatio );
			//Add Ease to the BoundsRatio;
			boundRatio = _instance.easeEase.getRatio( boundRatio );

			toBounds = (_instance.bounds.x - getItemX( item ) );

			if( _outsideDistToBorder.x > 0 ) {
				boundRatio = 1 - boundRatio;
				_instance.dragInfo.dist.x = -_outsideDistToBorder.x;
				_instance.dragInfo.dist.x = toBounds + _instance.dragInfo.dist.x * boundRatio;
			} else {
				_instance.dragInfo.dist.x = toBounds + _instance.dragInfo.dist.x * _instance.easeDist * Math.sin( boundRatio * Math.PI );
			}
		} else if( _currentEaseState & DragBounds.RIGHT ) {
			boundRatio = ratioFromRatio( _xBoundsStartEaseRatio, 1, _instance.easeInfo.easeRatio );
			//Add Ease to the BoundsRatio;
			boundRatio = _instance.easeEase.getRatio( boundRatio );

			toBounds = ( boundsMaxX - getItemX( item ) - extraWidth );

			if( _outsideDistToBorder.x < 0 ) {
				boundRatio = 1 - boundRatio;
				_instance.dragInfo.dist.x = -_outsideDistToBorder.x;
				_instance.dragInfo.dist.x = toBounds + _instance.dragInfo.dist.x * boundRatio;
			} else {
				_instance.dragInfo.dist.x = toBounds + _instance.dragInfo.dist.x * _instance.easeDist * Math.sin( boundRatio * Math.PI );
			}

		}
	}

	function moveEaseY( item ) {
		var extraHeight	;
		var boundRatio	;
		var toBounds	;
		var boundsMaxY	= _instance.bounds.y + _instance.bounds.height;

		if( item ) {
			extraHeight = _instance.useItemsSize ? parseInt( item.style.height ) : 0;
		}

		if( _currentEaseState & DragBounds.TOP ) {
			boundRatio = ratioFromRatio( _yBoundsStartEaseRatio, 1, _instance.easeInfo.easeRatio );
			//Add Ease to the BoundsRatio;
			boundRatio = _instance.easeEase.getRatio( boundRatio );

			toBounds = (_instance.bounds.y - getItemY( item ) );

			if( _outsideDistToBorder.y > 0 ) {
				boundRatio = 1 - boundRatio;
				_instance.dragInfo.dist.y = -_outsideDistToBorder.y;
				_instance.dragInfo.dist.y = toBounds + _instance.dragInfo.dist.y * boundRatio;
			} else {
				_instance.dragInfo.dist.y = toBounds + _instance.dragInfo.dist.y * _instance.easeDist * Math.sin( boundRatio * Math.PI );
			}
		}
		else if( _currentEaseState & DragBounds.BOT ) {
			boundRatio = ratioFromRatio( _yBoundsStartEaseRatio, 1, _instance.easeInfo.easeRatio );
			//Add Ease to the BoundsRatio;
			boundRatio = _instance.easeEase.getRatio( boundRatio );

			toBounds = (boundsMaxY - getItemY( item ) - extraHeight);

			if( _outsideDistToBorder.y < 0 ) {
				boundRatio = 1 - boundRatio;
				_instance.dragInfo.dist.y = -_outsideDistToBorder.y;
				_instance.dragInfo.dist.y = toBounds + _instance.dragInfo.dist.y * boundRatio;
			} else {
				_instance.dragInfo.dist.y = toBounds + _instance.dragInfo.dist.y * _instance.easeDist * Math.sin( boundRatio * Math.PI );
			}
		}
	}

	_instance.easeEnded = function() {
		_xBoundsStartEaseRatio = -1;
		_yBoundsStartEaseRatio = -1;
		_currentState = DragBounds.INSIDE;
	};

	function ratioFromRatio ( start, end, ratio ) {
		var diff = 1 / ( end - start );
		var newRatio = diff * ratio;
		newRatio -= start * diff;
		return newRatio;
	}

	/*
	* NORMAL DRAG;
	*/

	_instance.dragStarted = function() {
		if( _instance.boundsEase ) {
			_instance.killTweens();
		}
	};

	_instance.dragMove = function() {
		var l			= _instance.dragItems.length;
		var item		;

		var nextX		= 0;
		var nextY		= 0;

		var extraWidth	= 0;
		var extraHeight	= 0;

		var boundsMaxX	= _instance.bounds.x + _instance.bounds.width;
		var boundsMaxY	= _instance.bounds.y + _instance.bounds.height;

		_currentState = DragBounds.UNKNOWN;

		for( var i = 0; i < l; i++ ) {
			item		= _instance.dragItems[ i ];
			var itemX	= getItemX( item );
			var itemY	= getItemY( item );

			nextX		= itemX + _instance.dragInfo.dist.x;
			nextY		= itemY + _instance.dragInfo.dist.y;

			//Take the items size in to account or not, depending on useItemsSize.
			extraWidth	= _instance.useItemsSize ? parseInt(item.style.width) : 0;
			extraHeight = _instance.useItemsSize ? parseInt(item.style.height) : 0;

			if( nextX < _instance.bounds.x ) {
				//next position is outsite the Left side;

				//Slow down the drag if ease is set;
				if( _instance.boundsEase ) {
					_instance.dragInfo.dist.x *= _instance.boundsEase;
				} else {
					_instance.dragInfo.dist.x = _instance.bounds.x - itemX;
				}
				_currentState = _currentState | DragBounds.LEFT;
			} else if( nextX + extraWidth > boundsMaxX ) {
				//next position is outsite the Right side;

				//Slow down the drag if ease is set;
				if( _instance.boundsEase ) {
					_instance.dragInfo.dist.x *= _instance.boundsEase;
				} else {
					_instance.dragInfo.dist.x = boundsMaxX - itemX - extraWidth;
				}

				_currentState = _currentState | DragBounds.RIGHT;
			}

			if( nextY < _instance.bounds.y ) {
				//next position is outsite the Top;

				//Slow down the drag if ease is set;
				if( _instance.boundsEase ) {
					_instance.dragInfo.dist.y *= _instance.boundsEase;
				} else {
					_instance.dragInfo.dist.y = _instance.bounds.y - itemY;
				}

				_currentState = _currentState | DragBounds.TOP;
			} else if( nextY + extraHeight > boundsMaxY ) {
				//next position is outsite the Bot;

				//Slow down the drag if ease is set;
				if( _instance.boundsEase ) {
					_instance.dragInfo.dist.y *= _instance.boundsEase;
				} else {
					_instance.dragInfo.dist.y = boundsMaxY - itemY - extraHeight;
				}

				_currentState = _currentState | DragBounds.BOT;
			}
		}

		if( !_currentState ) {
			_currentState = DragBounds.INSIDE;
		}

		if( _instance.dispacthEvents ) {
			dispatchChange();
		}

		// console.log( _instance.dragInfo.dist );

	};

	var _lastState = 0;

	function dispatchChange() {
		var event = "";

		// trace("DISPATCH CHANGES");

		if( !(_lastState & DragBounds.INSIDE) && _currentState & DragBounds.INSIDE ) {
			event = DragBounds.STATE_INSIDE;
		} else if( !(_lastState & DragBounds.LEFT) && _currentState & DragBounds.LEFT ) {
			event = DragBounds.STATE_OUTSIDE_LEFT;
		} else if( !(_lastState & DragBounds.RIGHT) && _currentState & DragBounds.RIGHT ) {
			event = DragBounds.STATE_OUTSIDE_RIGHT;
		} else if( !(_lastState & DragBounds.TOP) && _currentState & DragBounds.TOP ) {
			event = DragBounds.STATE_OUTSIDE_TOP;
		} else if( !(_lastState & DragBounds.BOT) && _currentState & DragBounds.BOT ) {
			event = DragBounds.STATE_OUTSIDE_BOT;
		}

		_lastState = _currentState;

		if( !event ){
			return;
		}

		if( _instance.dispatchOnObjects ) {
			var l			= _instance.dragItems.length;
			for( var i = 0; i < l; i++ )
				_instance.dragItems[ i ].dispatchEvent( event );
		} else {
			_instance.dispatchEvent( event );
		}

	}
	
	function getItemX( item ){
		if( _instance.use3DTransform ){
			return item.aniGetX();
		}else{
			return parseFloat( item.style.left );	
		}
	}
	
	function getItemY( item ){
		if( _instance.use3DTransform ){
			return item.aniGetY();	
		}else{
			return parseFloat( item.style.top );	
		}
	}

	_instance.init( bounds );

	return _instance;

}

