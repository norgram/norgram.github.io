function ImageSliceThree( leftUrl, centerUrl, rightUrl, retinaHandler, width ) {

	var _instance = document.createElement( "div" );
	_instance.style.position = "absolute";
	_instance.imgBaseUrl = "";

	var _left, _center, _right;
	var _numOfLoadedImages = 0;
	var _allLoaded = false;
	var _onLoaded;

	var _width = width ? width : 0;
	var _height = 0;

	_instance.init = function( ) {
		_left = new RetinaImage( _instance.imgBaseUrl + leftUrl, retinaHandler, onLoaded, onError );
		_center = new RetinaImage( _instance.imgBaseUrl + centerUrl, retinaHandler, onLoaded, onError );
		_right = new RetinaImage( _instance.imgBaseUrl + rightUrl, retinaHandler, onLoaded	, onError );

		_instance.appendChild( _left );
		_instance.appendChild( _center );
		_instance.appendChild( _right );

		_left.init( );
		_center.init( );
		_right.init( );
	};

	_instance.enableTileing = function( ) {
		//TODO enable slice 3 tiling of the center part, If needed;
	};

	_instance.onLoaded = function( callback ) {
		_onLoaded = callback;
	};

	function onLoaded( ) {
		_numOfLoadedImages++;

		if( _numOfLoadedImages == 3 ) {
			_instance.allImagesLoaded( );
		}
	};

	function onError( ) {
		trace( "ERROR: Slice3 image not loaded. Why you ask...? Ask Kasper, he didnt return any description to the Error. :(" );
	};

	_instance.allImagesLoaded = function( ) {
		_allLoaded = true;

		_width = _width ? _width : ( _left.getWidth( ) + _center.getWidth( ) + _right.getWidth( ) );
		_height = Math.max( _left.getHeight( ), _center.getHeight( ), _right.getHeight( ) );
		
		updateSize( );

		if( _onLoaded ) {
			_onLoaded( );
		}
	};

	_instance.getWidth = function( ) {
		return _width;
	};
	_instance.getHeight = function( ) {
		return _height
	};

	_instance.setWidth = function( value ) {
		_width = value;
		if( _allLoaded ) {
			updateSize( );
		}
	};

	function updateSize( ) {
		if( _width === 0 ) {
			return;
		}

		const leftW = _left.getWidth( );
		var centerW = _width - leftW - _right.getWidth( );
		_center.style.left = _left.getWidth( ) + "px";
		_center.setWidth( centerW );
		_right.style.left = centerW + _left.getWidth( ) + "px";
	}

	return _instance;
}
