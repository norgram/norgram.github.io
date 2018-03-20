function CaseVideoModule( data ) {
    
    var _instance = Snail.extend(new Module());
    _instance.style.backgroundColor = "#fff";
    var _video;
    var _width, _height;

    var _origW, _origH;

    var _mode;

    var _isPlaying = false;

    _instance.init = function() {
        _origW = data.getAttribute( "width" );
        _origH = data.getAttribute( "height" );

        addVideo();
    };

    _instance.resize_desktop = function(width, height) {
        _width = width;
        _height = height;

        resizeVideo();
    };

    _instance.getWidth = function() {
        var scale = _height / _origH;
        return Math.floor(_origW * scale);
    };

    _instance.visibilityRatio = function( ratio ) {
        if(_mode == "AUTOPLAY_ON_SCREEN") {
            if(!_isPlaying) {
                if( ratio > 0.5 && ratio < 1.5 ) {
                    _video.play();
                    _isPlaying = true;
                }
            } else {
                if( ratio < 0.5 || ratio > 1.5 ) {
                    _video.pause();
                    _isPlaying = false;
                }
            }
        }
	};

    function addVideo() {
        var vidUrl = ContentManager.getChildByAttr( data, "name", "source" ).innerHTML;
        var coverImg = ContentManager.getChildByAttr( data, "name", "coverImage" ).innerHTML;

        _mode = ContentManager.getChildByAttr( data, "name", "mode" ).innerHTML;
        if(_mode == null) { _mode = "MANUEL"; }

        _video = new VideoPlayer( vidUrl, coverImg );
        _video.init(_mode);
        _video.setScaleMode( "INSIDE" );
        _video.enableLoop();
        if(_mode != "MANUEL") {
            _video.enableClickToPauseAndPlay();
        }

        if(_mode == "AUTOPLAY"){
            _video.play();
        }
        _instance.appendChild(_video);
    }

    function onImgLoaded() {
        resizeVideo();
        _instance.callbackReposition();
    }

    function resizeVideo() {
        // console.log(_origH);
        var scale = _height / _origH;
        _video.setSize( _origW * scale, _height );
        // TweenMax.set( _video, {width:_origW * scale, height:_height} );
    }

    return _instance;
}