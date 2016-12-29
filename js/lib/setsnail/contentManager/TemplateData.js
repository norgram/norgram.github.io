function TemplateData()
{
	var _class = {};

	var _xml;
	var _level;
	var _passedVariables;

	var _templateName;
	var _templatePath;
	var _templateFullPath;

	var _nextTemplateData;
	var _prevTemplateData;

	var _template;

	/**
	 * Returns the templates content node
	 */
	_class.getXML = function()
	{
		return _xml;
	};

	/**
	 * Returns the level that the template was added in
	 */
	_class.getLevel = function()
	{
		return _level;
	};

	_class.getChildByAttr = function( attr, value ) {
		return ContentManager.getChildByAttr( _xml, attr, value );
	};

	_class.getAttribute = function(name) {
		return _xml.getAttribute("data-" + name);
	};

	_class.getChildrenByAttr = function( attr, value ) {
		return ContentManager.getChildrenByAttr( _xml, attr, value );
	};

	_class.getHtmlByAttr = function( attr, value ) {
		return _class.getChildByAttr( attr, value ) ? _class.getChildByAttr( attr, value ).innerHTML : "";
	};

	_class.getElementByTagName = function(tagName) {
		return ContentManager.getElementByTagName(_xml, tagName);
	};

	_class.getIndex = function() {
		return ContentManager.getChildIndex(_xml);
	};

	/**
	 * Returns a specific passed variable
	 * @param {string} name - the name of the value in the object of passed variables will return "undefined" if not set
	 */
	_class.getPassedVariablesByName = function(name)
	{
		var rVal = "undefined";
		if(_passedVariables)
		{
			var value = _passedVariables[name];
			if(value)
			{
				rVal = value;
			}
		}
		return rVal;
	};

	/**
	 * Get template data from next template
	 * Not available before templateOut
	 */
	_class.getNextTemplateData = function()
	{
		return _nextTemplateData;
	};

	/**
	 * Get template data from prev template
	 */
	_class.getPrevTemplateData = function()
	{
		return _prevTemplateData;
	}


	/**
	 * Get template name
	 */
	_class.getTemplateName = function()
	{
		return _templateName;
	}

	/**
	 * Get template path
	 */
	_class.getTemplatePath = function()
	{
		return _templatePath;
	}

	/**
	 * Get template full path
	 */
	_class.getTemplateFullPath = function()
	{
		return _templateFullPath;
	}


	_class.getTemplate = function()
	{
		return _template;
	}





	/**
	 * ----------------------------
	 * THESE VALUES ARE SET BY THE CONTENTMANAGER.JS
	 * ----------------------------
	 */

	/**
	 * All the values are set here
	 */
	_class.setXML = function(xml)
	{
		_xml = xml;
	}

	_class.setLevel = function(level)
	{
		_level = level;
	}

	_class.setTemplate = function(template)
	{
		_template = template;
	}

	_class.setPassedVariables = function(passedVariables)
	{
		_passedVariables = passedVariables;
	}

	_class.setNextTemplateData = function(nextTemplateData)
	{
		_nextTemplateData = nextTemplateData;
	}

	_class.setPrevTemplateData = function(prevTemplateData)
	{
		_prevTemplateData = prevTemplateData;
	}

	_class.setTemplateName = function(name)
	{
		_templateName = name;
	}

	_class.setTemplatePath = function(path)
	{
		_templatePath = path;
	}

	_class.setTemplateFullPath = function(fullPath)
	{
		_templateFullPath = fullPath;
	}



	return _class;
}
