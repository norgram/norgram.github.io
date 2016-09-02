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


function DragEase() {

	var _instance						= new DraggerEasePlugin();

	/**The time it takes foro the ease to finish*/
	_instance.time						= 2;
	/**How fare compared to DragAmount the drag will travel after release*/
	_instance.distance					= 1;
	/**The ease used to compute the travel*/
	_instance.ease						= Expo.easeOut;

	var _easeDist						= {x:0, y:0};

	var _easePlugins					= [];
	var _lastDist						= {x:0, y:0};
	var _renderVars						= new RenderVars();
	var _lastDistResetter				;

	//Needs to be the last plugin;
	_instance.priority					= 10000;


	var _onStart = null;
	var _onMove = null;
	var _onEnd = null;

	_instance.onEnd = function( callback ) {
		_onEnd = callback;
	};

	_instance.onMove = function( callback ) {
		_onMove = callback;
	};

	_instance.onStart = function( callback ) {
		_onStart = callback;
	};

	_instance.setEasePlugins = function( plugins ) {
		_easePlugins = plugins;
	};

	_instance.easeStarted = function() {
		//Update ease;
		_renderVars.ease = _instance.ease;
	};

	_instance.easeUpdated = function() {
		var l		= _instance.dragItems.length;
		var item	= null;

		for( var i = 0; i < l; i++ ) {
			item = _instance.dragItems[ i ];
			if( _instance.use3DTransform === true ){
				item.aniSetY( item.aniGetY() + _instance.dragInfo.dist.y );
				item.aniSetX( item.aniGetX() + _instance.dragInfo.dist.x );// = ( parseFloat( item.style.left ) + _instance.dragInfo.dist.x ) + "px";
				item.aniRender();
				// item.style.top = ( parseFloat( item.style.top ) + _instance.dragInfo.dist.y ) + "px";
			}else{
				item.style.left = ( parseFloat( item.style.left ) + _instance.dragInfo.dist.x ) + "px";
				item.style.top = ( parseFloat( item.style.top ) + _instance.dragInfo.dist.y ) + "px";
			}
		}
	};

	_instance.easeEnded = function() {
		_instance.easeUpdated();
	};

	_instance.dragStarted = function() {
		_instance.stop();

		if(_onStart !== null){
			_onStart();
		}

	};

	_instance.dragMove = function() {
		// _lastDist.setTo( dragInfo.dist.x, dragInfo.dist.y );
		_lastDist.x = _instance.dragInfo.dist.x;
		_lastDist.y = _instance.dragInfo.dist.y;
		clearTimeout( _lastDistResetter );
		_lastDistResetter = setTimeout( resetLastDist, 100 );



		if(_onMove !== null){
			_onMove();
		}
	};

	function resetLastDist() {
		_lastDist.x = _lastDist.y = 0;
	}

	_instance.dragEnded = function() {
		_instance.killTweens();

		_instance.easeInfo.easeDistance = {x:_lastDist.x, y:_lastDist.y};
		_instance.easeInfo.easeDistance.x *= _instance.distance;
		_instance.easeInfo.easeDistance.y *= _instance.distance;

		var l = _easePlugins.length;
		for( var i = 0; i < l; i++ ){
			_easePlugins[ i ].easeStarted();
		}

		// console.log("DRAG ENDED");

		_renderVars.ratio = 0;
		TweenMax.to( _renderVars, _instance.time, { ratio:1, onUpdate:renderEase, onComplete:completeEase, ease:Linear.easeNone } );
	};

	_instance.stop = function() {
		TweenMax.killTweensOf( _renderVars );
		completeEase();
	};

	function renderEase() {
		_renderVars.renderEase();
		_instance.easeInfo.easeRatio = _renderVars.easeRatio;
		_instance.easeInfo.linearEaseRatio = _renderVars.ratio;

		var reversedRatio = 1 - _renderVars.easeRatio;

		_instance.dragInfo.dist.x = _instance.easeInfo.easeDistance.x * reversedRatio;
		_instance.dragInfo.dist.y = _instance.easeInfo.easeDistance.y * reversedRatio;

		updateEase();
	}

	function completeEase() {
		var l = _easePlugins.length;
		for( var i = 0; i < l; i++ ){
			_easePlugins[ i ].easeEnded();
		}

		if(_onEnd !== null){
			_onEnd();
		}

	}

	function updateEase() {
		var l = _easePlugins.length;
		for( var i = 0; i < l; i++ ){
			_easePlugins[ i ].easeUpdated();
		}

		if(_onMove !== null){
			_onMove();
		}

	}

	return _instance;
}


function RenderVars() {

	var _instance				= {};

	_instance.lastEaseRatio		= 0;
	_instance.ease				= Linear.easeNone;

	_instance.ratio				= 0;
	_instance.easeRatio			= 0;

	_instance.renderEase = function(){
		lastEaseRatio = _instance.easeRatio;
		_instance.easeRatio = _instance.ease.getRatio( _instance.ratio );
	};

	return _instance;
}

