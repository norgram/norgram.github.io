var AnimationUtils = {};

AnimationUtils.DEG_2_RAD = Math.PI / 180;

AnimationUtils.getRotationXMatrix = function(rotateX) {
	return $M([[1, 0, 0, 0], [0, Math.cos(rotateX * this.DEG_2_RAD), Math.sin(-rotateX * this.DEG_2_RAD), 0], [0, Math.sin(rotateX * this.DEG_2_RAD), Math.cos(rotateX * this.DEG_2_RAD), 0], [0, 0, 0, 1]]);
};

AnimationUtils.getRotationYMatrix = function(rotateY) {
	return $M([[Math.cos(rotateY * this.DEG_2_RAD), 0, Math.sin(rotateY * this.DEG_2_RAD), 0], [0, 1, 0, 0], [Math.sin(-rotateY * this.DEG_2_RAD), 0, Math.cos(rotateY * this.DEG_2_RAD), 0], [0, 0, 0, 1]]);
};

AnimationUtils.getRotationZMatrix = function(rotateZ) {
	return $M([[Math.cos(rotateZ * this.DEG_2_RAD), Math.sin(-rotateZ * this.DEG_2_RAD), 0, 0], [Math.sin(rotateZ * this.DEG_2_RAD), Math.cos(rotateZ * this.DEG_2_RAD), 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]);
};

AnimationUtils.getScaleMatrix = function(scaleX, scaleY, scaleZ) {
	var _scaleX = scaleX? scaleX:1;
	var _scaleY = scaleY? scaleY:1;
	var _scaleZ = scaleZ? scaleZ:1;
	return $M([[_scaleX, 0, 0, 0], [0, _scaleY, 0, 0], [0, 0, _scaleZ, 0], [0, 0, 0, 1]]);
};

AnimationUtils.getTransformationMatrix = function(translationX,translationY,translationZ) {
	var _translationX = translationX? translationX:0;
	var _translationY = translationY? translationY:0;
	var _translationZ = translationZ? translationZ:0;
	return $M([[1,0,0,0],[0,1,0,0],[0,0,1,0],[_translationX,_translationY,_translationZ,1]]);
};

AnimationUtils.getResultMatrix = function(listMatix) {
	if(listMatix.length === 1){
		return listMatix[0];
	}else{
		var resultMatrix = $M([[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]]);
		for (var i = 0; i < listMatix.length; i++) {
			var nextMatrix = listMatix[i];
			resultMatrix = nextMatrix.x(resultMatrix);
		}
		return resultMatrix;
	}
};

AnimationUtils.getStringTransform3d = function(transformationMatrix) {
	var stringTransform = "matrix3d(";
	stringTransform += transformationMatrix.e(1, 1).toFixed(5) + "," + transformationMatrix.e(1, 2).toFixed(5) + "," + transformationMatrix.e(1, 3) + "," + transformationMatrix.e(1, 4).toFixed(5) + ",";
	stringTransform += transformationMatrix.e(2, 1).toFixed(5) + "," + transformationMatrix.e(2, 2).toFixed(5) + "," + transformationMatrix.e(2, 3) + "," + transformationMatrix.e(2, 4).toFixed(5) + ",";
	stringTransform += transformationMatrix.e(3, 1).toFixed(5) + "," + transformationMatrix.e(3, 2).toFixed(5) + "," + transformationMatrix.e(3, 3) + "," + transformationMatrix.e(3, 4).toFixed(5) + ",";
	stringTransform += transformationMatrix.e(4, 1).toFixed(5) + "," + transformationMatrix.e(4, 2).toFixed(5) + "," + transformationMatrix.e(4, 3) + "," + transformationMatrix.e(4, 4).toFixed(5);
	stringTransform += ")";
	// trace(stringTransform);
	return stringTransform;
};

AnimationUtils.applyStringTransform3d = function(target, cssTransformMatrix) {
	// trace( "MATRIX = " + cssTransformMatrix );

	target.style.transform = cssTransformMatrix;
	target.style.msTransform = cssTransformMatrix;
	target.style.webkitTransform = cssTransformMatrix;
	target.style.mozTransform = cssTransformMatrix;
	target.style.oTransform = cssTransformMatrix;
};

AnimationUtils.translateTarget = function( target, translationX, translationY, translationZ ) {

	var trans = AnimationUtils.getTransformationMatrix( translationX, translationY, translationZ );

	var result = AnimationUtils.getResultMatrix( [trans] );

	var cssTransform = AnimationUtils.getStringTransform3d( result );
	AnimationUtils.applyStringTransform3d( target, cssTransform );
};

AnimationUtils.getStringTranslate2d = function(x, y) {
	var stringTransform = "translate(";
	stringTransform += x + 'px,';
	stringTransform += y + 'px)';
	return stringTransform;
};

AnimationUtils.getStringScale2d = function(sx, sy) {
	var stringTransform = "scale(";
	stringTransform += sx + ',';
	stringTransform += sy + ')';
	return stringTransform;
};

AnimationUtils.getObjectTopLeft = function(x, y) {
	var objectTransform = {
		'left': x + 'px',
		'top': y + 'px'
	};
	return objectTransform;
};


AnimationUtils.apply = function( instance ) {

	var _xPos = 0;
	var _yPos = 0;

	var _renderable = true;

	instance.aniSetX = function( value ) {
		_xPos = value;
	};
	instance.aniGetX = function() { return _xPos; };


	instance.aniSetY = function( value ) {
		_yPos = value;
	};
	instance.aniGetY = function() { return _yPos; };

	instance.aniDisableRender = function(){
		_renderable = false;
	};

	instance.aniEnableRender = function(){
		_renderable = true;
	}


	instance.aniRender = function() {
		if( _renderable === false ){
			return;
		}

//		trace(Math.ceil(_yPos));
		// var trans = AnimationUtils.getTransformationMatrix( Math.floor(_xPos), Math.floor(_yPos), 0 );
		// var scale = AnimationUtils.getScaleMatrix( _width / parseInt( instance.style.width ), _height / parseInt( instance.style.height ), 1 );

		//ApplyChanges;
		// var result = AnimationUtils.getResultMatrix( [ trans ] );

		// var cssTransformMatrix = AnimationUtils.getStringTransform3d( result );

		// var cssTransformMatrix = AnimationUtils.getStringTransform3d( trans );

		//Perform opt
		var cssTransformMatrix = "matrix3d(	1.00000,0.00000,0,0.00000," +
											"0.00000,1.00000,0,0.00000," +
											"0.00000,0.00000,1,0.00000," +
											Math.floor(_xPos).toFixed(5) + "," + Math.floor(_yPos).toFixed(5) + ",0,1.00000)";

		instance.style.transform = cssTransformMatrix;
		instance.style.msTransform = cssTransformMatrix;
		instance.style.webkitTransform = cssTransformMatrix;
		instance.style.mozTransform = cssTransformMatrix;
		instance.style.oTransform = cssTransformMatrix;
	};
};













