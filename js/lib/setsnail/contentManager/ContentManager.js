
var ContentManager = {};

// public static vars
// should it automatically track the pages through Google Analytics?
ContentManager.AUTOMATICALLY_TRACK_GOOGLE_ANALYTICS 		= true;//THIS IS HARDCODED TRUE IN CODE BELOW
ContentManager.SHOW_TRACES 									= false;

// private static vars
ContentManager._activeTemplates 							= new Array();
ContentManager._templateRegister 							= new Array();
ContentManager._templateGroups 								= new Array();

ContentManager._newPath 									= "";
ContentManager._blocked 									= false;
ContentManager._defaultPath 								= "home";

ContentManager._xml 										= null;

ContentManager._prevTemplateObj 							= null;
ContentManager._passedVariables 							= null;

ContentManager.TEMPLATES_ADDED 								= 0;

ContentManager._oldPath 									= null;
ContentManager._samePathCount 								= 0;

/**
 * ----------------------------
 * PUBLIC FUNCTIONS
 * ----------------------------
 */

/**
 * Function for initializing the ContentManager
 * @param {xml} xml Is the XML used to define the site structure and XML example
 * looks like this <site><page _template="productTemplate"
 * _path="page1"></page><page _template="productTemplate"
 * _path="2"></page></site>
 */
ContentManager.init = function(xml, defaultPath) {
	ContentManager.trace("init();");

	ContentManager._xml = xml;

	// console.log(ContentManager._xml);

	if(defaultPath) {
		ContentManager._defaultPath = defaultPath;
		ContentManager.trace(ContentManager._defaultPath, "_defaultPath");
	}

	// listens for hash change
	window.addEventListener("hashchange", ContentManager.onHashChange);

	// will listen on an interval
	if(BrowserDetect.BROWSER_NAME == "Explorer" && BrowserDetect.BROWSER_VERSION <= 7) {
		ContentManager.autoCheck();
	}

	// force initial hash change
	ContentManager.onHashChange();
};

/**
 * @param {string} newPath - path for the new content that you want to navigate
 * to
 */
ContentManager.path = function(newPath) {
	var getType = typeof newPath;
	if(getType == "object") {
		newPath = ContentManager.composeFullPathFromXML(newPath);
	}

	ContentManager.trace("path();");
	ContentManager.trace(newPath, "newPath");

	window.location.hash = "/" + newPath;
};

/**
 * Function for allowing next template to be added
 * You should call this function after templateIn() and templateOut()
 *
 * @param {object} passedVars is an object with variables passed to the next
 * template
 */
ContentManager.nextTemplate = function(passedVars) {
	ContentManager.trace("nextTemplate();");

	ContentManager._passedVariables = passedVars;

	ContentManager._blocked = false;

	ContentManager.onHashChange();
};

/**
 * Function for adding templates to the ContentManager class
 *
 * The new template should be a class that has these public functions
 * newTemplate.templateIn();
 * newTemplate.templateOut();
 *
 * @param {string} templateName Is the name of the template
 * @param {object} JSClass Is the js class type
 */
ContentManager.addTemplate = function(templateName, JSClass) {
	ContentManager._templateRegister.push({
		templateName: templateName, JSClass: JSClass
	});
};

/**
 * Functionallity for grouping templates. It can be used for determining
 * transitions.
 *
 * @param {string} groupName is the name of this group
 * @param {array} group is the an array of JSClasses
 */
ContentManager.addTransitionGroup = function(groupName, group) {
	ContentManager._templateGroups.push({
		name: groupName, group: group
	});
};

/**
 * Functionallity for gettings the shared trasnition group for two templates
 *
 * @param {string} templateName1 the first template name
 * @param {string} templateName2 the second template name
 */
