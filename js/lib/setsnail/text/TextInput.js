function TextInput( defaultText ) {
	var _instance = document.createElement( "input" );
	_instance.style.position = "absolute";
	
	_instance.value = defaultText;
	
	var _onChange;
	var _preValue = "";

	_instance.maxChars = -1;
	_instance.restrict = "";

	init( );

	function init( ) {
		_instance.style.border = "none";
		_instance.style.fontFamily = "Arial";
		_instance.style.fontSize = "14px";
		_instance.style.margin = 0;
		_instance.style.padding = 0;
		_instance.style.boxSizing = "border-box";
		_instance.style.color = "#7c7c7c";
		_instance.style.resize = "none";
		_instance.style.outline = "0px !important";
		_instance.style.webkitAppearance = "none";
		_instance.style.lineHeight = "20px";
		_instance.style.letterSpacing = "0.5px";
		_instance.style.marginBottom = -3 + "px";

		//EVENTS AND CALLBACKS
		_instance.onkeypress = onKeyPress;
		_instance.onfocus = fieldFocus;
		_instance.onblur = fieldFocusOff;
	};
	
	function fieldFocus(){
		if(_instance.value == defaultText){
			_instance.value = "";
		}
		document.addEventListener( "keyup", onKeyUp );
	};
	
	function fieldFocusOff(){
		if(_instance.value == ""){
			_instance.value = defaultText;
		}
		document.removeEventListener( "keyup", onKeyUp );
	};

	function onKeyPress( e ) {
		if(_instance.value == defaultText){
			_instance.value = "";
		}
		
		return validate( e );
	}

	function validate( e ) {
		var lengthValid = _instance.maxChars == -1 ? true : _instance.value.length < _instance.maxChars;
		return lengthValid && validateChar( e );
	};

	function validateChar( event ) {
		if( !_instance.restrict.length ) {
			return true;
		}

		var charCode = ( typeof event.which == "number" ) ? event.which : event.keyCode;
		var character = String.fromCharCode( charCode );

		if( charCode === 8 || charCode === 0 ) {
			return true;
		} else if( _instance.restrict.indexOf( character ) === -1 ) {
			return false;
		}
		return true;
	};

	function onKeyUp( e ) {
		correct( );
		if( _onChange && _preValue != _instance.value ) {
			_preValue = _instance.value;
			_onChange( _instance.value );
		}
	};

	function correct( ) {
		if(_instance.value == defaultText){
			return;
		}
		
		var sentence = _instance.value;
		var l = sentence.length;
		var i;
		var validStr = "";
		var currChar = null;

		for( i = 0; i < l; i += 1 ) {
			currChar = sentence.charAt( i );

			if( _instance.restrict.indexOf( currChar ) !== -1 ) {
				validStr += currChar;
			}
		}

		if( validStr != _instance.value ) {
			_instance.value = validStr;
		}
	};

	_instance.onChange = function( callback ) {
		_onChange = callback;
	};

	return _instance;
}
