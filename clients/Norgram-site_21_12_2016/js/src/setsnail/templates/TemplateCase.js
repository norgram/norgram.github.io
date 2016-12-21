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

		_instance.addModule(new ReturnModule());
	}

	var _imgId = 0;

	function getModule( moduleData ) {
		var id = moduleData.getAttribute("data-name");

		switch( id ) {
			case "moduleImage" :
				_imgId++;
				return new CaseImageModule( moduleData, _imgId );
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