ContentManager.getTransitionGroup = function(templateName1, templateName2) {
	var i = null;
	var l = ContentManager._templateGroups.length;
	var groupObj = null;
	var group = null;
	var rName = null;

	for( i = 0; i < l; i += 1) {
		groupObj = ContentManager._templateGroups[i];
		group = groupObj.group;

		if(group.indexOf(templateName1) != -1 && group.indexOf(templateName2) != -1) {
			rName = groupObj.name;
			break;
		}
	}

	return rName;
};

/**
 * Returns the value of the child with data-path name corresponding to the name
 * you provide
 * @param {object} xml the node that you want to compose the full path from
 */
ContentManager.composeFullPathFromXML = function(xml) {
	var pathStep = xml.getAttribute("data-path");
	var pathSteps = new Array();
	if(pathStep) {
		pathSteps.unshift(pathStep);
	}

	var parent = xml.parentNode;
	var loops = 0;

	while(pathStep) {
		pathStep = parent.getAttribute("data-path");

		if(pathStep) {
			pathSteps.unshift(pathStep);
		}

		parent = parent.parentNode;

		loops += 1;
		if(loops > 10) {
			break;
		}
	}

	var rPath = pathSteps.join("/");
	return rPath;
};

/**
 * Function that return the total index of a node
 * @param {object} xml the node that you want to get the index from
 */
ContentManager.getTransitionIndex = function(xml) {
	// trace("ContentManager.getTransitionIndex();");
	/**
	 var pathStep = xml.getAttribute("data-path");
	 var childIndex = 0;
	 var totalIndex = 0;
	 if (pathStep)
	 {
	 childIndex = DOMUtils.getChildIndex(xml);
	 if(childIndex != - 1)
	 {
	 totalIndex += childIndex;
	 }
	 }
	 var parent = xml.parentNode;
	 var loops = 0;

	 while (pathStep)
	 {
	 pathStep = parent.getAttribute("data-path");

	 if (pathStep)
	 {
	 childIndex = DOMUtils.getChildIndex(parent);
	 if(childIndex != - 1)
	 {
	 totalIndex += childIndex;
	 }
	 }

	 parent = parent.parentNode;

	 // trace(totalIndex, "totalIndex");

	 loops += 1;
	 if (loops > 10)
	 {
	 break;
	 }
	 }

	 return totalIndex;

	 **/
}
/**
 * This function tells you if there is any available template and content for the
 * path you enter
 * @param {string} path - the path you want to check
 */
ContentManager.isContentSupported = function(path) {
	var pathXML = ContentManager.findContent(ContentManager.extractPath(path).split("/"));
	var isContentSupported = false;

	if(pathXML) {
		templateName = pathXML.getAttribute("data-template");

		if(templateName) {
			if(ContentManager.findTemplateFromName(templateName)) {
				isContentSupported = true;
			}
		}
	}

	return isContentSupported;
};

/**
 * ----------------------------
 * ON HASH CHANGE FUNCTION
 * ----------------------------
 */

/**
 * Function that runs when the window.location.has changes
 */
