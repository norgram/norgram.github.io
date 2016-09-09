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

DragSnap.DOWN		= 2;
DragSnap.UP			= 4;
DragSnap.MOVE		= 8;

function DragSnap( xMod, yMod, snapOn ) {

	var _instance				= new DraggerEasePlugin();

	_instance.offset			= { x:0, y:0 };
	_instance.fromCenterX		= true;
	_instance.fromCenterY		= true;
	_instance.xMod				= 1;
	_instance.yMod				= 1;

	var _snapOn					= 0;



	_instance.init = function( xMod, yMod, snapOn ) {
		_instance.xMod = xMod;
		_instance.yMod = yMod;
		_snapOn = snapOn ? snapUp : DragSnap.MOVE;
	};

	function snap() {

	}


	function easeSnap() {
		var l		= _instance.dragItems.length;
		var xPos	;
		var yPos	;
		var xOffset	;
		var yOffset	;

		var centerX	= _instance.fromCenterX ? _instance.xMod * 0.5 : 0;
		var centerY	= _instance.fromCenterY ? _instance.yMod * 0.5 : 0;

		for( var i = 0; i < l; i++ ) {
			xOffset = ( parseFloat( _instance.dragItems[ i ].style.left ) - centerX ) % _instance.xMod;
			yOffset = ( parseFloat(_instance.dragItems[ i ].style.top) - centerY ) % _instance.yMod;

			if( xOffset < 0 ) {
				xOffset += _instance.xMod;
			}
			if( yOffset < 0 ) {
				yOffset += _instance.yMod;
			}

			xPos = parseFloat( _instance.dragItems[ i ].style.left ) + centerX - xOffset + _instance.offset.x;
			yPos = parseFloat( _instance.dragItems[ i ].style.top ) + centerY - yOffset + _instance.offset.y;

			TweenMax.to( _instance.dragItems[ i ], 0.5, { x:xPos, y:yPos, ease:Expo.easeOut } );
		}
	}


	_instance.easeStarted = function() {

		/**
		 *
		 * WORK IN PROGRESS
		 *
		 */

//			var endX:Number = dragItems[0].x + easeInfo.easeDistance.x;
//			var endY:Number = dragItems[0].y + easeInfo.easeDistance.y;
//
//			var centerX	:Number 	= fromCenterX ? xMod * .5 : 0;
//			var centerY	:Number 	= fromCenterY ? yMod * .5 : 0;
//
//			var offsetX	:Number 	= (endX - centerX) % xMod;
//			var offsetY	:Number 	= (endY - centerY) % yMod;
//
//			if( offsetX < 0 ) {
//				offsetX += xMod;
//			}
//			if( offsetY < 0 ) {
//				offsetY += yMod;
//			}

//			trace( "OFFSET = " + offsetX, offsetY );

//			trace(easeInfo.easeDistance);

//			easeInfo.easeDistance.x -= offsetX;
//			easeInfo.easeDistance.y -= offsetY;

//			easeInfo.easeDistance.setTo(
//					0, 0
//				);
//			trace("Ease started");
	};

	_instance.easeUpdated = function() {
//			trace("Ease Updated");
	};

	_instance.easeEnded = function() {
//			trace("Ease Ended");
	};

	_instance.dragStarted = function() {
		_instance.killTweens();
		if( _snapOn & DragSnap.DOWN ) {
			snap();
		}
	};

	_instance.dragMove = function() {
		if( _snapOn & DragSnap.MOVE ) {
			easeSnap();
		}
	};

	_instance.dragEnded = function() {
		if( _snapOn & DragSnap.UP ) {
			easeSnap();
		}
	};

	_instance.init( xMod, yMod, snapOn );

	return _instance;
}
