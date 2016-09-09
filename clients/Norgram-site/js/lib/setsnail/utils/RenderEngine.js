( function( ) {
	var lastTime = 0;
	var vendors = [ 'ms', 'moz', 'webkit', 'o' ];
	for( var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x ) {
		window.requestAnimationFrame = window[ vendors[ x ] + 'RequestAnimationFrame' ];
		window.cancelRequestAnimationFrame = window[ vendors[ x ] + 'CancelRequestAnimationFrame' ];
	}

	if( !window.requestAnimationFrame )
		window.requestAnimationFrame = function( callback, element ) {
			var currTime = new Date( ).getTime( );
			var timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) );
			var id = window.setTimeout( function( ) {
				callback( currTime + timeToCall );
			}, timeToCall );
			lastTime = currTime + timeToCall;
			return id;
		};

	if( !window.cancelAnimationFrame )
		window.cancelAnimationFrame = function( id ) {
			clearTimeout( id );
		};
}() );

function RenderEngine( fps ) {

	//Default to 60 fps;
	var FPS					= fps ? fps : 1000 / 60;

	var _instance			= {};
	var _listeners			= [ ];
	var _renderId			= -1;

	_instance.startRender = function( ) {
		if( _instance.isRunning() ){
			return;
		}
		_renderId = window.setInterval( function( ) {
			window.requestAnimationFrame( renderLoop );
		}, FPS );
	};

	_instance.stopRender = function( ) {
		if( _renderId == -1 )
			return;

		window.clearTimeout( _renderId );
		_renderId = -1;
	};

	_instance.isRunning = function(){ return _renderId != -1; };

	_instance.addListener = function( callback ) {
		_listeners.push( callback );
	};

	_instance.removeListener = function( callback ) {
		var index = _listeners.indexOf( callback );

		if( index != -1 ) {
			_listeners.splice( index, 1 );
		}
	};

	function renderLoop( ) {
		var l = _listeners.length;

		for( var i = 0; i < l; i++ ) {
			_listeners[i]( );
		}
	}

	return _instance;
}
