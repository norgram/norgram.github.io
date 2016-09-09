function TemplateCase( data ) {
	var _instance							= Snail.extend( new PageTemplate( data ) );
	_instance.style.backgroundColor         = UIColors.DRAK_GRAY;

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

	// _instance.onResize = function() {
	// 	_instance.super.onResize();
	// 	_guides.set( Assets.RESIZE_MANAGER.getBreakPoint() );
	// 	if(Assets.RESIZE_MANAGER.getBreakPoint() === "mobile") {
	// 		var marginX = 20;
	// 		_guides.setGuide("guide-1", marginX);
	// 		_guides.setGuide("guide-3", _instance.visibleWidth - marginX);
	// 	} else {
	// 		_guides.setWidth(_instance.visibleWidth);
	// 	}
	// 	_instance.super.resizeModules();
	// };

	function setupAndAddModules() {

		var homeData = ContentManager.getChildByAttr(data.getXML(), "name", "home");
		var infoData = ContentManager.getChildByAttr(data.getXML(), "name", "info");

		_instance.addModule( new CaseHomeModule(homeData, infoData, onArrowClick));


		//add Modules
		var modules = ContentManager.getChildByAttr(data.getXML(), "name", "modules").children;
		var l = modules.length;

		for( var i = 0; i < l; i++) {
			_instance.addModule( getModule( modules[i] ) );
		}

		// console.log(l);


		_instance.addModule(new ReturnModule());
	}

	function getModule( moduleData ) {
		var id = moduleData.getAttribute("data-name");

		switch( id ) {
			case "moduleImage" : return new CaseImageModule( moduleData );
			case "moduleText" : return new CaseTextModule( moduleData );
		}

		console.error( "The module id:" + id + " does not excist; Check your spelling." );
		return null;
	}

	function onArrowClick() {
		_instance.scrollToNextModule();
	}


	return _instance;
}
