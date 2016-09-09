function MenuSelector(data, guides) {

	var _instance = document.createElement("div");
	_instance.style.position = "absolute";

	var _menuBtns = [];

	_instance.init = function () {
		addMenuPoints();

		guides.addEventListener( GuideLines.ON_UPDATE, updateLayout );
		updateLayout();
	};

	function updateLayout() {
		TweenMax.set( _instance, {y:SiteGuides.getCenterOffset() - 1, x:guides.getGuide("start") } );
	}

	function addMenuPoints() {
		var l = data.children.length;
		var yPos = 0;

		for (var i = 0; i < l; i++) {
			var name = ContentManager.getChildByAttr(data.children[i], "name", "menu");
			if (name == undefined) {
				continue;
			}

			var btn = new TextButton( Text.getNewLight(50), UIColors.WHITE, data.children[i].getAttribute("data-path") );
			btn.init();
			btn.addClass("sliding-white");
			btn.setText(name.innerHTML);
			// btn.enableAnimation();

			TweenMax.set(btn, {y:yPos});
			yPos += 50;

			_instance.appendChild(btn);
			_menuBtns.push(btn);
		}

	}

	return _instance;
}