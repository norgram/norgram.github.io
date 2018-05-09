function ProfileEmployee( data ) {

	var _instance = document.createElement("div");
	_instance.style.position = "absolute";

	var _width, _height;

	var _text, _image;

	var _line;

	_instance.init = function() {
		addSiteLine();
		addImage();
		addText();
	};

	_instance.setTextModel = function( model ) {
		_text.setTextModel(model);
	};

	_instance.setSize = function( width, height ) {
		_width = width;
		_height = height;

		_text.setSize(_width, _height);

		var textOffset = 11;

		TweenMax.set( _text, { y:SiteGuides.OFFSET_TOP, x:textOffset} );
		TweenMax.set( _line, { width:1, height:_height, x:1 });

		if(_image.isLoaded()) {
			updateImageSize();
		}
	};

	_instance.getWidth = function() {
		return _width;
	};

	function updateImageSize() {
		if(_width < _height) {
			_image.setSize( _width * 0.75, "auto" );
		} else {
			_image.setSize( "auto", _height * 0.75 );
		}

		TweenMax.set(_image, {y:_height - _image.getHeight(), x:_width * 0.5 - _image.getWidth() * 0.5});
	}

	function addText() {
		_text = new EmployeeInfoText(ContentManager.getChildByAttr( data, "name", "info"));
		_instance.appendChild(_text);
		_text.init();
	}

	function addImage() {
		var link = ContentManager.getChildByAttr( data, "name", "image").innerHTML;
		_image = new RetinaImage( link, null, updateImageSize );
		_image.init();

		_instance.appendChild(_image);
	}

	function addSiteLine() {
		_line = document.createElement("div");
		_line.style.position = "absolute";
		_line.style.backgroundColor = UIColors.LINE_ON_DARK;

		_instance.appendChild(_line);
	}

	return _instance;
}



