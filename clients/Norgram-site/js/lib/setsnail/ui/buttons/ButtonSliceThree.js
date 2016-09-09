function ButtonSliceThree( text, leftUrl, centerUrl, rightUrl, retinaHandler ) {

	var _instance = Snail.extend( new ImageSliceThree( leftUrl, centerUrl, rightUrl, retinaHandler ) );

	var _text = text;
	var _field = _instance.fieldInstance = Text.getNewText( "brandon_grotesque_regularRg", 22 );
	_field.style.position = "absolute";
	_field.style.textAlign = "center";
	_field.innerHTML = _text;
	_field.style.color = "#000";
	_field.style.wordWrap = "noWrap";
	_instance.style.cursor = "pointer";

	_instance.setText = function( value ) {
		_text = value;
	};
	
	_instance.allImagesLoaded = function(){
		_instance.super.allImagesLoaded();
		
		_field.style.width = _instance.getWidth() + "px";
		_field.style.height = _instance.getHeight() + "px";
		_instance.appendChild(_field);	
	};

	return _instance;
};
