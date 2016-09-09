function MenuSocial(data, guides) {

	var _instance = document.createElement("div");
	_instance.style.position = "absolute";

	var _menuBtns = [];

	_instance.init = function () {
		addMenuPoints();

		guides.addEventListener( GuideLines.ON_UPDATE, updateLayout );
		updateLayout();
	};

	function updateLayout() {
		TweenMax.set( _instance, {y:SiteGuides.getCenterOffset() + 220, x:guides.getGuide("start") } );
	}

	function addMenuPoints() {
		var l = data.children.length;
		var yPos = 0;

		for (var i = 0; i < l; i++) {
			var btn = new TextButton(Text.getNewLight(13), UIColors.FONT_MED_ON_WHITE);
			btn.setText(data.children[i].innerHTML);
			btn.setPath(data.children[i].getAttribute("data-link"));
			btn.addClass( "sliding-grey-small" );

			btn.init();

			TweenMax.set(btn, {y:yPos});
			yPos += 15;

			_instance.appendChild(btn);
			_menuBtns.push(btn);
		}

	}

	return _instance;
}

