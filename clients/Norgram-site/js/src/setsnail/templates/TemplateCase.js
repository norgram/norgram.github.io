function TemplateCase( data ) {
	var _instance							= Snail.extend( new PageTemplate( data ) );
	_instance.style.backgroundColor         = UIColors.DRAK_GRAY;

	var _guides								= null;

	_instance.init = function() {
		_instance.super.init();
		trace("INIT TemplateCase");
	};

	// _instance.init = function() {
	// 	_instance.super.init();

	// 	var desktop = new GuideLines(1680 - Assets.MAIN_MENU.menuOffsetW);
	// 	desktop.addGuide("guide-1", 116);
	// 	desktop.addGuide("guide-2", 794);
	// 	desktop.addGuide("guide-3", 1468);

	// 	var mobile = new GuideLines(1680);
	// 	mobile.addGuide("guide-1", 116);
	// 	mobile.addGuide("guide-2", 794);
	// 	mobile.addGuide("guide-3", 1468);

	// 	_guides = new GuidelineCollection(1680);
	// 	_guides.add("desktop", desktop);
	// 	_guides.add("tablet", desktop);
	// 	_guides.add("mobile", mobile);

	// 	setupAndAddModules();

	// 	_instance.onResize();
	// };

	_instance.templateIn = function() {
		_instance.init();
		_instance.super.templateIn();
	};

	// _instance.onResize = function() {
	// 	_instance.super.onResize();
	// 	_guides.set( Assets.RESIZE_MANAGER.getBreakPoint() );
	// 	if(Assets.RESIZE_MANAGER.getBreakPoint() === "mobile") {
	// 		var marginX = 20;
	// 		_guides.setGuide("guide-1", marginX);
	// 		_guides.setGuide("guide-3", _instance.visibleWidth - marginX);
	// 	} else {
	// 		_guides.setWidth(_instance.visibleWidth);
	// 	}
	// 	_instance.super.resizeModules();
	// };

	// function setupAndAddModules() {
	// 	_instance.addModule(new PageHeaderHome(_guides, data.getElementByTagName("h1").innerHTML, data.getElementByTagName("p").innerHTML));

	// 	var blogTemplate 			= ContentManager.getChildByAttr(data.getXML().parentNode, "template", "blog-0");
	// 	var blogPostTemplates 		= ContentManager.getChildrenByAttr(blogTemplate, "template", "blog-post-0");

	// 	var featured = new HomeFeaturedBlogPosts(_guides, blogPostTemplates, [3, 3, 1], ["25%", "25%", "66%"], null, 3);
	// 	featured.buttonCTAText = "Se mere på bloggen";
	// 	_instance.addModule(featured);

	// 	_instance.addModule(new HomePraktikReference(_guides, data));
	// 	_instance.addModule(new HomeOtherReferences(_guides, data));
	// }

	return _instance;
}
