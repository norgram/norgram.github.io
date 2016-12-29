Text = {};

Text.listenForSize = function( arr, callback, runNum ) {
	if( !runNum ){
		runNum = 0;
	}
	if( runNum >= 20 ){
		trace( "WARNING - Text.listenForSize() :: never found offsetSize for text" );
		return;
	}

	var l = arr.length;
	for( var i = 0; i < l; i++ ){
		var item = arr[ i ];
		if( item.offsetWidth === 0 || item.offsetHeight === 0 ){
			setTimeout( Text.listenForSize, 10, arr, callback, runNum++ );
			return;
		}
	}

	callback( arr );
};

Text.FontFamilyMedium = "FoundersGroteskMedium";
Text.FontFamilyRegular = "FoundersGroteskRegular";
Text.FontFamilyLight = "FoundersGroteskLight";

Text.getNewMed = function( fontSize ) {
	var div	= document.createElement("div");
	div.style.position = "absolute";
	div.style.fontFamily			= Text.FontFamilyMedium;
	
	div.lineHeightOffset = 0;
	div.lineHeightScale = 1;
	div.updateLineHeight = function() {
		Text.baseLineheightOnFontSizeLight( div );
	};

	if(fontSize) {
		div.style.fontSize = fontSize + "px";
		div.updateLineHeight();
	}

	CSS.antialiasText( div );
	return div;
};


Text.getNewReg = function( fontSize ) {
	var div	= document.createElement("div");
	div.style.position = "absolute";
	div.style.fontFamily			= Text.FontFamilyRegular;

	div.lineHeightOffset = 0;
	div.lineHeightScale = 1;
	div.updateLineHeight = function() {
		Text.baseLineheightOnFontSizeLight( div );
	};

	if(fontSize) {
		div.style.fontSize = fontSize + "px";
		div.updateLineHeight();
	}

	CSS.antialiasText( div );
	return div;
};

Text.getNewLight = function( fontSize ) {
	var div	= document.createElement("div");
	div.style.position = "absolute";
	div.style.fontFamily			= Text.FontFamilyLight;

	div.lineHeightOffset = 0;
	div.lineHeightScale = 1;
	div.updateLineHeight = function() {
		Text.baseLineheightOnFontSizeLight( div );
	};

	if(fontSize) {
		div.style.fontSize = fontSize + "px";
		div.updateLineHeight();
	}

	CSS.antialiasText( div );
	return div;
};


Text.getOffsetY = function( text ) {
	return parseFloat( text.style.fontSize ) * 0.23 - 1;
};

Text.getFontSizeBasedOnWidth = function(width, min) {
	var newSize 		= Math.floor(width * .11);
	var minSize			= 20;

	newSize = newSize < minSize ? (min ? min : minSize) : newSize;
	return newSize;
};

Text.baseLineheightOnFontSizeLight = function(div) {
	var offset = 0;
	if(div.lineHeightOffset) {
		offset = div.lineHeightOffset;
	}
	var lineScale = 1;
	if(div.lineHeightScale){
		lineScale = div.lineHeightScale;
	}
	
	div.style.lineHeight = offset + Math.round(parseInt(div.style.fontSize) * lineScale) + "px";
};
