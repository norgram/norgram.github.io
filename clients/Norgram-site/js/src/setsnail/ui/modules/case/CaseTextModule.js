function CaseTextModule( data ) {

	var _instance = Snail.extend(new Module());
	_instance.style.position = "absolute";

	var _widthScale = 1;

	var _width, _height;

	var _model;
	var _top, _bot, _mid;

	var _textAreas = [];

	_instance.init = function() {
		var scaleData = data.getAttribute( "data-width-scale");
		if(scaleData != null) {
			_widthScale = scaleData;
			console.log( scaleData );
		}

		addTop();
		addMid();
		addBot();

		setModel();
	};

	_instance.resize_desktop = function (width, height) {
		_width = width * 0.2;
		_height = height;

		_textHeightScale = 0.3;

		var margin = 9;
		var textWidth = (_width - margin * 2) * _widthScale;

		if(_top != null) {
			_top.setSize( textWidth, _height * _textHeightScale );
			TweenMax.set( _top, { x:margin, y:SiteGuides.OFFSET_TOP} );
		}

		if(_mid != null ) {
			_mid.setSize( textWidth, _height * _textHeightScale );
			TweenMax.set( _mid, { x:margin, y:SiteGuides.getCenterOffset()} );
		}

		if( _bot != null ) {
			_bot.setSize( textWidth, _height * _textHeightScale );
			TweenMax.set( _bot, { x:margin, y: _height - SiteGuides.OFFSET_BOTOM - _bot.getTextInstance().offsetHeight + Text.getOffsetY(_bot.getTextInstance()) * 2} );
		}

	};

	_instance.getWidth = function() {
		return _width;
	};


	function addTop(){
		var topData = ContentManager.getChildByAttr( data, "name", "top");
		if(topData == null) {
			return;
		}

		_top = new TextArea(topData.innerHTML, Text.getNewReg(13));
		_top.style.color = UIColors.FONT_DARK;
		_top.init();
		_textAreas.push(_top);

		_instance.appendChild( _top );
	}

	function addMid(){
		var midData = ContentManager.getChildByAttr( data, "name", "mid");
		if(midData == null) {
			return;
		}

		_mid = new TextArea(midData.innerHTML, Text.getNewReg(13));
		_mid.style.color = UIColors.FONT_DARK;
		_mid.init();
		_textAreas.push(_mid);

		_instance.appendChild( _mid );
	}

	function addBot(){
		var botData = ContentManager.getChildByAttr( data, "name", "bot");
		if(botData == null) {
			return;
		}

		_bot = new TextArea(botData.innerHTML, Text.getNewReg(13));
		_bot.style.color = UIColors.FONT_DARK;
		_bot.init();
		_textAreas.push(_bot);

		_instance.appendChild( _bot );
	}

	function setModel() {
		_model = new TextAreaModel();


		var l = _textAreas.length;
		var controlId = getLongestTextId( _textAreas );

		for( var i = 0; i < l; i++) {
			var mode;
			if(i ==controlId) {
				mode = TextAreaModel.MODE_CONTROL;
			}else {
				mode = TextAreaModel.MODE_LISTEN;
			}
			_textAreas[i].addModel( _model, mode );
		}

	}

	function getLongestTextId( textAreas ) {
		var highestCount = 0;
		var highsetId = -1;
		var l = textAreas.length;
		for(var i = 0; i < l; i++) {
			var bodyHtml = textAreas[i].getTextInstance().innerHTML;
			if(bodyHtml.length > highestCount) {
				highestCount = bodyHtml.length;
				highsetId = i;
			}
		}
		return highsetId;
	}

	return _instance;
}