function ProfileEmployeeModuleTwo( data ) {

	var _instance = Snail.extend(new Module());
	_instance.style.backgroundColor = UIColors.WHITE;

	var START_OFFSET_X = 22;
	var SPACING = 60;

	var _slideNumber;

	var _width, _height;
	var _employees = [];

	var _image;
	var _line;

	var _lastRequest = false;

	_instance.init = function() {
		_instance.super.init();

		_instance.moduleId = "EMPLOYEE";

		addSiteLine();
		addEmployees();
		addImg();
		addSlideNumber();
	};

	function addSiteLine() {
		_line = document.createElement("div");
		_line.style.position = "absolute";
		_line.style.backgroundColor = UIColors.LINE_ON_WHITE;

		_instance.appendChild(_line);
	}

	_instance.setTextModel = function( model ) {
		var l = _employees.length;
		for( var i = 0; i < l; i++ ) {
			_employees[i].setTextModel(model);
		}
	};

	_instance.resize_desktop = function(width, height) {
		_width = width;
		_height = height;

		TweenMax.set( _line, { width:1, height:_height, x:1 });

		resizeEmployees();

		_instance.style.width = _instance.getWidth() + "px";
		_instance.style.height = height + "px";

		TweenMax.set(_slideNumber, { x:START_OFFSET_X, y: _height - _slideNumber.offsetHeight - SiteGuides.OFFSET_BOTOM + 12});


		//Dirtyfix to make sure javascript can read the right size of the text width
		if(_lastRequest) {
			_lastRequest = false;
		} else {
			requestAnimationFrame(_instance.callbackResize);
			_lastRequest = true;
		}
	};



	_instance.getWidth = function() {
		return getTextWidth() + _image.getWidth();
	};

	function getTextWidth() {
		var l = _employees.length;
		var totalWidth = START_OFFSET_X;
		for(var i = 0; i < l; i++) {
			totalWidth += _employees[i].getTextWidth() + getSpacing();
		}
		return totalWidth + getSpacing();
	}

	_instance.kill = function() {

	};

	function resizeEmployees() {
		var l = _employees.length;
		var offsetX = START_OFFSET_X;


		for(var i = 0; i < l; i++) {
			var employee = _employees[i];
			employee.setSize( 0, _height );

			TweenMax.set( employee, {x:offsetX, y:SiteGuides.getCenterOffset() - 4} );
			offsetX += employee.getTextWidth() + getSpacing();
		}

		_image.setSize( "auto", _height );
		TweenMax.set(_image, {y:0, x:offsetX + getSpacing()});
	}

	function getSpacing() {
		return SPACING * SiteGuides.getDesignHeightRatio();
	}

	function addEmployees() {
		var dataArr = ContentManager.getChildrenByAttr( data, "name", "employee");
		var l = dataArr.length;

		for(var i = 0; i < l; i++) {
			var employee = new EmployeeInfoText(ContentManager.getChildByAttr( dataArr[i], "name", "info"));
			// var employee = new ProfileEmployee(dataArr[i]);
			_instance.appendChild(employee);
			employee.init();
			_employees.push(employee);
		}
	}

	function addImg() {
		var dataImg = ContentManager.getChildByAttr( data, "name", "image");

		_image = new RetinaImage( dataImg.innerHTML, null, updateImageSize );
		_image.init();

		_instance.appendChild(_image);
	}

	function updateImageSize() {
		_image.setSize( "auto", _height );
		var xOffset = getTextWidth();

		TweenMax.set(_image, {y:0, x:xOffset});
		_instance.callbackResize();
	}


	function addSlideNumber() {
		_slideNumber = Text.getNewMed(90);
		_slideNumber.innerHTML = "1";
		_slideNumber.style.color = UIColors.DARK;

		_instance.appendChild(_slideNumber);
	}

	return _instance;
}



