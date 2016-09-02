function TemplateCasesOverview( data ) {
	var _instance							= Snail.extend( new PageTemplate( data ) );
	_instance.style.backgroundColor         = UIColors.WHITE;

	var _guides								= null;

	_instance.init = function() {
		_instance.super.init();
		// trace("INIT TemplateCasesOverview");

		setupAndAddModules();
		_instance.onResize();
	};

	_instance.templateIn = function() {
		_instance.super.templateIn();
		_instance.init();
	};

	_instance.onResize = function() {
		_instance.super.onResize();
		// _instance.super.resizeModules();
	};

	function setupAndAddModules() {
		var casesData = ContentManager.getChildByAttr( data.getXML(), "name", "cases" );
		var cases = ContentManager.getChildrenByAttr( casesData, "name", "case" );

		var l = cases.length;
		for(var i = 0; i < l; i++) {
			_instance.addModule( new OverviewCaseModule( cases[i] ));
		}


	}

	return _instance;
}
