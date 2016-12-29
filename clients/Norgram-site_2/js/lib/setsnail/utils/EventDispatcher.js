
function EventDispatcher() {
	var _stack				= [];
	var _instance			= this;
	var _cleanUp			= false;

	var _cleanupTimeout		;

	_instance.addEventListener = function(name, callback) {
		// trace("addEventListener();");
		// trace("name : " + name);
		// trace("callback : " + callback);
		_stack.push({name: name, callback: callback, kill: false});
	};

	_instance.removeEventListener = function(name, callback) {
		var l			= _stack.length;
		var i			;
		var data		;

		for(i = 0; i < l; i += 1) {
			data = _stack[i];

			if(data.name === name && data.callback === callback) {
				data.kill = true;
				_cleanUp = true;
			}
		}
	};

	function doCleanUp() {
		if(_cleanUp === true) {
			var l			= _stack.length;
			var i			;
			var data		;
			var newStack	= [];

			for(i = 0; i < l; i += 1) {
				data = _stack[i];

				if(data.kill === false) {
					newStack.push(data);
				}
			}

			_cleanUp = false;
			_stack = newStack;
		}
	}

	_instance.dispatchEvent = function(name, params) {
		// trace("EventDispatcher.dispatchEvent();");
		// trace("name : " + name);

		clearTimeout(_cleanupTimeout);
		_cleanupTimeout = setTimeout(doCleanUp, 1000 * 1);

		var l			= _stack.length;
		var i			;
		var data		;

		for(i = 0; i < l; i += 1) {
			data = _stack[i];

			// trace("data.name : " + data.name);
			if(data.name === name) {
				if(data.kill === true) {
					continue;
				}

				// trace("dispatch");
				data.callback(params);
			}
		}
	};
}
