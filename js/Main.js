(function Main() {

  var _instance = {};

  var _numOfRows;
  var _colContainer;
  var _canvas;
  var _ctx;
  var _prevRowNum = -1;
  var _rowPos = {};
  var _mousePos = {
    x: 0,
    y: 0
  };

  _instance.init = function() {
    _colContainer = document.querySelector('.col-container');

    addListeners();
    buildCanvas();
    buildRows();
    handleResize();

    draw();

    requestAnimationFrame(render);
  };

  function buildCanvas() {
    _canvas = document.getElementById('pattern');
    _canvas.style.position = 'absolute';
    _canvas.style.left = 20 + 'px';

    _ctx = _canvas.getContext('2d');
  }

  function addListeners() {
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
  }

  function buildRows() {
    var gapWidth = 16;

    for (var j = 0, rowLength = 15; j < rowLength; j++) {
      var row = 'r' + j;
      _rowPos[row] = {};
      _rowPos[row].posX = (j % 2 == 1) ? (gapWidth / 2) + 0.5 : 0.5;
      _rowPos[row].posX += window.innerWidth;
      _rowPos[row].startX = 0;
    }
  }

  function draw() {
    var LINE_HEIGHT = _canvas.height / _numOfRows;
    var xPos;
    var yPos = 0;
    var strokeWidth = 1.5;
    var gapWidth = 16;

    // clear the canvas
    _ctx.clearRect(0, 0, _canvas.width, _canvas.height);
    _ctx.strokeStyle = 'rgb(0, 0, 0)';

    for (var j = 0; j < _numOfRows; j++) {
      xPos = -_rowPos['r' + j].posX;

      _ctx.lineWidth = strokeWidth;

      for (var i = 0, lineLength = 500; i < lineLength; i++) {
        _ctx.beginPath();
        _ctx.moveTo(xPos, yPos);
        _ctx.lineTo(xPos, yPos + LINE_HEIGHT);
        _ctx.closePath();
        _ctx.stroke();

        xPos += gapWidth;

        // if outside of view, stop running the loop
        if (xPos - strokeWidth > _canvas.width) {
          break;
        }
      }

      strokeWidth += .5;
      yPos += LINE_HEIGHT;
    }

  }

  function render(reqIndex) {
    if (window.innerWidth > 600) {
      draw();
    }

    requestAnimationFrame(render);
  }


  function handleMouseMove(e) {
    _mousePos.x = e.x;
    _mousePos.y = e.y;

    var currentRowNum = getCurrentRow();

    if (currentRowNum === -1) {
      _prevRowNum = -1;
      return;
    }

    var rowName = 'r' + currentRowNum;
    var rowObj = _rowPos[rowName];

    // is this a new row?
    if (currentRowNum != _prevRowNum) {
      rowObj.startX = _mousePos.x;
      _prevRowNum = currentRowNum;
    }

    var destinPos = rowObj.posX + (_mousePos.x - rowObj.startX);

    if (destinPos < 0) {
      destinPos = _canvas.width;

      _rowPos[rowName].posX = _canvas.width;
      _rowPos[rowName].startX = _mousePos.x;
    } else if (destinPos > _canvas.width * 3) {
      destinPos = 0;

      _rowPos[rowName].posX = 0;
      _rowPos[rowName].startX = _mousePos.x;
    }

    TweenLite.killTweensOf(_rowPos[rowName]);
    TweenLite.to(_rowPos[rowName], 1.5, {
      posX: destinPos,
      startX: _mousePos.x,
      ease: Quad.easeOut
    });
  }

  function getCurrentRow() {
    var LINE_HEIGHT = _canvas.height / _numOfRows;

    for (var j = 0; j < _numOfRows; j++) {
      // determine if the current row is active
      var isRowActive = false;
      var topOfRow = _colContainer.clientHeight + 15 + (LINE_HEIGHT * j);
      var bottomOfRow = topOfRow + LINE_HEIGHT;

      if (_mousePos.y > topOfRow && _mousePos.y < bottomOfRow) {
        return j;
      }
    }

    return -1;
  }

  function handleResize(e) {
    _canvas.style.top = _colContainer.clientHeight + 15 + 'px';

    _canvas.width = window.innerWidth - 40;
    _canvas.height = window.innerHeight - _colContainer.clientHeight - 35 - 15;

    if (window.innerHeight > 780) {
      _numOfRows = 15;
    } else if (window.innerHeight > 700) {
      _numOfRows = 12;
    } else if (window.innerHeight > 600) {
      _numOfRows = 10;
    } else {
      _numOfRows = 8;
    }

    draw();
  }

  window.Main = _instance;
})();

window.onload = Main.init;
