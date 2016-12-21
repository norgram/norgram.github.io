StringUtils = {};

StringUtils.toTitleCase = function(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

StringUtils.limitToNumberOfChars = function( str, limit, end ) {
	var l 				= str.length;
	if( l < limit ) { return str; }

	var letters 		= 0;
	for( var i = 0; i < l; i++ ) {
		// Ignore html tags
		if( str.charAt( i ) == "<" ) {
			while( str.charAt( i ) !== ">" ) {
				i++;
				if( i >= l ){ return str; }
			}
		}

		letters++;
		if( letters >= limit ) {
			// Limit reached, strip rest and place ending
			return str.substring( 0, i ) + end;
		}
	}

    return str;
};

StringUtils.stripToNumbers = function( value ){
	return value.replace(/[^0-9.]/g, "");
}

StringUtils.firstToUpperCase = function(str) {
	str = str.toLowerCase();
    return str.charAt(0).toUpperCase() + str.slice(1);
};

StringUtils.replaceAll = function(str, find, replace) {
	return str.replace(new RegExp(find, 'g'), replace);
};

StringUtils.searchRight = function(str, index, limit, end) {
	var l				= str.length;
	var rStr			= "";
	var currChar		= null;
	var tagOpen			= false;
	var charNumber		= 0;

	for(var i = index; i < l; i += 1) {
		currChar = str.charAt(i);
		if(currChar === "<") {
			tagOpen = true;
		}

		if(tagOpen === true && currChar === ">") {
			tagOpen = false;
		}

		rStr += currChar;

		if(charNumber > limit && tagOpen === false) {
			break;
		}

		charNumber += 1;
	}

	if(charNumber > limit) {
		rStr += end;
	}

	return rStr;
};

StringUtils.searchLeft = function(str, index, limit, end) {
	var rStr			= "";
	var currChar		= null;
	var tagOpen			= false;
	var charNumber		= 0;

	for(var i = index; i > - 1; i -= 1) {
		currChar = str.charAt(i);
		if(currChar === ">") {
			tagOpen = true;
		}

		if(tagOpen === true && currChar === "<") {
			tagOpen = false;
		}

		rStr = currChar + rStr;

		if(charNumber > limit && tagOpen === false) {
			break;
		}

		charNumber += 1;
	}

	if(charNumber > limit) {
		rStr = end + rStr;
	}

	return rStr;
};

StringUtils.linkify = function(text) {
    var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    //var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url, b, c) {
//        trace("url : " + url);
        var arr = url.split("<br>");
        url = arr[0];
        arr[0] = "";

        var url2 = (c == 'www.') ?  'http://' +url : url;

//        trace("url2 : " + url2);
        var finalLink = decodeURIComponent(url2.replace(/\+/g,  " "));

        finalLink = StringUtils.replaceAll(finalLink, "​", "");

//        trace("finalLink : " + finalLink);

        return '<a href="' + finalLink + '" target="_blank">' + url + '</a>' + arr.join("<br>");
    })
};

StringUtils.removeTag = function( str, tag ) {
    var a, parent, div = document.createElement('div');
    div.innerHTML = str;
    a = div.getElementsByTagName( tag );
    while( a[0] ) {
        parent = a[0].parentNode;
        while (a[0].firstChild) {
            parent.insertBefore(a[0].firstChild, a[0]);
        }
        parent.removeChild(a[0]);
    }
	return div.innerHTML;
}

StringUtils.removeTags = function(str) {
    return str.replace(/(<([^>]+)>)/ig, "");
};
