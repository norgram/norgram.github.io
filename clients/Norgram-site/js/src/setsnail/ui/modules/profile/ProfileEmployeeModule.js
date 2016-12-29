function ProfileEmployeeModule( data ) {

	var _instance = Snail.extend(new Module());
	_instance.style.backgroundColor = UIColors.DARK;

	var START_OFFSET_X = 58;

	var _slideNumber;

	var _width, _height;
	var _employees = [];

	_instance.init = function() {
		_instance.super.init();

		_instance.moduleId = "EMPLOYEE";

		addEmployees();
		addSlideNumber();
	};

	_instance.setTextModel = function( model ) {
		var l = _employees.length;
		for( var i = 0; i < l; i++ ) {
			_employees[i].setTextModel(model);
		}
	};

	_instance.resize_desktop = function(width, height) {
		_width = width;
		_height = height;

		resizeEmployees();

		_instance.style.width = _instance.getWidth() + "px";
		_instance.style.height = height + "px";

		TweenMax.set(_slideNumber, { x:START_OFFSET_X + 11, y: _height - _slideNumber.offsetHeight - SiteGuides.OFFSET_BOTOM + 12});

	};

	_instance.getWidth = function() {
		var l = _employees.length;
		var totalWidth = 0;
		for(var i = 0; i < l; i++) {
			totalWidth += _employees[i].getWidth();
		}
		return totalWidth;
	};

	_instance.kill = function() {

	};

	function resizeEmployees() {
		var l = _employees.length;
		var offsetX = START_OFFSET_X;


		var width = (_width - offsetX) / 2;
		if( _height * 1.3 > _width ) {
			width = _width;
		}

		width = Math.ceil(_height * 0.8);
		for(var i = 0; i < l; i++) {
			var employee = _employees[i];
			employee.setSize( width, _height );

			TweenMax.set( employee, {x:offsetX} );
			offsetX += width;
		}
	}

	function addEmployees() {
		var dataArr = ContentManager.getChildrenByAttr( data, "name", "employee");
		var l = dataArr.length;

		for(var i = 0; i < l; i++) {
			var employee = new ProfileEmployee(dataArr[i]);
			_instance.appendChild(employee);
			employee.init();
			_employees.push(employee);
		}
	}

	function addSlideNumber() {
		_slideNumber = Text.getNewMed(90);
		_slideNumber.innerHTML = "1";
		_slideNumber.style.color = UIColors.WHITE;

		_instance.appendChild(_slideNumber);
	}

	return _instance;
}



