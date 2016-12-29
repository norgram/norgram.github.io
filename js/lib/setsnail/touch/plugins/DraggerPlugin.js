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
 * Used to sort a vector on Priorities;
 */
DraggerPlugin.pluginSortRules = function( a, b ) {
	var aPrio = a.priority;
	var bPrio = b.priority;

	if( aPrio < bPrio ) {
		return -1;
	} else if( aPrio > bPrio ) {
		return 1;
	}
	return 0;
};

function DraggerPlugin() {

	var _instance = new EventDispatcher();

	//Callbacks to DragGroup
	var _forceUpdateDist;
	var _forceUpdatePlugins;
	var _forceUpdateMove;
	var _forceUpdateEnded;

	var _isEnabled = true;

	_instance.dragItems = [];
	_instance.dragInfo = null;

	_instance.priority = 0;
	
	_instance.use3DTransform = false;

	_instance.addDragItems = function( dragItems ) {
		//Re-add to keep containers seperated; Adds the posibility to remove from individuel DraggerPlugins;
		var l = dragItems.length;
		for( var i = 0; i < l; i++ ){
			this.dragItems.push( dragItems[ i ] );
		}
	};

	_instance.addDragItem = function( dragItem ) {
		dragItems.push( dragItem );
	};

	_instance.removeDragItem = function( dragItem ) {
		var index = dragItems.indexOf( dragItem );
		if( index != -1 ){
			dragItems.splice( index, 1 );
		}
	};

	_instance.setDragInfo = function( dragInfo ) {
		// console.log(dragInfo);
		_instance.dragInfo = dragInfo;
	};

	_instance.onForcedUpdateDist = function( callback ) { _forceUpdateDist = callback; };

	_instance.onForcedUpdatePlugins = function( callback ) { _forceUpdatePlugins = callback; };

	_instance.onForcedUpdateMove = function( callback ) { _forceUpdateMove = callback; };

	_instance.onForceEnded = function( callback ) { _forceUpdateEnded = callback; };

	_instance.forceDragEnded = function() {
		if( _forceUpdateEnded !== null ){
			_forceUpdateEnded();
		}
	};

	_instance.forceUpdatePlugins = function() {
		if( _forceUpdatePlugins !== null ){
			_forceUpdatePlugins();
		}
	};

	_instance.forceUpdateMove = function() {
		if( _forceUpdateMove !== null ){
			_forceUpdateMove();
		}
	};

	_instance.forceUpdateDist = function( xDist, yDist ) {
		if( _forceUpdateDist !== null ){
			_forceUpdateDist( xDist, yDist );
		}
	};

	/**Disable the plugin*/
	_instance.disable = function() { _isEnabled = false; };

	/**Enables the plugin*/
	_instance.enable = function() { _isEnabled = true; };

	/**Boolean for if plugin is enabled*/
	_instance.isEnabled = function() {
		return _isEnabled;
	};

	_instance.dragStarted = function() { /*OVERRIDE THIS FUNCTION TO MANIPULATE;*/ };

	_instance.dragMove = function() { /*OVERRIDE THIS FUNCTION TO MANIPULATE;*/ };

	_instance.dragEnded = function() { /*OVERRIDE THIS FUNCTION TO MANIPULATE;*/ };

	/**
	 * Kills all tweens on all dragItems in group
	 */
	_instance.killTweens = function() {
		var l = _instance.dragItems.length;
		for( var i = 0; i < l; i++ ){
			TweenMax.killTweensOf( _instance.dragItems[ i ] );
		}
	};

	return _instance;
}
