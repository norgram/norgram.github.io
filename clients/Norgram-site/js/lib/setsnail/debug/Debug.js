
Debug = {};

Debug.isLocalhost = function() {
	var href = window.location.href;
	
	if(	href.indexOf("localhost") !== - 1 ||
		href.indexOf("172") !== -1 ||
		href.indexOf("192") !== -1 ||
		href.indexOf("10") !== -1 ){
		return true;
	}


	return false;
};
