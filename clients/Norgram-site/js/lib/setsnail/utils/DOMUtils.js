DOMUtils = {};

DOMUtils.getContentByClassName = function(matchClass) {
    var elems 			= document.getElementsByTagName("*");
    var i				;
    var hits			= new Array();
    var element			;
    
    for (i in elems) {
    	element = elems[i];
    	
        if((' ' + element.className + ' ').indexOf(' ' + matchClass + ' ') > -1) {
        	hits.push(element);
        }
    }
    return hits;
};

DOMUtils.getChildIndex = function(p_element)
{
	// trace("DOMUtils.getChildIndex();");
	
	if(!p_element)
	{
		// trace("p_element is null");
		return - 1;
	}
	
	var useParent = p_element.parentNode;
	
	if(!useParent)
	{
		// trace("parent was not found");
		return - 1;
	}
	
	var children = useParent.children;
	var length = children.length;
    for (var i = 0; i < length; i++) {
 		// trace(i, "i");
        if (children[i] === p_element) {
 			// trace("found");
            return i;
        }
    }
}

DOMUtils.getOffset = function ( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        // chrome/safari
        if (el.parentNode) {
            el = el.parentNode;
        } else {
            // firefox/IE
            el = el.offsetParent;
        }
    }
    return { top: _y, left: _x };
}
