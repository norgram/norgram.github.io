function CaseOverviewModule() {

	var _instance = Snail.extend(new Module());
    _instance.style.backgroundColor = UIColors.WHITE;

    var _width = 0;

    var _numOfCases = 2;

    var _casesData = [];
    var _cases = [];

    var _line;

	_instance.init = function() {
        var projects = ContentManager.getChildByAttr(Assets.CONTENT_PAGES, "path", "projects");
        var l = projects.children.length;

        for( var i = 0; i < l; i++ ) {
            if(projects.children[i].getAttribute( "data-path" ) != null ) {
                var casePath = "#/projects/" + projects.children[i].getAttribute( "data-path" ) + "/";
                if(casePath !== window.location.hash ) {
                    _casesData.push( projects.children[i] );
                }
            }
        }
        
        addCases();
        addLine();
	};

    function addLine() {
		_line = document.createElement("div");
		_line.style.position = "absolute";
		_line.style.backgroundColor = UIColors.LINE_ON_WHITE;//UIColors.LINE_ON_WHITE;

		_instance.appendChild(_line);
	};

	_instance.resize_desktop = function( width, height ) {
        _width = Math.floor(height * 0.7);
        TweenMax.set( _instance, {width:_width, height:height} );

        var l = _cases.length;
        var caseHeight = height / l;
        for( var i = 0; i < l; i++)  {
            _cases[i].setSize( _width, caseHeight );
            // console.log(caseHeight * i);
            TweenMax.set(_cases[i], {y:Math.floor(caseHeight * i)} );
        }

		TweenMax.set( _line, { width:1, height:height, x:0 });
	};

    _instance.getWidth = function() {
        return _width;
    };

    _instance.kill = function() {
        var l = _cases.length;
        for( var i = 0; i < l; i++)  {
            _cases[i].kill();
        }
    };

    function addCases() {
        var l = _casesData.length;
        if( l < _numOfCases ) {
            _numOfCases = l;
        }

        _cases = [];
        var cloneCases = _casesData;
        
        for( var i = 0; i < _numOfCases; i++ ) {
            var index = Math.floor(Math.random * cloneCases.length);

            var project = new CaseOverviewCase( cloneCases.splice(index, 1)[0] );
            _instance.appendChild(project);
            project.init();

            _cases.push(project);
        }
    }

	return _instance;
}


function CaseOverviewCase( data ) {

    var _instance = document.createElement("div");
    _instance.style.position = "absolute";
    _instance.style.cursor = "pointer";

    _instance.style.overflow = "hidden";

    Touchable.apply( _instance );

    var _imgData = ContentManager.getChildByAttr(data, "name", "overviewimage");
    var _infoData = ContentManager.getChildByAttr(data, "name", "info");

    var _image;
    var _caseInfo;

    var _width = 0;
    var _height = 0;

    var _infoWidth = 0;

    _instance.init = function() {
        addImage();
        addInfo();

        _instance.onClick( onProjectClick );
        _instance.addEventListener("mouseover", onMouseOver);
        _instance.addEventListener("mouseout", onMouseOut);
    };

    _instance.kill = function() {
        _instance.removeEventListener("mouseover", onMouseOver);
    };

    _instance.setSize = function( width, height) {
        _width = width;
        _height = height;
        TweenMax.set(_instance, {width:_width, height:_height});

        _infoWidth = _width * 0.4;

        if( _infoWidth < 220 ) {
            _caseInfo.setMode("vertical");
        } else {
            _caseInfo.setMode("horrizontal");
        }

        _image.setSize( width, height );
        _caseInfo.setSize( _infoWidth, height );
        TweenMax.set( _caseInfo, {x:_width} );
    };

    function onMouseOut() {
        TweenMax.to( _caseInfo, 0.5, {x:_width, ease:Expo.easeOut} );
        TweenMax.to( _image, 0.5, {x:0, ease:Expo.easeOut} );
    }

    function onMouseOver() {
        TweenMax.to( _caseInfo, 0.5, {x:_width - _infoWidth, ease:Expo.easeOut} );
        TweenMax.to( _image, 0.5, {x:-_infoWidth, ease:Expo.easeOut} );
        // console.log("onMouseOver");
    }

    function onProjectClick() {
        var linkpath =  "/projects/" + data.getAttribute( "data-path" ) + "/";
        if(window.location.hash == "#" + linkpath) {
            Assets.MAIN_MENU.collapseMenu();
        }
        window.location.hash = linkpath;
    }

    function addImage() {
        _image = new RetinaImage(_imgData.innerHTML, null, onImgLoaded );
        _image.setPreloader( new SlidePreloader() );
        _image.init();
		_image.setResizeMode( "insideBox" );
        _image.setPosition( "center/center" );
		_instance.appendChild(_image);
    }

    function onImgLoaded() {
        _instance.setSize(_width, _height);
    }

    function addInfo() {
        _caseInfo = new CaseInfo(_infoData, 0);
        _caseInfo.init();
        _caseInfo.y = SiteGuides.OFFSET_TOP;
        // console.log("vertical");
        // _caseInfo.setMode("vertical");
        // "horrizontal";

        _instance.appendChild(_caseInfo);
    }

    return _instance;

}