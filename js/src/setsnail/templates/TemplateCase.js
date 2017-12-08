function TemplateCase( data, coverImg ) {
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

		var moduleTextArr = [];
		for( var i = 0; i < l; i++) {
			var id = modules[i].getAttribute("data-name");
			var modul = getModule( modules[i] );
			_instance.addModule( modul );

			if(id == "moduleText") {
				moduleTextArr.push(modul);
			}
		}

		var maxLength = 0;
		var maxId = 0;
		var l = moduleTextArr.length;
		for( var i = 0; i < l; i++ ) {
			var numOfChars = moduleTextArr[i].getNumOfChars();
			if( numOfChars > maxLength ) {
				maxId = i;
				maxLength = numOfChars;
			}
		}

		var model = new TextAreaModel();
		model.maxFontSize = 23;
		for( var i = 0; i < l; i++ ) {
			var mode = TextAreaModel.MODE_LISTEN;
			if( i == maxId ) {
				mode = TextAreaModel.MODE_CONTROL;
			}
			moduleTextArr[i].setModel( model, mode );
		}


		_instance.addModule(new ReturnModule(90));

		if( BrowserDetect.DESKTOP ) {
			_instance.addModule(new CaseOverviewModule());
		}
	}

	var _imgId = 0;

	function getModule( moduleData ) {
		var id = moduleData.getAttribute("data-name");

		switch( id ) {
			case "moduleImage" :
				_imgId++;
				return new CaseImageModule( moduleData, _imgId );
			case "moduleText" : return new CaseTextModule( moduleData );
			case "moduleVideo" : return new CaseVideoModule( moduleData );
		}

		console.error( "The module id:" + id + " does not excist; Check your spelling." );
		return null;
	}

	function onArrowClick() {
		_instance.scrollToNextModule();
	}


	return _instance;
}
