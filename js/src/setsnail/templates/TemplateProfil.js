function TemplateProfil( data ) {
	var _instance							= Snail.extend( new PageTemplate( data ) );
	_instance.style.backgroundColor         = UIColors.DARK;

	var _guides								= null;

	_instance.init = function() {
		_instance.super.init();
		setupAndAddModules();

		_instance.onResize();
	};


	_instance.templateIn = function() {
		_instance.init();
		_instance.super.templateIn();
	};

	_instance.onResize = function() {
		_instance.super.onResize();
	};

	function setupAndAddModules() {
		var frontpageData = ContentManager.getChildByAttr( data.getXML(), "name", "frontpage" );
		var employeeData = ContentManager.getChildByAttr( data.getXML(), "name", "employees" );
		var serviceData = ContentManager.getChildByAttr( data.getXML(), "name", "service" );
		var processData = ContentManager.getChildByAttr( data.getXML(), "name", "process" );

		var profilInfoOne = new ProfileInfoModule(serviceData, null, 2);
		var profilInfoTwo = new ProfileInfoModule(processData, null, 3, true);

		// var employeeModule = new ProfileEmployeeModule( employeeData );
		var employeeModule = new ProfileEmployeeModuleTwo( employeeData );

		_instance.addModule( new BasicHomeModule( frontpageData, onNextClick ) );
		_instance.addModule( employeeModule );
		_instance.addModule( profilInfoOne );
		_instance.addModule( profilInfoTwo );

		var returnModule = new ReturnModule();
		returnModule.addLine( UIColors.LINE_ON_WHITE );
		_instance.addModule( returnModule );

		var model = new TextAreaModel();
		profilInfoOne.setBodyTextModel( model );
		profilInfoTwo.setBodyTextModel( model, TextAreaModel.MODE_LISTEN );
		employeeModule.setTextModel( model );
	}

	function onNextClick() {
		// console.log("HOME CLICK NEXT");
		_instance.scrollToNextModule();
	}


	return _instance;
}
