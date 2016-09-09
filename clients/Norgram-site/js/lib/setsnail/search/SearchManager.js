function SearchManager() {
	var _instance			= {};
	
	var _indexing			= null;
	
	_instance.populate = function(target, searchNodes) {
		_indexing = findSearchNodes(target, searchNodes);
	};
	
	_instance.search = function(searchStr) {
		if(searchStr === null || searchStr.length < 2) {
			return [];
		}
		
		searchStr = searchStr.toLowerCase();
		
		// trace("search();");
		
		var l				= _indexing.length;
		var searchObj		= null;
		var value			= null;
		var results			= [];
		var parent			= null;
		
		// trace("l : " + l);
		for(var i = 0; i < l; i += 1) {
			searchObj = _indexing[i];
			
			value = searchObj.value;
			
			if(value.indexOf(searchStr) !== - 1) {
				var data = searchObj;
				if(!data.parent) {
					data.parent = convertNodeToTemplateNode(searchObj.node);
				}
				
				results.push(data);
				
				if(data.node.getAttribute("data-in-search") === "t") {
					continue;
				}
				
				// limit
				var l2 				= results.length;
				var oldResult 		= null;
				var hits 			= [data];
				var allowAdd		= true;
				
				for(var j = 0; j < l2; j += 1) {
					oldResult = results[j];
					
					if(oldResult.parent === data.parent) {
						hits.push(oldResult);
					}
				}
				
				while(hits.length > 2) {
					// find the shortest
					var shortest 		= 999999999999;
					var shortId 		= - 1;
					var currLength		= - 1;
					l2 = hits.length;
					
					for(var j = 0; j < l2; j += 1) {
						oldResult = hits[j];
						
						currLength = oldResult.l;
						
						if(currLength < shortest) {
							shortest = currLength;
							shortId = j;
						}
					}
					
					if(shortId !== - 1) {
						results.splice(results.indexOf(hits[shortId]), 1);
						hits.splice(shortId, 1);
					}
				}
				
			}
		}
		
		// trace("results.length : " + results.length);
		return results;
	};
	
	function convertNodeToTemplateNode(node) {
		var parent 			= node;
		var currAttr		= null;
		
		while(parent !== null) {
			if(typeof parent.getAttribute === "function") {   
				currAttr = parent.getAttribute("data-path");
		
				// trace("currAttr : " + currAttr);
				if(currAttr) {
					return parent;
				}
			}
	
			parent = parent.parentNode;
		}
	
		return node;
	}	
	
	function findSearchNodes(target, searchNodeNames /*Array*/) {
		var hits = [];
		
		collectNodes(target);
		
		function collectNodes(child) {
			var children		= child.children;
			var l				= children.length;
			var node			= null;
			var value			= null;
			
			for(var i = 0; i < l; i += 1) {
				node = children[i];
				
				if(searchNodeNames.indexOf(node.nodeName) !== - 1) {
					value = node.innerHTML;
					hits.push({value: value.toLowerCase(), node: node, l: value.length});
				}
									
				collectNodes(node);
			}
		};
		
		// trace("hits.length : " + hits.length);
	
		return hits;
	};
		
	return _instance;
};