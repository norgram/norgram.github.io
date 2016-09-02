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

	// _instance.enableAnimation = function() {
	// 	// _instance.addEventListener("mouseover", onBtnOver);
	// 	// _instance.addEventListener("mouseout", onBtnOut);
	// };
	//
	// _instance.disableAnimation = function() {
	// 	// _instance.removeEventListener("mouseover", onBtnOver);
	// 	// _instance.removeEventListener("mouseout", onBtnOut);
	// };
	//
	// function onBtnOver() {
	// 	// TweenMax.set(_instance, {x:0, scaleX:1.04});
	// }
	//
	// function onBtnOut() {
	// 	// TweenMax.to(_instance, 0.5, {x:0, scaleX:1, ease:Expo.easeOut, force3D:false});
	// }

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