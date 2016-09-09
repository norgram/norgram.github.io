function PathManager() {
	var _instance				= new EventDispatcher();
	
	var _oldHash				= "";
	
	var _confirmChange			= false;
	var _overlayConfirm			= null;
	
	init();
	
	function init() {
		setInterval(checkHash, 1000 * .2);
	};
	
	function checkHash() {
		var newHash = getWellFormattedHash();
		
		if(_oldHash !== newHash) {
			// new path
			handlePathChange(newHash);
		}
	};
	
	function getWellFormattedHash() {
		var hash = window.location.hash;
		
		if(hash.charAt(0) === "#") {
			hash = hash.replace("#", "");
		}
		
		if(hash.charAt(0) === "/") {
			hash = hash.replace("/", "");
		}
		
		return hash;
	};
	
	_instance.reload = function() {
		handlePathChange(_oldHash);
	};
	
	_instance.confirmChange = function(value) {
		_confirmChange = value;
	};
	
	function handlePathChange(newHash) {
		// trace("path changed from '" + _oldHash + "' to '" + newHash + "'");
		
		if(_confirmChange === true) {
			addConfirmOverlay();
			return;
		}
		
		// dispatch the new path
		_instance.dispatchEvent(Actions.PATH_DECONSTRUCT_the_path.replace("the_path", _oldHash));
		_instance.dispatchEvent(Actions.PATH_CONSTRUCT_the_path.replace("the_path", newHash));
		_instance.dispatchEvent(Actions.PATH_CHANGE, {path: newHash});
		
		// remember path		
		_oldHash = newHash;
	};
	
	function addConfirmOverlay() {
		if(_overlayConfirm !== null) {
			return;
		}
		
		_overlayConfirm = new OverlayConfirm("Are you sure you want to navigate away from this page without saving?");
		CMSCore.layerOverlay.appendChild(_overlayConfirm);
		_overlayConfirm.setSelectCallback(onConfirmed);
		_overlayConfirm.init();
	};
	
	function onConfirmed(id) {
		_overlayConfirm = null;
		
		if(id !== "yes") {
			window.location.hash = _oldHash;
		} else {
			_confirmChange = false;
			checkHash();
		}
	};
	
	_instance.getPart = function(level) {
		var hash 	= getWellFormattedHash();
		var parts 	= hash.split("/");
		// trace("parts : " + parts);
		return (level < parts.length) ? parts[level] : "";
	};
	
	return _instance;
}
