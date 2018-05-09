function TemplatePrincip( data ) {
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
		var sectionsData = ContentManager.getChildByAttr( data.getXML(), "name", "sections" );

		var sections = ContentManager.getChildrenByAttr( sectionsData, "name", "section" );

		_instance.addModule( new BasicHomeModule( frontpageData, onNextClick ) );

		var longestId = getLongestSectionId(sections);
		var bodyModel = new TextAreaModel();

		var l = sections.length;
		for( var i = 0; i < l; i++) {
			var mode = i == longestId ? TextAreaModel.MODE_CONTROL : TextAreaModel.MODE_LISTEN;
			_instance.addModule( new PrincipleSectionModule( sections[i], bodyModel, mode ) );
		}


		var returnModule = new ReturnModule();
		returnModule.addLine( UIColors.LINE_ON_WHITE );
		_instance.addModule( returnModule );
	}

	function onNextClick() {
		// console.log("HOME CLICK NEXT");
		_instance.scrollToNextModule();
	}

	function getLongestSectionId( section ) {
		var highestCount = 0;
		var highsetId = -1;
		var l = section.length;
		for(var i = 0; i < l; i++) {
			var bodyHtml = ContentManager.getChildByAttr(section[i], "name", "body").innerHTML;
			if(bodyHtml.length > highestCount) {
				highestCount = bodyHtml.length;
				highsetId = i;
			}
		}
		return highsetId;
	}

	return _instance;
}