function EmployeeInfoText( data ) {

	var _instance = document.createElement("div");
	_instance.style.position = "absolute";

	//TextAreas;
	var _name, _title, _mail, _phone, _linkedIn, _twitter;

	var _width, _height;

	var _textWidth = 0;
	var _textHeight = 0;

	var _origFontSize = 28;

	var _texts = [];

	var _model;

	_instance.init = function() {
		addName();
		addTitle();
		addMail();
		addPhone();
		addLinkedIn();
		addTwitter();

		updatePos();
	};

	_instance.setTextModel = function( model ) {
		_model = model;
		_model.addEventListener( TextAreaModel.EVENT_UPDATE, updatePos );
	};

	_instance.setSize = function(width, height) {
		_width = width;
		_height = height;

	};

	function updatePos() {
		var scale = _width / 700;



		if( scale > 1 || isNaN(scale) ) {
			scale = 1;
		} else if( scale < 0.3 ) {
			scale = 0.3;
		}


		var fontScale = _origFontSize * scale;
		if( fontScale > _origFontSize ) {
			fontScale = _origFontSize;
		}

		if( _model != null ) {
			fontScale = _model.fontSize;
		}

		_textWidth = 0;

		// console.log(scale);

		var space = _name.offsetHeight;// * scale;
		var currSpacing = -Text.getOffsetY(_name) * scale;

		if(_name != null) {
			_name.style.fontSize = fontScale + "px";
			_name.updateLineHeight();
			
			TweenMax.set(_name, {y:currSpacing, roundProps:"x,y"} );
			currSpacing += _name.offsetHeight;

			_textWidth = _name.offsetWidth > _textWidth ? _name.offsetWidth : _textWidth;
		}

		if(_title != null) {
			_title.style.fontSize = fontScale + "px";
			_title.updateLineHeight();
			TweenMax.set(_title, {y:currSpacing, roundProps:"x,y"} );
			currSpacing += _title.offsetHeight;

			_textWidth = _title.offsetWidth > _textWidth ? _title.offsetWidth : _textWidth;
		}

		currSpacing += space;

		if(_mail != null) {
			_mail.style.fontSize = fontScale + "px";
			_mail.updateLineHeight();
			TweenMax.set(_mail, {y:currSpacing, roundProps:"x,y"} );
			currSpacing += _mail.offsetHeight;

			_textWidth = _mail.offsetWidth > _textWidth ? _mail.offsetWidth : _textWidth;
		}

		if( _phone != null ) {
			_phone.style.fontSize = fontScale + "px";
			_phone.updateLineHeight();
			TweenMax.set(_phone, {y:currSpacing, roundProps:"x,y"});
			currSpacing += _phone.offsetHeight;

			_textWidth = _phone.offsetWidth > _textWidth ? _phone.offsetWidth : _textWidth;
		}

		currSpacing += space;

		if(_linkedIn != null) {
			_linkedIn.style.fontSize = fontScale + "px";
			_linkedIn.updateLineHeight();
			TweenMax.set(_linkedIn, {y:currSpacing, roundProps:"x,y"} );
			currSpacing += _linkedIn.offsetHeight;

			_textWidth = _linkedIn.offsetWidth > _textWidth ? _linkedIn.offsetWidth : _textWidth;
		}

		if( _twitter != null ) {
			_twitter.style.fontSize = fontScale + "px";
			_twitter.updateLineHeight();
			TweenMax.set(_twitter, {y:currSpacing, roundProps:"x,y"});
			currSpacing += _twitter.offsetHeight;

			_textWidth = _twitter.offsetWidth > _textWidth ? _twitter.offsetWidth : _textWidth;
		}

		_textHeight = currSpacing;
		// console.log("TextWidth = " + _textWidth);

	}

	_instance.getTextWidth = function() {
		return _textWidth;
	};

	function addName() {
		var name = ContentManager.getChildByAttr( data, "name", "name");
		if(name == null) {
			return;
		}


		_name = getText(name.innerHTML);
		_name.style.color = UIColors.FONT_DARK;

		_instance.appendChild(_name);

		Text.listenForSize( [_name], updatePos );
	}

	function addTitle() {
		var name = ContentManager.getChildByAttr( data, "name", "title");
		if(name == null) {
			return;
		}

		_title = getText(name.innerHTML);
		_instance.appendChild(_title);
	}

	function addMail() {
		var name = ContentManager.getChildByAttr( data, "name", "mail");
		if(name == null) {
			return;
		}

		_mail = getText(name.innerHTML);
		_instance.appendChild(_mail);
	}

	function addPhone() {
		var name = ContentManager.getChildByAttr( data, "name", "phone");
		if(name == null) {
			return;
		}

		_phone = getText(name.innerHTML);
		_instance.appendChild(_phone);
	}

	function addLinkedIn() {
		var link = ContentManager.getChildByAttr( data, "name", "linkedin");
		if(link == null) {
			return;
		}

		_linkedIn = new TextButton(getText(name.innerHTML), UIColors.FONT_DARK, link.innerHTML );
		_linkedIn.addClass("sliding-grey-small");
		_instance.appendChild(_linkedIn);
		_linkedIn.setText("LinkedIn");
		_linkedIn.init();
	}

	function addTwitter() {
		var link = ContentManager.getChildByAttr( data, "name", "twitter");
		if(link == null) {
			return;
		}

		_twitter = new TextButton(getText(""), UIColors.FONT_DARK, link.innerHTML );
		_twitter.addClass("sliding-grey-small");
		_instance.appendChild(_twitter);
		_twitter.setText("Twitter");
		_twitter.init();
	}

	function getText( text ) {
		var textInstance = Text.getNewLight( _origFontSize );
		textInstance.innerHTML = text;
		textInstance.style.whiteSpace = "nowrap";
		textInstance.style.color = UIColors.FONT_DARK;
		return textInstance;
	}

	return _instance;
}