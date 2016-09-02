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

// Text.getNewLight = function(fontSize) {
// 	var div = document.createElement("div");
// 	div.style.position				= "absolute";
//
// 	div.style.fontFamily			= "franklin-gothic-urw";
// 	div.style.fontStyle				= "Light";
// 	div.style.fontWeight			= "300";
//
// 	if(fontSize) {
// 		div.style.fontSize = fontSize + "px";
// 		Text.baseLineheightOnFontSizeLight(div);
// 	}
//
// 	CSS.antialiasText( div );
//
// 	return div;
// };
//
// Text.getNewMedium = function(fontSize) {
// 	var div = document.createElement("div");
// 	div.style.position				= "absolute";
//
// 	div.style.fontFamily			= "franklin-gothic-urw";
// 	div.style.fontStyle				= "Medium";
// 	div.style.fontWeight			= "600";
//
// 	if(fontSize) {
// 		div.style.fontSize = fontSize + "px";
// 		Text.baseLineheightOnFontSizeMedium(div);
// 	}
//
// 	CSS.antialiasText( div );
//
// 	return div;
// };
//
// Text.getNewHeavy = function(fontSize) {
// 	var div = document.createElement("div");
// 	div.style.position				= "absolute";
//
// 	div.style.fontFamily			= "franklin-gothic-urw";
// 	div.style.fontStyle				= "Heavy";
// 	div.style.fontWeight			= "900";
//
// 	if(fontSize) {
// 		if(fontSize > 24) {
// 			div.style.letterSpacing	= "-0.025em";
// 		} else {
// 			div.style.letterSpacing	= "-0.01em";
// 		}
//
// 		div.style.fontSize = fontSize + "px";
// 		Text.baseLineheightOnFontSizeHeavy(div);
// 	}
//
// 	CSS.antialiasText( div );
//
// 	return div;
// };
//
// Text.convertBoldToHeavy = function(target) {
// 	var boldItems 		= target.getElementsByTagName("b");
// 	var l 				= boldItems.length;
// 	var item 			= null;
// 	for(var i = 0; i < l; i += 1) {
// 		item = boldItems[i];
//
// 		item.style.fontWeight 			= "normal";
// 		item.style.fontFamily			= "franklin-gothic-urw";
// 		item.style.fontStyle			= "Heavy";
// 		item.style.fontWeight			= "900";
// 	}
//
// 	return target;
// };
//
// Text.getNewBook = function(fontSize) {
// 	var div							= document.createElement("div");
// 	div.style.position				= "absolute";
// 	div.style.fontFamily			= "franklin-gothic-urw";
// 	div.style.fontStyle				= "Book";
// 	div.style.fontWeight			= "400";
//
// 	if(fontSize) {
// 		div.style.fontSize = fontSize + "px";
// 		Text.baseLineheightOnFontSizeBook(div);
// 	}
//
// 	CSS.antialiasText( div );
//
// 	return div;
// };
//
// Text.getNewDemi = function( fontSize ) {
// 	var div							= document.createElement("div");
// 	div.style.fontFamily			= "franklin-gothic-urw";
// 	div.style.fontStyle				= "Demi";
// 	div.style.fontWeight			= "700";
//
// 	if(fontSize) {
// 		div.style.fontSize = fontSize + "px";
// 		Text.baseLineheightOnFontSizeBook(div);
// 	}
//
// 	CSS.antialiasText( div );
//
// 	return div;
// };

Text.FontFamilyMedium = "FoundersGroteskMedium";
Text.FontFamilyRegular = "FoundersGroteskRegular";
Text.FontFamilyLight = "FoundersGroteskLight";

Text.getNewMed = function( fontSize ) {
	var div	= document.createElement("div");
	div.style.position = "absolute";
	div.style.fontFamily			= Text.FontFamilyMedium;

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


// Text.heavyTreatmentDesktop = function(target) {
// 	target.style.fontSize = 24 + "px";
// 	target.style.lineHeight = 30 + "px";
// };
//
// Text.heavyTreatmentTablet = function(target) {
// 	target.style.fontSize = 20 + "px";
// 	target.style.lineHeight = 26 + "px";
// };
//
// Text.heavyTreatmentMobile = function(target) {
// 	target.style.fontSize = 16 + "px";
// 	target.style.lineHeight = 22 + "px";
// };
//
//
// Text.bookTreatmentDesktop = function(target) {
// 	target.style.fontSize = 18 + "px";
// 	target.style.lineHeight = 26 + "px";
// };
//
// Text.bookTreatmentTablet = function(target) {
// 	target.style.fontSize = 16 + "px";
// 	target.style.lineHeight = 24 + "px";
// };
//
// Text.bookTreatmentMobile = function(target) {
// 	target.style.fontSize = 15 + "px";
// 	target.style.lineHeight = 23 + "px";
// };




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
	div.style.lineHeight = parseInt(div.style.fontSize) * 1 + "px";
};
//
// Text.baseLineheightOnFontSizeMedium = function(div) {
// 	div.style.lineHeight = parseInt(div.style.fontSize) * 1.3 + "px";
// };
//
// Text.baseLineheightOnFontSizeHeavy = function(div, offset) {
// 	div.style.lineHeight = parseInt(div.style.fontSize) * (offset ? offset : 1) + "px";
// };
//
// Text.baseLineheightOnFontSizeBook = function(div, offset) {
// 	div.style.lineHeight = parseInt(div.style.fontSize) * (offset ? offset : 1.4) + "px";
// };

//
// Text.getNewText = function(font, size, color) {
// 	if( !font ) {
// 		font = "franklin-gothic-urw";
// 	}
//
// 	if( !size ) {
// 		size = 17;
// 	}
//
// 	if( !color ) {
// 		color = "#ffffff";
// 	}
//
// 	var div = document.createElement("div");
// 	div.style.position = "absolute";
//
// 	// div.style.whiteSpace = "noWrap";
// 	div.style.color = color;
// 	div.style.fontFamily = font;
// 	div.style.fontSize = size + "px";
//
// 	CSS.antialiasText(div);
//
// 	return div;
// };
