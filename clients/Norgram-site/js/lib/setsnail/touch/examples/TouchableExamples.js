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

function TouchableExamples() {

	var _instance = document.createElement( "div" );

	_instance.init = function(){
		singleTouch();

		//TODO Test and explain JS MultiTouch;
		// multiTouch();
	};

	function singleTouch() {
		var gfx = document.createElement( "div" );// new Quad( 50, 50, 0xFF0000 );
		gfx.style.position = "absolute";
		gfx.style.width = 100 + "px";
		gfx.style.height = 100 + "px";
		gfx.style.top = 200 + "px";
		gfx.style.left = 200 + "px";
		gfx.style.backgroundColor = "#FF0000";
		gfx.id = "GFX";
		_instance.appendChild( gfx );

		var touch = new Touchable( gfx );
		/**Used for Buttons, calls back onClick undepended of hold time or drag distance. As long as the finger is within the DisplayObjects bounds**/
		touch.clickWithinBounds = false;
		/**Callback click only within hold time, else callback hold;**/
		touch.clickOrHold = false;
		/**Callback only onClick or onUp. Never both at the same time;**/
		touch.clickOrUp = true;


		touch.onDown( function() {
			// console.log( "DOWN" );
		} );

		touch.onUp( function() {
			// console.log( "UP" );
		} );

		touch.onClick( function() {
			// console.log( "Click" );
		});

		touch.onMove(function(){
			// console.log( "MOVE" );
		});

		touch.onOver( function(){
			// console.log("OVER");
		} );

		touch.onOut(function(){
			// console.log("OUT");
		});

		touch.onHold(function(){
			// console.log("HOLD");
		});

	}

	function multiTouch() {
		//TODO Test and explain JS MultiTouch;
	}

	return _instance;
}