ContentManager.onHashChange = function() {
	ContentManager.trace("-----------------------------");

	if(ContentManager._blocked == false) {
		ContentManager._newPath = ContentManager.extractPath(window.location.hash);
		if(ContentManager._oldPath === ContentManager._newPath) {
			ContentManager._samePathCount += 1;
			if(ContentManager._samePathCount > 3) {
				console.error("ContentManager.as bug, same path is repeated! - this is a show breaker :(");
 				return;
			}
		} else {
			ContentManager._samePathCount = 0;
		}
		ContentManager._oldPath = ContentManager._newPath;

		var pathArr = ContentManager._newPath.split("/");
		var pathXML;
		var candidates = new Array();
		var templateName;
		var templateLevel;
		var templatePath;

		if(pathArr[0] == "") {
			pathArr[0] = ContentManager._defaultPath;
		}

		ContentManager.trace(pathArr, "pathArr");

		// find the add candidates
		while(pathArr.length > 0) {
			pathXML = ContentManager.findContent(pathArr);

			if(pathXML) {
				templateName = pathXML.getAttribute("data-template");

				if(templateName && ContentManager.findTemplateFromName(templateName)) {
					templateLevel = ContentManager.findTemplateLevelFromName(templateName);

					if(templateLevel === false) {
						templateLevel = pathArr.length - 1;
					}

					templatePath = pathXML.getAttribute("data-path");

					ContentManager.trace("new candidate");
					ContentManager.trace(templatePath, "templatePath");
					ContentManager.trace(templateName, "templateName");
					ContentManager.trace(templateLevel, "templateLevel");

					candidates.push({
						xml: pathXML, path: templatePath, templateName: templateName, level: templateLevel, sort: templateLevel + pathArr.length
					})
				}
			}

			pathArr.pop();
		}

		// sort candidates
		candidates		= candidates.sortOn("sort");
		var l 			= candidates.length;
		for(var i = 0; i < l; i += 1) {
			ContentManager.trace(candidates[i].templateName + " (" + candidates[i].level + ")", "sorting");
		}
		candidates.reverse();


		var i = 0;
		var l = candidates.length;
		var candidate;
		var type = "none";
		var activeTemplates = ContentManager._activeTemplates;
		var candidateLevel;

		ContentManager.trace(candidates.length, "candidates.length");

		for( i = 0; i < l; i += 1) {
			candidate = candidates[i];
			candidateLevel = candidate.level;

			if(activeTemplates[candidateLevel] == null) {
				type = "push";
			} else {
				if(activeTemplates[candidateLevel].path != candidate.path) {
					if(activeTemplates[candidateLevel].fullPath.indexOf(ContentManager.composeFullPathFromXML(candidate.xml)) === 0) {
						// ignore
					} else {
						type = "pop";
					}
				}
			}

			if(type !== "none") {
				break;
			}
		}

		if(type == "none") {
			var numberOfActiveTemplate = activeTemplates.length;

			if(l < activeTemplates.length) {
				type = "pop";
			} else if(l === numberOfActiveTemplate && numberOfActiveTemplate !== 0 && activeTemplates[numberOfActiveTemplate - 1].path !== candidate.path) {
				type = "pop";
			}
		}

		// push, pop or none
		ContentManager.trace(type, "type");

		if(type != "none" && candidate) {
			ContentManager._blocked = true;

			// remove an existing template
			if(type == "pop") {
				var oldTemplateObj = activeTemplates.pop();
				var templateData = oldTemplateObj.templateData;

				// pass on some variables
				if(ContentManager._passedVariables) {
					templateData.setPassedVariables(ContentManager._passedVariables);
					ContentManager._passedVariables = null;
				}

				// fake data for next
				var nextTemplateData = new TemplateData()
				nextTemplateData.setTemplateName(candidate.templateName);
				nextTemplateData.setLevel(candidate.level);
				nextTemplateData.setTemplatePath(candidate.path);

				templateData.setNextTemplateData(nextTemplateData);

				// save this template
				ContentManager._prevTemplateObj = oldTemplateObj;

				// call template in
				oldTemplateObj.template.templateOut();
			}
			// add new template
			else if(type == "push") {
				ContentManager.trace("push candidate");
				ContentManager.trace(candidate.path, "candidate.path");
				ContentManager.trace(candidate.templateName, "candidate.templateName");
				ContentManager.trace(candidate.level, "candidate.level");

				var JSClass = ContentManager.findTemplateFromName(candidate.templateName);

				if(JSClass) {
					// build template data
					var templateData = new TemplateData();
					templateData.setXML(candidate.xml);
					templateData.setLevel(candidate.level);
					templateData.setTemplatePath(candidate.path);
					templateData.setTemplateName(candidate.templateName);

					var fullPath = ContentManager.composeFullPathFromXML(candidate.xml);
					templateData.setTemplateFullPath(fullPath);

					if(ContentManager._prevTemplateObj) {
						templateData.setPrevTemplateData(ContentManager._prevTemplateObj.templateData);
						ContentManager._prevTemplateObj = null;
					}

					if(ContentManager._passedVariables) {
						templateData.setPassedVariables(ContentManager._passedVariables);
						ContentManager._passedVariables = null;
					}

					// build the template
					var newTemplate = new JSClass(templateData);

					templateData.setTemplate(newTemplate);
					// console.log("getLocation " + ContentManager.AUTOMATICALLY_TRACK_GOOGLE_ANALYTICS);
					// GOOGLE ANALYTICS --- TRACKING CODE START
					if( typeof ga !== null && true || ContentManager.AUTOMATICALLY_TRACK_GOOGLE_ANALYTICS === true) {
						// Google Analytics tracking
						var getLocation = "#/" + ContentManager.composeFullPathFromXML(candidate.xml);
						// ga('send', {
						//   'page': getLocation,
						//   'title': getLocation
						// });
						ga('send', "pageview", getLocation);
					}
					// GOOGLE ANALYTICS --- TRACKING CODE END

					// save in the active template list
					var newTemplateObj = {
						template: newTemplate, path: candidate.path, templateName: candidate.templateName, fullPath: fullPath, xml: candidate.xml, templateData: templateData
					};

					ContentManager._prevTemplateObj = newTemplateObj;
					activeTemplates.push(newTemplateObj);

					// call template in
					ContentManager.TEMPLATES_ADDED += 1;
					newTemplate.templateIn();
				} else {
					// template was not found
					ContentManager._blocked = false;

					trace("ContentManger.js unable to find template");
				}
			}
		}
	}
};

