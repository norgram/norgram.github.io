function PsychodelicLines() {

    var _instance = document.createElement("div");
    _instance.style.position = "absolute";
    _instance.style.backgroundColor = UIColors.PRELOADER_COLOR_ONE;

    var _width = 0;
    var _height = 0;

    var _canvas, _ctx;

    var _lines = [];
    var _numOfLines = 0;

    var _isRendering = false;

    _instance.init = function() {
        createCanvas();

        addListeners();

        resize();
    
        render();
    };

    _instance.startRender = function() {
        if(_isRendering) {
           return; 
        }
        _isRendering = true;
        render();
    };
    _instance.stopRender = function() {
        _isRendering = false;
    };

    _instance.kill = function() {
        _isRendering = false;
        Assets.RESIZE_MANAGER.removeEventListener( ResizeEvents.RESIZE, resize );
        _instance.removeEventListener('mousemove', onMouseMove);
    };

    _instance.resetLinePositions = function() {
        for( var i = 0; i < _numOfLines; i++ ) {
            _lines[i].x = (i % 2) ? 7 : 1;
            _lines[i].velocityX = 0;
        }
        if(!_isRendering) {
            render();
        }
    };

    function addListeners() {
        Assets.RESIZE_MANAGER.addEventListener( ResizeEvents.RESIZE, resize );
        _instance.addEventListener('mousemove', onMouseMove);
    }

    var _lastMouseX = null;

    function onMouseMove(e) {
        var mouseY = e.y;
        var mouseX = e.x;

        var deltaX = 0;
        
        if(_lastMouseX != null){
            deltaX = mouseX - _lastMouseX;
        }
        
        var ratioY = mouseY / _height;
        var index = Math.floor(_numOfLines * ratioY); 

        if( deltaX < 0 ) {
            var vel = deltaX * 0.1;
            if( vel < _lines[index].velocityX ) {
                _lines[index].velocityX = vel;
            }
        } else if( deltaX > 0 ) {
            var vel = deltaX * 0.2;
            if( vel > _lines[index].velocityX ) {
                _lines[index].velocityX = vel;
            }
        }

        _lastMouseX = mouseX;
    }

    function createCanvas() {
        _canvas = document.createElement('canvas');
        _canvas.style.position = 'absolute';

        _instance.appendChild(_canvas);

        _ctx = _canvas.getContext('2d');
    }

    function updateLineCount() {
        _numOfLines = Math.ceil(_height / 80);
        var i = _numOfLines;

        if(_numOfLines < 5) {
            _numOfLines = 5;
        } else if( _numOfLines > 16 ) {
            _numOfLines = 16;
        }


        while( _lines.length > _numOfLines ) {
            _lines.pop();
        }
        while( _lines.length < _numOfLines ) {
            i++;
            var line = new PhychoLine(_ctx);
            line.x = (i % 2) ? 8 : 0;
            line.setSize( _width, _height / _numOfLines );
            _lines.push( line );
        }

        if(!_isRendering) {
            render();
        }
    }

    function render() {
        _ctx.clearRect(0, 0, _canvas.width, _canvas.height);
        _ctx.strokeStyle = 'rgb(0, 0, 0)';

        var singleHeight = _height / _numOfLines;

        for( var i = 0; i < _numOfLines; i++ ) {
            _lines[i].y = singleHeight * i;
            _lines[i].thickness = 1 + i / _numOfLines * 9;
            _lines[i].setSize( _width, singleHeight );
            _lines[i].render();
        }

        if(_isRendering) {
            requestAnimationFrame( render );
        }
    }

    function resize() {
        _width = Assets.RESIZE_MANAGER.getWindowWidth();
        _height = Assets.RESIZE_MANAGER.getWindowHeight();

        _canvas.width = _width;
        _canvas.height = _height;
        TweenMax.set( _instance, { x: -_width } );

        TweenMax.set( _instance, { width:_width, height:_height } );

        updateLineCount();
    }
 
    return _instance;
}


function PhychoLine( context ) {
    var _instance = {};

    _instance.spacing = 17;
    _instance.thickness = 2;
    
    _instance.x = 0;
    _instance.y = 0;


    _instance.drag = 0.98;
    _instance.velocityX = 0;

    var _width = 0;
    var _height = 0;

    _instance.render = function() {
        var singleWidth = _instance.spacing;// + _instance.thickness;
        var numOfLines = Math.ceil(_width / singleWidth) + 1;

        _instance.x += _instance.velocityX;
        _instance.velocityX = _instance.velocityX * _instance.drag;

        while( _instance.x < 0 ) {
            _instance.x += _width;
        }

        var xPos = _instance.x;

        for( var i = 0; i < numOfLines; i++ ) {
            var loopX = xPos % (singleWidth * numOfLines) - _instance.thickness * 0.5;

            context.lineWidth = _instance.thickness;
            context.beginPath();
            context.moveTo(loopX, _instance.y);
            context.lineTo(loopX, _instance.y + _height);
            context.closePath();
            context.stroke();

            xPos += singleWidth;
        }

    };

    _instance.setSize = function(width, height) {
        _width = width;
        _height = height;
    };

    return _instance;
}