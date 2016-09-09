function FooterExperience( likePage ) {

	const HEIGHT = 50;

	var _instance = document.createElement( "div" );
	_instance.style.position = "absolute";
	_instance.style.backgroundColor = "#FFFFFF";

	var _social				= null;
	var _exp				= null;
	var _experimentCover	= null;

	_instance.init = function( ) {
		_instance.style.top = - HEIGHT + "px";
		addExpImage( );
		addCover();
		addSocials( );
		
		Assets.RESIZE_MANAGER.addEventListener( ResizeEvents.RESIZE, onResize );
		onResize( );
		
		TweenMax.to(_instance, 1, {delay: 1.5, top: 0, ease: Expo.easeInOut});
	};

	function addSocials( ) {
		likePage = likePage ? likePage : "http://www.setsnail.com/message/";
		
		_social = new SocialMenu( "../", likePage );
		_social.style.left = "20px";
		_social.style.top = Math.floor( HEIGHT * .5 - 10 ) + "px";
		_instance.appendChild( _social );
		_social.init( );
	};

	function addExpImage( ) {
		_exp = new RetinaImage( "../" + "assets/images/ui/footer-exp.png", Assets.RETINA_HANDLE );
		_exp.addEventListener( "click", onExpClick );
		_exp.style.cursor = "pointer";
		_instance.appendChild( _exp );
		_exp.init( );
	};

	function addCover() {
		_experimentCover = document.createElement("div");
		_experimentCover.style.position = "absolute";
		_experimentCover.style.backgroundColor = "#ffffff";
		_experimentCover.style.height = HEIGHT + "px";
		_instance.appendChild(_experimentCover);
	};
	
	function onExpClick( ) {
		window.open("http://www.setsnail.com/", "_self");
	};

	function onResize( ) {
		var width = Assets.RESIZE_MANAGER.getWindowWidth( );
		var height = Assets.RESIZE_MANAGER.getWindowHeight( );
		
		var logoX = width - 249 - 20;
		
		_experimentCover.style.left = logoX + "px";
		if(width < 550) {
			_experimentCover.style.width = 210 + "px";
		} else {
			_experimentCover.style.width = 0 + "px";
		}
		
		_instance.style.width = width + "px";
		_instance.style.height = HEIGHT + "px";
		_exp.style.left = logoX + "px";
		_exp.style.top = Math.floor(HEIGHT * .5) - 14 + "px";
	};

	return _instance;
}
