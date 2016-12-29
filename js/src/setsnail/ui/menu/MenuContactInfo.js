function MenuContactInfo( data, guides ) {

	var _instance = document.createElement("div");
	_instance.style.position = "absolute";

	var OFFSET_TOP = 19;
	var COLUMN_SPACING = 20;

	var _isMobileMode = false;

	var _headline;

	var _columns = [];

	_instance.init = function() {
		addHeadline();
		addColumns();

		Text.listenForSize(_columns, startLayoutListen);
	};

	_instance.setMobileMode = function() {
		_isMobileMode = true;
		Text.listenForSize(_columns, updateLayout);
	};

	_instance.setDesktopMode = function() {
		_isMobileMode = false;
		Text.listenForSize(_columns, updateLayout);
	};
	

	function startLayoutListen() {
		getColumnsTextWidth();
		guides.addEventListener( GuideLines.ON_UPDATE, updateLayout );
		updateLayout();
	}

	function addHeadline() {
		_headline = Text.getNewReg(13);
		_headline.style.color = UIColors.WHITE;
		_headline.innerHTML = ContentManager.getChildByAttr( data, "name", "headline").innerHTML;
		_headline.style.whiteSpace = "nowrap";

		_instance.appendChild(_headline);

		var headlineOffset = -40;

		Text.listenForSize([_headline], function() {
			TweenMax.set(_headline, {x:headlineOffset - _headline.offsetWidth, y:- Text.getOffsetY(_headline)});
		});

	}

	function addColumns() {
		var columns = ContentManager.getChildByAttr( data, "name", "columns");
		var l = columns.children.length;

		for(var i = 0; i < l; i++) {
			// console.log( columns.children[i].innerHTML );
			var column = Text.getNewReg(13);
			column.lineHeightOffset = 1;
			column.style.color = UIColors.FONT_MED_ON_WHITE;
			column.style.whiteSpace = "nowrap";
			column.innerHTML = columns.children[i].innerHTML;
			column.updateLineHeight();
			TweenMax.set( column, {y:-Text.getOffsetY(column)} );
			_instance.appendChild(column);

			_columns.push(column);
		}
	}

	function updateLayout() {
		var width = guides.getGuide("end") - guides.getGuide("contact");
		var xPos = guides.getGuide("contact");
		if(getColumnsTextWidth() > width) {
			xPos = guides.getGuide("end") - getColumnsTextWidth();
		}

		if( BrowserDetect.MOBILE || _isMobileMode) {
			xPos = guides.getGuide("start");
		}

		TweenMax.set( _instance, {x:xPos, y:OFFSET_TOP} );
		Text.listenForSize(_columns, layoutColumns);

		if( _isMobileMode && _columns.length > 2 ) {
			if(_columns.length > 2) {
				_columns[2].style.display = "none";
			}
		} else {
			if(_columns.length > 2){
				_columns[2].style.display = "inline";
			}
		}
	}

	function layoutColumns() {
		var l = _columns.length;

		if( BrowserDetect.MOBILE || _isMobileMode && l > 2) {
			l = 2;
		}
 
		var xPos = 0;
		for( var i = 0; i < l; i++) {
			TweenMax.set( _columns[i], {x:xPos});
			xPos += _columns[i].offsetWidth + COLUMN_SPACING;
		}
	}

	var _columnWidth = 0;
	function getColumnsTextWidth(){
		// if(_columnWidth != 0) {
		// 	return _columnWidth;
		// }

		var l = _columns.length;
		_columnWidth = 0;
		for( var i = 0; i < l; i++) {
			_columnWidth += _columns[i].offsetWidth;
			_columnWidth += COLUMN_SPACING;
		}

		return _columnWidth;
	}

	return _instance;
}
