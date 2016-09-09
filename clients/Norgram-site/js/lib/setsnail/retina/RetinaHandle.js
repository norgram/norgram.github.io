
function RetinaHandle() {
	var _instance					= new EventDispatcher();

	var _refreshTimeout				;

	var _isFirstRun					= true;
	var _pixelRatio					= 1;
	var _assetsScale				= 1;
	var _assetsScaleStr				= "@x1";
	var _assetsScalePct				= 1;

	// settings
	var _supportedScales			= [1, 2];

	init();

	function init() {
		// trace("RetinaHandle.init();");
		calculate();
	}

	/**
	 * Change settings here
	 */
	_instance.setSupportedScales = function(array) {
		_supportedScales = array;
	};

	/**
	 * Listen for dpi change
	 */
	_instance.getAssetScaleStr = function() {
		return _assetsScaleStr;
	};

	_instance.getAssetScalePercent = function() {
		return _assetsScalePct;
	};



	/**
	 * Calculate from settings
	 */
	function calculate() {
		clearTimeout(_refreshTimeout);

		// find pixel ratio
		_pixelRatio = window.devicePixelRatio;

		if(!_pixelRatio) {
			_pixelRatio = 1;
		}

		// find the best scale
		var i				= 0;
		var l				= _supportedScales.length;
		var currScale		;
		var scaleDist		;
		var minScaleDist	= 10000;
		var targetScale		= 1;

		for(i = 0; i < l; i += 1) {
			currScale = _supportedScales[i];

			scaleDist = Math.abs(currScale - _pixelRatio);

			if(scaleDist < minScaleDist)
			{
				minScaleDist = scaleDist;
				targetScale = currScale;
			}
		}

		_assetsScale = targetScale;

		// assets scale
		_assetsScalePct = 1 / _assetsScale;

		// scale add for images
		var oldAssetsScaleStr = _assetsScaleStr;
		_assetsScaleStr = "@x" + _assetsScale;

		if(_assetsScaleStr != oldAssetsScaleStr) {
			traceValues();
			_instance.dispatchEvent(RetinaHandleEvents.CHANGE);
		}
		else if(_isFirstRun) {
			_isFirstRun = false;
			traceValues();
		}

		_refreshTimeout = setTimeout(calculate, 1000 * 2);
	};

	function traceValues() {
		// trace("_pixelRatio : " + _pixelRatio);
		// trace("_assetsScale : " + _assetsScale);
		// trace("_assetsScaleStr : " + _assetsScaleStr);
		// trace("_assetsScalePct : " + _assetsScalePct);
	};

	return _instance;
}
