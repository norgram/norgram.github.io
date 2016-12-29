
function post(filename, data, post, reponseFunction, decodeReply, params) {
    var ajax;
    if (window.XMLHttpRequest) {
        ajax = new XMLHttpRequest();//IE7+, Firefox, Chrome, Opera, Safari
    } else if (ActiveXObject("Microsoft.XMLHTTP")) {
        ajax = new ActiveXObject("Microsoft.XMLHTTP"); // IE6/5
    } else if (ActiveXObject("Msxml2.XMLHTTP")) {
        ajax = new ActiveXObject("Msxml2.XMLHTTP"); // other
    } else {
        alert("Error: Your browser does not support AJAX.");
        return false;
    }
    
    ajax.onreadystatechange=function() {
        if (ajax.readyState==4&&ajax.status==200) {
        	if(reponseFunction) {
        		trace("ajax.responseText : " + ajax.responseText);
          		reponseFunction((decodeReply === true) ? decode(ajax.responseText) : ajax.responseText, params);
        	}
        }
    };
    
	if (post == false) {
		trace(data);
	    ajax.open("GET", filename + "?" + URLEncode.encode(data), true);
	    ajax.send(null);
	} else {
	    ajax.open("POST", filename, true);
		ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	    ajax.send(URLEncode.encode(data));
	}
    return ajax;
}