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

function DragScroll( scrollElement ){

	var _instance						= new DraggerEasePlugin();

	var _currentScrollY = 0;
	var _fromSetScroll = false;

	window.onscroll = onPageScroll;

	/**
	* EASE DRAG
	*/

	function onPageScroll( e ){
		if( getAbsolutePosition( scrollElement ).y != Math.round(_currentScrollY) ){
			// console.log("USER SCROLL");
			// easePlugin.stop();

			// _instance.dragInfo.dist.y = -(_currentScrollY - getAbsolutePosition( scrollElement ).y);
			// _currentScrollY = getAbsolutePosition( scrollElement ).y;

			// _instance.killTweens();

		}else{
			// console.log("EaseScroll");

		}

		// _instance.killTweens();
	}


	_instance.easeStarted = function() {

	};

	_instance.easeUpdated = function() {
		_currentScrollY += _instance.dragInfo.dist.y;
		updateScroll();
	};

	_instance.easeEnded = function() {

	};



	/*
	* NORMAL DRAG;
	*/

	_instance.dragStarted = function() {

	};

	_instance.dragMove = function() {
		_currentScrollY += _instance.dragInfo.dist.y;
		updateScroll();
	};

	_instance.dragEnded = function(){

	};

	function updateScroll(){
		// _fromSetScroll = true;
		// window.pageYOffset = _currentScrollY + "px";
		window.scrollBy(0, -_instance.dragInfo.dist.y);
		// window.scrollTo(0, _currentScrollY * -1);
		// _fromSetScroll = false;
	}

	function getAbsolutePosition(target) {
		// trace("getAbsolutePosition();");
		var x		= 0;
		var y		= 0;

		while(target) {
			x += target.offsetLeft ? target.offsetLeft : 0;
			y += target.offsetTop ? target.offsetTop : 0;

			y -= target.scrollTop ? target.scrollTop : 0;
			x -= target.scrollLeft ? target.scrollLeft : 0;

			if(target && target.style && target.style.position === "fixed") {
				break;
			}

			// trace("target.offsetTop : " + target.offsetTop);
			target = target.parentNode !== null ? target.parentNode : null;
		}

		return {x: x, y: y};
	}


	return _instance;
}