/**
 * ----------------------------
 * INTERNAL HELPING FUNCTIONS
 * ----------------------------
 */

/**
 * Functions that finds a node based on the path
 *
 * @param {array} pathArr - path array
 */
ContentManager.findContent = function(pathArr) {
	var pathArrClone = ContentManager.cloneArray(pathArr);
	var searchPath = pathArrClone[0];
	var rXML = ContentManager._xml;
	var currPath = "";
	var currXML;
	var i;
	var l;
	var found = false;
	var xmlChildren;
	var loop = 0;
	var level = 0;

	while(searchPath) {
		xmlChildren = rXML.children;
		l = xmlChildren.length;

		for( i = 0; i < l; i += 1) {
			currXML = xmlChildren[i];
			currPath = currXML.getAttribute("data-path");

			if(currPath == searchPath) {
				pathArrClone.shift();
				searchPath = pathArrClone[0];
				rXML = currXML;
				found = true;

				level += 1;
				break;
			}
		}

		if(!found || !searchPath || loop > 10) {
			searchPath = null;
		}

		loop += 1;
	}

	if(level != pathArr.length) {
		rXML = null;
	}

	return rXML;
};

/**
 * Function that returns a path which is formatted the correct way for
 * ContentManager.js. So if you pass http://www.hellomonday.com/#/this/is/path
 * you will get this/is/path
 *
 * @param {string} str - the path which should be converted
 */
ContentManager.extractPath = function(str) {
	var arr1 = str.split("#");
	var arr2 = arr1[arr1.length - 1].split("/");
	var arr3 = new Array();
	var l = arr2.length;
	var i;
	var currPart;
	for( i = 0; i < l; i += 1) {
		currPart = arr2[i];
		if(currPart !== null && currPart !== "") {
			arr3.push(currPart);
		}
	}
	var newPath = arr3.join("/");
	return newPath;
};

/**
 * Function that looks in the template register for a JSClass which matches the
 * template name
 *
 * @param {string} templateName - name of the template that you want to find
 */
ContentManager.findTemplateFromName = function(templateName) {
	var i;
	var register = ContentManager._templateRegister;
	var l = register.length;
	var regObj;
	var JSClass;

	for( i = 0; i < l; i += 1) {
		regObj = register[i];

		if(regObj.templateName == templateName) {
			JSClass = regObj.JSClass;
			break;
		}
	}

	return JSClass;
};

