function TemplateProfil( data ) {
	var _instance							= Snail.extend( new PageTemplate( data ) );
	_instance.style.backgroundColor         = UIColors.WHITE;

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

		_instance.addModule( new BasicHomeModule( frontpageData, onNextClick ) );
		_instance.addModule( new ProfileEmployeeModule( employeeData ) );
		_instance.addModule( new ProfileInfoModule(serviceData, null, 2) );
		_instance.addModule( new ProfileInfoModule(processData, null, 3) );
		_instance.addModule( new ReturnModule() );
	}

	function onNextClick() {
		// console.log("HOME CLICK NEXT");
		_instance.scrollToNextModule();
	}


	return _instance;
}
