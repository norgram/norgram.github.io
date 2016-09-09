function TemplatePrincip( data ) {
	var _instance							= Snail.extend( new PageTemplate( data ) );
	_instance.style.backgroundColor         = UIColors.DARK;

	var _guides								= null;

	_instance.init = function() {
		_instance.super.init();
		// trace("INIT TemplatePrincip");
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
		var sectionsData = ContentManager.getChildByAttr( data.getXML(), "name", "sections" );

		// console.log(sectionsData);

		var sections = ContentManager.getChildrenByAttr( sectionsData, "name", "section" );

		_instance.addModule( new BasicHomeModule( frontpageData, onNextClick ) );

		var l = sections.length;
		for( var i = 0; i < l; i++) {
			_instance.addModule( new PrincipleSectionModule( sections[i] ) );
		}


		_instance.addModule( new ReturnModule() );
	}

	function onNextClick() {
		// console.log("HOME CLICK NEXT");
		_instance.scrollToNextModule();
	}

	return _instance;
}
