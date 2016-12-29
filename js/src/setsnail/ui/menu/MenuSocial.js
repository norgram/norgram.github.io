function MenuSocial(data, guides) {

	var _instance = document.createElement("div");
	_instance.style.position = "absolute";

	var _menuBtns = [];

	_instance.init = function () {
		addMenuPoints();
		Assets.RESIZE_MANAGER.addEventListener( ResizeEvents.RESIZE, onResize );
		onResize();
	};


	function onResize() {
		var fontSize = 50 * SiteGuides.getDesignHeightRatio();
		if(fontSize < 26) {
			fontSize = 26;
		}
		var centerOffset = fontSize * 3 + 80 * SiteGuides.getDesignHeightRatio();

		TweenMax.set( _instance, {y:SiteGuides.getCenterOffset() + centerOffset, x:guides.getGuide("start") } );

		var l = _menuBtns.length;
		var yPos = 0;

		for (var i = 0; i < l; i++) {
			var btn = _menuBtns[i];

			var fontSize = 16 * SiteGuides.getDesignHeightRatio();
			if(fontSize < 16) {
				fontSize = 16;
			}

			btn.style.fontSize = fontSize + "px";
			btn.updateLineHeight();

			TweenMax.set(btn, {y:yPos});
			yPos += fontSize + 2 * SiteGuides.getDesignHeightRatio();
		}

	}

	function addMenuPoints() {
		var l = data.children.length;
		var yPos = 0;

		for (var i = 0; i < l; i++) {
			var btn = new TextButton(Text.getNewLight(16), UIColors.FONT_MED_ON_WHITE);
			btn.setText(data.children[i].innerHTML);
			btn.setPath(data.children[i].getAttribute("data-link"));
			btn.addClass( "animate" );

			btn.init();

			TweenMax.set(btn, {y:yPos});
			yPos += 18;

			_instance.appendChild(btn);
			_menuBtns.push(btn);
		}

	}

	return _instance;
}