/**
 * Function will find the template level from the template name
 *
 * If there is a number in the end of the template name it will use that number
 * image-template-2 will give level 2
 *
 * @param {string} templateName - name of the template that you want to calculate
 * from
 */
ContentManager.findTemplateLevelFromName = function(templateName) {
	var rLevel = false;
	var levelFromTemplateName = templateName.match(/\d+/);

	if(levelFromTemplateName) {
		rLevel = levelFromTemplateName;
	}

	return rLevel;
};

/**
 * When this functions initiated the ContentManager.js will look for changes in
 * window.location.has value on an interval instead of waiting for an change
 * event
 */
ContentManager.autoCheck = function() {
	ContentManager.trace("autoCheck();");

	var lastPath = window.location.hash;
	var checkInterval = .2;

	setTimeout(checkHash, 1000 * checkInterval);

	function checkHash() {
		var newPath = window.location.hash;

		if(newPath != lastPath) {
			lastPath = newPath;
			ContentManager.onHashChange();
		}

		setTimeout(checkHash, 1000 * checkInterval);
	}

};

/**
 * Functions for cloning an array
 *
 * @param {object} arr - the array that you want to clone
 */
ContentManager.cloneArray = function(arr) {
	var i;
	var l = arr.length;
	var rArr = new Array();

	for( i = 0; i < l; i += 1) {
		rArr.push(arr[i]);
	}

	return rArr;
};

ContentManager.getChildByAttr = function(xml, attr, value) {
	var i;
	var children = xml.children;
	var l = children.length;
	var child;
	var rVal = null;

	for( i = 0; i < l; i += 1) {
		child = children[i];

		// trace("child.getAttribute('data-name') : " + child.getAttribute("data-name"));

		if(child.getAttribute("data-" + attr) == value) {
			rVal = child;
			break;
		}
	}

	return rVal;
};

ContentManager.getFirstChildWithAttr = function(xml, attr) {
	var i;
	var children = xml.children;
	var l = children.length;
	var child;
	var rVal;

	for( i = 0; i < l; i += 1) {
		child = children[i];

		// trace("child.getAttribute('data-name') : " + child.getAttribute("data-name"));

		if(child.getAttribute("data-" + attr)) {
			rVal = child;
			break;
		}
	}

	return rVal;
};

ContentManager.getChildIndex = function(xml, arr /* null */) {
	var i;
	var children = arr ? arr : xml.parentNode.children;
	var l = children.length;
	var child;

	for( i = 0; i < l; i += 1) {
		child = children[i];
		if(child === xml) {
			return i;
		}
	}

	return - 1;
};

ContentManager.getChildrenByAttr = function(xml, attr, value) {
	var i;
	var children = xml.children;
	var l = children.length;
	var child;
	var rVal = [];

	for( i = 0; i < l; i += 1) {
		child = children[i];

		// trace("child.getAttribute('data-name') : " + child.getAttribute("data-name"));

		if(child.getAttribute("data-" + attr) == value) {
			rVal.push(child);
		}
	}

	return rVal;
};

ContentManager.getElementByTagName = function(xml, tagName) {
	return xml.getElementsByTagName(tagName)[0];
};

ContentManager.getAllChildrenByBackwardsWithAttribute = function(target, name) {
	var parent 			= target;
	var children		= [];
	var currAttr		= null;

	while(parent !== null) {
		if(typeof parent.getAttribute === "function") {
			currAttr = parent.getAttribute("data-" + name);

			if(currAttr) {
				children.unshift(parent);
			}
		}

		parent = parent.parentNode;
	}

	return children;
};

/**
 * Traces from ContentManager.js. Can be turned of with SHOW_TRACES variable
 */
ContentManager.trace = function(what, where) {
	if(ContentManager.SHOW_TRACES) {
		if(!where) {
			where = "";
		}

		trace(what, "ContentManager.js " + where);
	}
};
