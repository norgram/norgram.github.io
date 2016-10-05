function TextButton( text, color, path ) {
	var _instance = Touchable.apply( text );

	CSS.makeUnselectable(_instance);

	_instance.style.cursor = "pointer";
	_instance.style.color = color ? color : "#fff";

	var _path = path ? path : "";

	_instance.init = function() {
		text.style.top = -Text.getOffsetY(text) + "px";
		_instance.onClick(onBtnClick);
	};

	_instance.addClass = function( effect ) {
		text.setAttribute("class", effect);
	};

	_instance.setText = function(text) {
		_instance.innerHTML = text;
	};

	_instance.setPath = function(path) {
		_path = path;
	};

	function onBtnClick() {
		if(_path != "") {
			if(_path.indexOf("http") != -1) {
				window.open(_path);
			} else {
				window.location.hash = "/" + _path + "/";
			}
		}
	}

	return _instance;
}