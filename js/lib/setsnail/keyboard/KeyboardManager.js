function KeyboardManager() {
	var _instance				= new EventDispatcher();
	
	init();
	
	function init() {
		document.onkeydown = onKeyDown;
		document.onkeyup = onKeyUp;		
	};
	
	function onKeyDown(e) {
		_instance.dispatchEvent(KeyboardEvents.KEY_DOWN, e);
	};
	
	function onKeyUp(e) {
		_instance.dispatchEvent(KeyboardEvents.KEY_UP, e);
	};
	
	return _instance;
}
