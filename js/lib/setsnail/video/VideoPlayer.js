function VideoPlayer( src, coverImage ) {

    var _instance = document.createElement("div");
    _instance.style.position = "absolute";
    _instance.style.overflow = "hidden";

    var _video;
    var _coverImage;
    var _playIcon;

    var _width = 0;
    var _height = 0;

    var _metaWidth = 0;
    var _metaHeight = 0;

    var _mode;

    var _videoX = 0;

    var _isPlaying = false;

    var _isVideoReady = false;
    var _isCoverLoaded = false;
    var _isCovering = true;

    var _scaleMode = "DEFAULT";

    var _isMuted = false;

    var _maskContainer;

    _instance.init = function( mode ) {
        _video = document.createElement("video");
        _video.style.position = "absolute";
        
        if( mode != "MANUEL" ) {
            if(
                BrowserDetect.isSafari() 
                || BrowserDetect.MOBILE
            ) {
                console.log("SAFARI ON MOBILE");
                //Safari only autoplays if muted;
                _video.setAttribute("muted", "");
                _video.setAttribute("autoplay", "");
                _video.setAttribute("playsinline", "");
                // _instance.mute();
            }
        }

        var vidSource = document.createElement("source");
        vidSource.setAttribute("src", src);
        vidSource.setAttribute("type", "video/mp4");

        _video.addEventListener( 'loadeddata', onVideoReady, false );
        _video.addEventListener( "loadedmetadata", onMetaLoaded, false );
        _video.style.display = "none";

        _video.appendChild(vidSource);
        _instance.appendChild(_video);

        _video.style.zIndex = -1;

        if(coverImage != null) {
            addCoverImage();
        } else {
            _coverImage = new SlidePreloader();
            _instance.appendChild( _coverImage );
            _coverImage.onEaseComplete = onCoverLoaded;

            setTimeout( function() {
                _coverImage.setProgress( 100 );
            }, 10);
        }

        // console.log("sdfsdfljhsldjf");


        _playIcon = new RetinaImage( "assets/images/logo/play_icon.png", Assets.RETINA_HANDLE );
        _playIcon.init();
        _playIcon.style.display = "none";
        TweenMax.set( _playIcon, {x:SiteGuides.OFFSET_TOP, y:-100} );
        _instance.appendChild(_playIcon);

        _instance.setMode(mode);
    };

    _instance.setMode = function( mode ) {
        _mode = mode;
        updateToMode();
    };

    //INSIDE, OUTSIDE, 
    _instance.setScaleMode = function( mode ) {
        _scaleMode = mode;
        updateToScaleMode();
    };

    _instance.enableClickToPauseAndPlay = function() {
        Touchable.listen(_instance, { onClick:_instance.toggle });
    };

    _instance.toggle = function() {
        if( _isPlaying ) {
            _instance.pause();
        } else {
            _instance.play();
        }
    };

    function updateToScaleMode() {
        if( _metaWidth != 0 && _metaHeight != 0  ) {
            if( _scaleMode == "INSIDE" || _scaleMode == "OUTSIDE" ) {
                var mask = getMask();
                TweenMax.set( mask, {width:_width, height:_height} );

                var scaleX = _width / _metaWidth;
                var scaleY = _height / _metaHeight;
                var scale;
                if( _scaleMode == "OUTSIDE") {
                    scale = Math.max( scaleX, scaleY );
                }else {
                    scale = Math.min( scaleX, scaleY );
                }

                var offsetX = (_width - Math.ceil(_metaWidth * scale)) * 0.5;
                var offsetY = (_height - _metaHeight * scale) * 0.5;

                // _videoX = offsetX;
                // console.log(offsetX);

                TweenMax.set( _video, { x:offsetX, y:offsetY, width:_metaWidth * scale, height:_metaHeight * scale } );

            }
        }
    }

    function onMetaLoaded() {
        _metaWidth = this.videoWidth;
        _metaHeight = this.videoHeight;
        updateToScaleMode();
    }

    function getMask() {
        if(_maskContainer != null) {
            return _maskContainer;
        }
        _maskContainer = document.createElement("div");
        _maskContainer.style.position = "absolute";
        _maskContainer.style.overflow = "hidden";
        _maskContainer.appendChild( _video );
        _instance.appendChild(_maskContainer);
        _instance.appendChild(_playIcon);
        return _maskContainer;
    }

    function updateToMode() {
        // hideCover();
        if( _mode == null  ) { return; }
        if( _instance.isReadyToPlay() ) {
            if( _mode != "MANUEL" ) {
                if(_isPlaying){
                    // console.log("PLAY");
                    _video.play();
                }
                hideCover();
            } else {
                showPlayButton();
                Touchable.listen( _instance, {onClick:onVideoClick} );
                _instance.style.cursor = "pointer";
            }
        } else {
            // TweenMax.set( _video, {x:0 - _videoX} );
            _isCovering = true;
        }
    }

    function showPlayButton() {
        _playIcon.style.display = "inline";
        TweenMax.to( _playIcon, 0.6, { x:SiteGuides.OFFSET_TOP, y:SiteGuides.OFFSET_TOP, ease:Expo.easeOut } );
    }

    function hidePlayButton() {
        TweenMax.to( _playIcon, 0.6, { x:SiteGuides.OFFSET_TOP, y:-100, onComplete: function() {
            _playIcon.style.display = "none";
        }, ease:Expo.easeOut } );
    }

    function onVideoClick() {
        if(_isPlaying) {
            _instance.pause();
            showPlayButton();
        } else {
            if( _isCovering ) {
                hideCover();
            }
            hidePlayButton();
            _instance.play();
        }
    }

    function hideCover() {
        if(_coverImage == null) { 
            return;
        }


        // TweenMax.to( _video, 1, {x:_videoX, ease:Expo.easeInOut} );

        TweenMax.to( _coverImage, 0.6, { alpha:0, onComplete:function() {
                hidePlayButton();
            } });

        // TweenMax.to( _coverImage, 1, {x:-_width, onComplete:function() {
        //     hidePlayButton();
        // }, ease:Expo.easeInOut} );
        _isCovering = false;
    }

    function addCoverImage() {
        _coverImage = new RetinaImage(coverImage);
        _coverImage.onPreloaderAnimationDone = onCoverLoaded;
        _coverImage.setPreloader( new SlidePreloader() );
        _coverImage.init();

        _instance.appendChild(_coverImage);
    }

    function onCoverLoaded() {
        // console.log( "ON COVER LOADED" );
        _isCoverLoaded = true;
        updateToMode();
    }

    function onVideoReady() {
        // console.log( "ON VIDEO LOADED" );
        _video.removeEventListener('loadeddata', onVideoReady, false);
        _isVideoReady = true;
        updateToMode();
        _video.style.display = "inline";
    }

    _instance.isReadyToPlay = function() {
        return _isVideoReady && _isCoverLoaded;
    };

    _instance.mute = function() {
        if(_isMuted) {
            return;
        }

        if(_mode != null && _mode != "MANUEL" && BrowserDetect.isSafari() || BrowserDetect.MOBILE) {
            return;
        }

        TweenMax.to(_video, 0.3, {volume:0});
        _isMuted = true;
    };
    
    _instance.unmute = function() {
        if( !_isMuted ) {
            return;
        }

        if(_mode != null && _mode != "MANUEL" && BrowserDetect.isSafari() || BrowserDetect.MOBILE) {
            return;
        }

        TweenMax.to(_video, 0.3, {volume:1});
        _isMuted = false;
    };

    _instance.play = function() {
        // console.log("PLAY");
        if(_instance.isReadyToPlay()) {
            _isPlaying = true;
            _video.play();
        } else {
            _isPlaying = true;
            // _video.setAttribute( "autoplay", "" );
        }
    };

    _instance.pause = function() {
        // console.log("PAUSE");
        _isPlaying = false;
        _video.pause();
    };

    _instance.setSize = function( width, height ) {
        _width = Math.ceil(width);
        _height = height;
        if(_coverImage != null) {
            _coverImage.setSize( _width + 1, _height );
        }

        // if(_coverImage != null && !_instance.isReadyToPlay()) {
        //     TweenMax.set( _video, {width:width, height:height} );   
        // }

        TweenMax.set( _instance, {width:width, height:height} );
        TweenMax.set( _video, {width:width, height:height} );

        updateToScaleMode();
    };

    _instance.enableLoop = function() {
        _video.setAttribute( "loop", "" );
    };

    _instance.disableLoop = function() {
        _video.removeAttribute("loop");
    };

    return _instance;
}