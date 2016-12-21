GuideLines.OFFSET_BOTTOM = 40;

function GuideLines( width ) {

	GuideLines.ON_UPDATE = "ON_UPDATE";

	var _instance 		= new EventDispatcher();
	var _width			= width ? width : SiteGuides.BASE_DESIGN_WIDTH;
	var _guides 		= {};

	_instance.addGuide = function( name, offset ) {
		_guides[ name ] = { offset:offset, orig:offset };
	};

	_instance.setGuide = function( name, setTo ) {
		_guides[ name ].offset = setTo;
		_instance.dispatchEvent( GuideLines.ON_UPDATE, name );
	};

	_instance.setRatioTo = function( name, ratio ){
		_instance.setGuide( name, _guides[ name ].orig * ratio );
	};

	_instance.setRatioToAll = function( ratio ){
		for( var key in _guides ){
			_instance.setRatioTo( key, ratio );
		}
	};

	_instance.getDistance = function(name1, name2) {
		var guide1 = _instance.getGuide( name1 );
		var guide2 = _instance.getGuide( name2 );

		return Math.abs( guide2 - guide1 );
	};

	_instance.setWidthTo = function( name, width ) {
		var newRatio = 1 / _width * width;
		// console.log(newRatio);
		_instance.setRatioTo(name, newRatio);
	};

	_instance.setWidth = function( newWidth ) {
		var newRatio = 1 / _width * newWidth;
		_instance.setRatioToAll(newRatio);
	};

	_instance.getDesignWidth = function(){
		return _width;
	};

	_instance.getGuide = function( name ) {
		var guide =  _guides[ name ];
		if(!guide) {
			console.error("guide '" + name + "' was not found");
		}
		return guide.offset;
	};

	return _instance;
}
