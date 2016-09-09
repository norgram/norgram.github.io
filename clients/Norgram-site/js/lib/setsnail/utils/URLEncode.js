URLEncode = {};

URLEncode.decode = function(data) {
	trace(data);
	var object			= {};
	var array	 		= data.split("&");
	var l				= array.length;
	var i				;
	var values			;
	var key				;
	
	for(i = 0; i < l; i += 1) {
		values = array[i].split("=");
    	object[values[0]] = values[1];
    }
    	
	return object;
};

URLEncode.encode = function(data) {
	var array	 		= [];
	var value			;
	var key				;
	
	for (key in data) {
		value = data[key];
		
		array.push(key + "=" + value);
	}
	
	return array.join("&");
};

