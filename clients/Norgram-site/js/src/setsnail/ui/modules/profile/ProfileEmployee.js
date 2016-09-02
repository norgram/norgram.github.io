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

	_instance.setSize = function( width, height ) {
		_width = width;
		_height = height;

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

	_instance.init = function() {
		addName();
		addTitle();
		addMail();
		addPhone();
		addLinkedIn();
		addTwitter();


		updatePos();
	};

	_instance.setSize = function(width, height) {
		_width = width;
		_height = height;

		updatePos();
	};

	function updatePos() {
		var space = _name.offsetHeight;
		var currSpacing = -Text.getOffsetY(_name);

		if(_name != null) {
			TweenMax.set(_name, {y:currSpacing} );
			currSpacing += _name.offsetHeight;
		}

		if(_title != null) {
			TweenMax.set(_title, {y:currSpacing} );
			currSpacing += _title.offsetHeight;
		}

		currSpacing += space;

		if(_mail != null) {
			TweenMax.set(_mail, {y:currSpacing} );
			currSpacing += _mail.offsetHeight;
		}

		if( _phone != null ) {
			TweenMax.set(_phone, {y:currSpacing});
			currSpacing += _phone.offsetHeight;
		}

		currSpacing += space;

		if(_linkedIn != null) {
			TweenMax.set(_linkedIn, {y:currSpacing} );
			currSpacing += _linkedIn.offsetHeight;
		}

		if( _twitter != null ) {
			TweenMax.set(_twitter, {y:currSpacing});
			// currSpacing += _twitter.offsetHeight;
		}

	}

	function addName() {
		var name = ContentManager.getChildByAttr( data, "name", "name");
		if(name == null) {
			return;
		}

		_name = getText(name.innerHTML);
		_name.style.color = UIColors.WHITE;

		_instance.appendChild(_name);
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

		_linkedIn = new TextButton(getText(name.innerHTML), UIColors.FONT_MED_ON_DARK, link.innerHTML );
		_linkedIn.addClass("sliding-grey");
		_instance.appendChild(_linkedIn);
		_linkedIn.setText("LinkedIn");
		_linkedIn.init();
	}

	function addTwitter() {
		var link = ContentManager.getChildByAttr( data, "name", "twitter");
		if(link == null) {
			return;
		}

		_twitter = new TextButton(getText(""), UIColors.FONT_MED_ON_DARK, link.innerHTML );
		_twitter.addClass("sliding-grey");
		_instance.appendChild(_twitter);
		_twitter.setText("Twitter");
		_twitter.init();
	}

	function getText( text ) {
		var textInstance = Text.getNewLight( 28 );
		textInstance.innerHTML = text;
		textInstance.style.whiteSpace = "nowrap";
		textInstance.style.color = UIColors.FONT_MED_ON_DARK;
		return textInstance;
	}

	return _instance;
}