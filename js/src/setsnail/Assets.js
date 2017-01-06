Assets = {};

Assets.BODY							= null;

Assets.CONTENT_LAYER				= document.createElement("div");
Assets.SCROLL_LAYER					= document.createElement("div");

Assets.LAYER_BOT					= document.createElement("div");
Assets.LAYER_MID					= document.createElement("div");
Assets.LAYER_TOP					= document.createElement("div");
Assets.LAYER_TEMPLATE				= document.createElement("div");
Assets.LAYER_TEMPLATE_OFFSET		= document.createElement("div");
Assets.LAYER_TEMPLATE_PHYCHO_OFFSET	= document.createElement("div");

Assets.SCROLL_CONTROLLER			= null;
Assets.RESIZE_MANAGER				= null;
Assets.RETINA_HANDLE				= null;
Assets.MAIN_MENU					= null;

Assets.CONTENT						= null;
Assets.CONTENT_PAGES = null;
Assets.CONTENT_GENERAL = null;

Assets.CONTENT_MENU					= null;

Assets.UPLOAD_FOLDER				= "uploads/";

Assets.setupLayers = function() {
	//Body Layer;
	Assets.BODY = document.body;
	Assets.BODY.style.backgroundColor = UIColors.WHITE;

	//Set postion for scroll and Content;
	Assets.CONTENT_LAYER.style.position = "fixed";
	Assets.CONTENT_LAYER.id = "CONTENT_LAYER";
	// Assets.SCROLL_LAYER.style.position = "absolute";

	Assets.LAYER_TEMPLATE.style.position = "absolute";
	Assets.LAYER_TEMPLATE.id = "LAYER_TEMPLATE";

	Assets.LAYER_TEMPLATE_OFFSET.style.position = "absolute";
	Assets.LAYER_TEMPLATE_OFFSET.appendChild(Assets.LAYER_TEMPLATE_PHYCHO_OFFSET);

	Assets.LAYER_TEMPLATE_PHYCHO_OFFSET.style.position = "absolute";
	Assets.LAYER_TEMPLATE_PHYCHO_OFFSET.appendChild(Assets.LAYER_TEMPLATE);

	//Layer for PageTemplates;
	Assets.LAYER_BOT.appendChild( Assets.LAYER_TEMPLATE_OFFSET );
	Assets.LAYER_MID.id = "LAYER_MID";
	Assets.LAYER_BOT.id = "LAYER_BOT";
	Assets.LAYER_TOP.id = "LAYER_TOP";

	//Content layer
	Assets.CONTENT_LAYER.appendChild( Assets.LAYER_BOT );
	Assets.CONTENT_LAYER.appendChild( Assets.LAYER_MID );
	Assets.CONTENT_LAYER.appendChild( Assets.LAYER_TOP );

	//Main layers
	Assets.BODY.appendChild( Assets.CONTENT_LAYER );
	Assets.BODY.appendChild( Assets.SCROLL_LAYER );
};





SiteGuides = {};

SiteGuides.BASE_DESIGN_WIDTH = 1455;
SiteGuides.BASE_DESIGN_HEIGHT = 900;

SiteGuides.OFFSET_TOP = 19;
SiteGuides.OFFSET_BOTOM = 15;

SiteGuides.OFFSET_CENTER = 387;
SiteGuides.MAIN_MENU_WIDTH = 42;

SiteGuides.getCenterOffset = function() {
	return SiteGuides.OFFSET_CENTER * Assets.RESIZE_MANAGER.getWindowHeight() / SiteGuides.BASE_DESIGN_HEIGHT
};

SiteGuides.getDesignWidthRatio = function() {
	return Assets.RESIZE_MANAGER.getWindowWidth() / SiteGuides.BASE_DESIGN_WIDTH;
};

SiteGuides.getDesignHeightRatio = function() {
	return Assets.RESIZE_MANAGER.getWindowHeight() / SiteGuides.BASE_DESIGN_HEIGHT;
};

SiteGuides.drawDebugLines = function() {
	function getGuide() {
		var guide = document.createElement("div");
		guide.style.position = "fixed";

		window.addEventListener("resize", resizeGuide);
		function resizeGuide() {
			guide.style.width = window.innerWidth + "px";
			guide.style.height = 1 + "px";
		}

		guide.style.backgroundColor = "#6be9eb";
		resizeGuide();

		Assets.CONTENT_LAYER.appendChild(guide);

		return guide;
	}

	//DRAW GUIDES BELOW;
	TweenMax.set( getGuide(), {y:SiteGuides.OFFSET_TOP} );

	var centerGuide = getGuide();
	var bottomGuide = getGuide();

	window.addEventListener("resize", resizeGuide);
	function resizeGuide() {
		// var ratioY = window.innerHeight / SiteGuides.BASE_DESIGN_HEIGHT;
		TweenMax.set( centerGuide, { y:SiteGuides.getCenterOffset() } );
		TweenMax.set( bottomGuide, { y:window.innerHeight - SiteGuides.OFFSET_BOTOM} );
	}

	resizeGuide();

	// TweenMax.set( getGuide(), {y:SiteGuides.OFFSET_TOP} );
};