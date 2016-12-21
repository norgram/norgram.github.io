function MenuLogo(  ) {

	var _instance = document.createElement("div");
	_instance.style.position = "absolute";

	_instance.onLoadingDone = null;

	// _instance.style.backgroundColor = UIColors.BRIGHT;

	var _logoIn = new RetinaImage( "assets/images/logo/menu_logo_black.png", Assets.RETINA_HANDLE, onLogoLoaded );
	var _logoOut = new RetinaImage( "assets/images/logo/menu_logo_white.png", Assets.RETINA_HANDLE, onLogoLoaded );

	var _ratio = 0;

	_instance.init = function() {
		_logoIn.init();
		_logoOut.init();
		_logoIn.setPosition("center/center");
		_logoOut.setPosition("center/center");

		_instance.appendChild(_logoIn);
		_instance.appendChild(_logoOut);

		updateVisiblility();
	};

	_instance.setRatio = function(ratio) {
		_ratio = ratio;
		updateVisiblility();
	};

	function onLogoLoaded() {
		// console.log( "Loaded" );
		updateVisiblility();
	}

	function updateVisiblility() {
		if( _ratio > 0.5) {
			_logoIn.style.display = "inline";
			_logoOut.style.display = "none";
		} else {
			_logoIn.style.display = "none";
			_logoOut.style.display = "inline";
		}
	}

	return _instance;
}
