ArrayUtils = {};

ArrayUtils.combine = function(array1, array2) {
	var i		;
	var l		= array2.length;

	for(i = 0; i < l; i += 1) {
		array1.push(array2[i]);
	}
};

ArrayUtils.combineViaKey = function(array1, array2, array2Key) {
	var i		;
	var l		= array2.length;

	for(i = 0; i < l; i += 1) {
		array1.push(array2[i][array2Key]);
	}
};

ArrayUtils.callFunctionOnArray = function(items, functionName) {
	var item		;
	var l			= items.length;
	var i			;

	for(i = 0; i < l; i += 1) {
		item = items[i];
		item[functionName]();
	}
};

ArrayUtils.passItemsInArrayToFunction = function(items, callback, params, startIndex) {
	if(!startIndex) {
		startIndex = 0;
	}

	var item				;
	var l					= items.length;
	var i					;

	if(!params) {
		params = {item: null};
	}

	for(i = startIndex; i < l; i += 1) {
		item = items[i];

		if(callback.length) {
			params.item = item;
			callback(params);
		} else {
			callback();
		}
	}
};

ArrayUtils.sortAlphabeticalOnKey = function(array, key) {
	var newArray = array.sort(alphabetical);

	function alphabetical(a, b) {
	     var A = a[key].toLowerCase();
	     var B = b[key].toLowerCase();
	     if (A < B){
	        return -1;
	     }else if (A > B){
	       return  1;
	     }else{
	       return 0;
	     }
	};

	return newArray;
};

ArrayUtils.getClone = function(array) {
	var i		;
	var l		= array.length;
	var rArr	= [];

	for(i = 0; i < l; i += 1) {
		rArr.push(array[i]);
	}

	return rArr;
};


ArrayUtils.removeEmpty = function(array) {
	var i		;
	var l		= array.length;
	var value	= null;
	var rArr	= [];


	for(i = 0; i < l; i += 1) {
		value = array[i];

		if(value !== "") {
			rArr.push(value);
		}
	}

	return rArr;
};

ArrayUtils.getUnique = function(arr) {
    var a 			= [];
    var l			= arr.length;
    var target		= null;

    for (var i = 0; i < l; i += 1) {
    	target = arr[i];
		if (a.indexOf(target) === -1 && target !== '') {
		    a.push(target);
		}
    }
    return a;
};

ArrayUtils.getUniqueString = function( arr, caseSensitive ) {
	if( caseSensitive === null ){ caseSensitive = true; }

    var a 			= [];
    var b 			= [];
    var l			= arr.length;
    var target		= null;
    var manipTarget	= null;

    for (var i = 0; i < l; i += 1) {
    	target = arr[i];

    	if( !caseSensitive ){
    		manipTarget = target.toUpperCase();
    	} else {
			manipTarget = target;
    	}

    	//Remove spaces;
    	manipTarget = manipTarget.replace(/\s+/g, '');

		if (a.indexOf(manipTarget) === -1 && manipTarget !== '') {
		    a.push( manipTarget );
		    b.push( target );
		}
    }
    return b;
};

ArrayUtils.shuffle = function(arr) {
	// trace("ArrayUtils.shuffle();");
    var newArray		= [];
    var l				= arr.length;
    var target			= null;
    var pickId			= 0;

    while(arr.length > 0) {
    	pickId = Math.floor(Math.random() * arr.length);
    	target = arr[pickId];
    	arr.splice(pickId, 1);
    	newArray.push(target);
    }
    return newArray;
};

