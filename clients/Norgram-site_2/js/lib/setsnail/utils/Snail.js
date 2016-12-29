Snail = {};

Snail.saveSuperMethodsIgnoreList = [
	"insertAdjacentHTML",
	"insertAdjacentText",
	"click",
	"insertAdjacentElement",
	"getAttribute",
	"setAttribute",
	"removeAttribute",
	"getAttributeNode",
	"getElementsByTagName",
	"hasAttributes",
	"getAttributeNS",
	"setAttributeNS",
	"removeAttributeNS",
	"getElementsByTagNameNS",
	"getAttributeNodeNS",
	"hasAttribute",
	"hasAttributeNS",
	"focus",
	"blur",
	"scrollIntoView",
	"scrollIntoViewIfNeeded",
	"scrollByLines",
	"scrollByPages",
	"getElementsByClassName",
	"querySelector",
	"querySelectorAll",
	"webkitMatchesSelector",
	"webkitCreateShadowRoot",
	"getClientRects",
	"getBoundingClientRect",
	"webkitRequestPointerLock",
	"remove",
	"setAttributeNode",
	"removeAttributeNode",
	"setAttributeNodeNS",
	"webkitRequestFullScreen",
	"webkitRequestFullscreen",
	"insertBefore",
	"replaceChild",
	"removeChild",
	"appendChild",
	"hasChildNodes",
	"cloneNode",
	"normalize",
	"isSupported",
	"lookupPrefix",
	"isDefaultNamespace",
	"lookupNamespaceURI",
	"isSameNode",
	"isEqualNode",
	"compareDocumentPosition",
	"contains",
	"addEventListener",
	"removeEventListener",
	"dispatchEvent"
];

Snail.extend = function(extendClasss) {
	var superObj = {};
	// var all = "";
	for (var method in extendClasss) {
		if(typeof extendClasss[method] == "function") {
			// ignore this method
			if(Snail.saveSuperMethodsIgnoreList.indexOf(method) !== - 1) {
				continue;
			}
			
			superObj[method] = extendClasss[method];
			
			// all += '"' + method + '"'+ ",";
		}
	}
	// trace(all);
	extendClasss["super"] = superObj;
	
	return extendClasss;
};