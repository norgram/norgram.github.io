function PrincipleSectionModule( data, bodyModel, modelMode ) {

	var _instance = Snail.extend(new Module());
	_instance.style.backgroundColor = UIColors.WHITE;

	var _line;
	var _width, _height;
	var _body, _headline, _image;

	_instance.init = function () {
		_instance.super.init();

		addSiteLine();

		addHeadline();
		addBodyText();
		addImage();
	};

	_instance.resize_desktop = function (width, height) {
		_width = Math.floor(height * 0.25);

		if(_width < 200) {
			_width = 200;
		}

		_height = height;

		_instance.style.width = _instance.getWidth() + "px";
		_instance.style.height = height + "px";

		var margin = 11;

		var headOffsetY = SiteGuides.OFFSET_TOP - Text.getOffsetY(_headline.getTextInstance());
		var bodyOffsetY = SiteGuides.getCenterOffset();
		var bodyHeight = _height - bodyOffsetY - Math.floor(height * 0.25) - margin * 2;
		// var imgOffset = bodyOffsetY + bodyHeight + margin * 8;

		_body.setSize( _width - margin * 2, bodyHeight );

		TweenMax.set( _headline, { x:margin, y:headOffsetY } );
		TweenMax.set( _body, { x:margin, y:bodyOffsetY} );
		TweenMax.set( _line, { width:1, height:_height });

		if( _image != null ) {
			var ratio = (Math.floor(height * 0.25)/268);
			var imgMargin = Math.floor(margin * 6 * ratio);
			var imgSize = Math.floor(height * 0.25) - imgMargin;

			_image.setSize(imgSize, imgSize);
			TweenMax.set( _image, { y:_height - imgSize - margin * 3, x:_width * 0.5 - imgSize * 0.5 } );
		}

	};

	_instance.getWidth = function() {
		return _width;
	};

	_instance.kill = function() {

	};

	function addSiteLine() {
		_line = document.createElement("div");
		_line.style.position = "absolute";
		_line.style.backgroundColor = UIColors.LINE_ON_WHITE;

		_instance.appendChild(_line);
	}

	function addHeadline() {
		var textData = ContentManager.getChildByAttr( data, "name", "headline" );

		_headline = new TextArea( textData.innerHTML, Text.getNewLight(28) );
		_headline.style.color = UIColors.FONT_DARK;
		_headline.getTextInstance().style.whiteSpace = "nowrap";

		_headline.init();

		_instance.appendChild(_headline);
	}

	function addBodyText() {
		var textData = ContentManager.getChildByAttr( data, "name", "body" );

		_body = new TextArea( textData.innerHTML, Text.getNewLight(28) );
		_body.style.color = UIColors.FONT_DARK;
		_body.init( bodyModel, modelMode );

		_instance.appendChild(_body);
	}

	function addImage() {
		var urlData = ContentManager.getChildByAttr( data, "name", "image" );
		if( urlData == null || urlData.innerHTML == "" ) {
			return;
		}

		switch(urlData.innerHTML) {
			case "round" : {
				_image = new CircleInCircle(200);
				break;
			}
			case "roundrect" : {
				_image = new CircleInRect(200);
				break;
			}
			case "rect" : {
				_image = new RectInRect(200, 200);
				break;
			}
			case "rectbyrect" : {
				_image = new RectByRect(200, 200);
				break;
			}
			case "triangle" : {
				_image = new TriangleInRect(200, 200);
				break;
			}
			case "doubletriangle" : {
				_image = new DoubleTriangleInRect(200, 200);
				break;
			}
			
		}

		if(_image == null) {
			return;
		}

		// _image.addMouseEffect();
		_instance.appendChild(_image);

		// console.log( urlData.innerHTML );
		// _image = new RetinaImage( urlData.innerHTML );
		// _image.init();

		// _image = new Image();
		// _image.src = urlData.innerHTML;
		//
		// _instance.appendChild(_image);
	}

	return _instance;

}