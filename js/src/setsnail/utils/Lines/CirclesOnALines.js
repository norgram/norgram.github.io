var defaultOffset = 10;
var defaultNextOffset = 5;
var defaultThickness = 1;

function CirclesOnALine(radius, spacing, numOfCircles) {

	var lineGroup = new LineMaskGroup( defaultOffset, defaultThickness, defaultNextOffset, UIColors.LINES_WITH_TEXT );
	var lineGroupTwo = new LineMaskGroup( defaultOffset, defaultThickness, 0, UIColors.LINES_WITH_TEXT );

	var xPos = 0;

	for(var i = 0; i < numOfCircles; i++) {
		var line = new LineCircle();
		line.x = xPos;
		line.radius = radius;

		if( i % 2 ) {
			lineGroup.addShape(line);
		} else {
			lineGroupTwo.addShape(line);
		}

		xPos += spacing;
	}

	_groupedCircle = new LineMaskDrawer();
	_groupedCircle.addGroup( lineGroup );
	_groupedCircle.addGroup( lineGroupTwo );

	return _groupedCircle;
}

function CirclesInACircle(radius, distance, numOfCircles) {

	var offsetX = distance;
	var offsetY = distance;

	var offSize = SiteGuides.getDesignHeightRatio() * 30;

	var lineGroup = new LineMaskGroup( defaultOffset, defaultThickness, defaultNextOffset, UIColors.LINES_WITH_TEXT );
	var line = new LineCircle();
	line.x = offsetX + offSize;
	line.y = offsetY + offSize;
	line.radius = radius - offSize;
	lineGroup.addShape(line);

	var lineGroupTwo = new LineMaskGroup( defaultOffset, defaultThickness, 0, UIColors.LINES_WITH_TEXT );
	var anglePart = 360 / numOfCircles / 180 * Math.PI;

	for( var i = 0; i < numOfCircles; i++ ) {
		var currAngle = anglePart * i;

		var xPos = Math.cos( currAngle ) * distance + offsetX;
		var yPos = Math.sin( currAngle ) * distance + offsetY;

		var line = new LineCircle();
		line.x = xPos;
		line.y = yPos;
		line.radius = radius;

		lineGroupTwo.addShape(line);
	}

	_groupedCircle = new LineMaskDrawer();
	_groupedCircle.addGroup( lineGroup );
	_groupedCircle.addGroup( lineGroupTwo );

	return _groupedCircle;
}

function CircleInRect( radius ) {
	var outerGroup = new LineMaskGroup( defaultOffset, defaultThickness, defaultNextOffset, UIColors.LINES_DARK );
	var innerGroup = new LineMaskGroup( defaultOffset, defaultThickness, 0, UIColors.LINES_DARK_LIGHTER );

	var outerCircle = new LineRect(radius * 2, radius * 2);
	// outerCircle.x = xPos;
	// outerCircle.radius = radius;
	outerGroup.addShape(outerCircle);

	var circSize = 0.7;

	var innerCircle = new LineCircle();
	innerCircle.x = radius * (1 - circSize);
	innerCircle.y = radius * (1 - circSize);
	innerCircle.radius = radius * circSize;
	innerGroup.addShape(innerCircle);


	_groupedCircle = new LineMaskDrawer();
	_groupedCircle.addGroup( outerGroup );
	_groupedCircle.addGroup( innerGroup );

	return _groupedCircle;
}

function CircleInCircle( radius ) {
	var outerGroup = new LineMaskGroup( defaultOffset, defaultThickness, defaultNextOffset, UIColors.LINES_DARK );
	var innerGroup = new LineMaskGroup( defaultOffset, defaultThickness, 0, UIColors.LINES_DARK_LIGHTER );

	var outerCircle = new LineCircle();
	// outerCircle.x = xPos;
	outerCircle.radius = radius;
	outerGroup.addShape(outerCircle);

	var innerCircle = new LineCircle();
	innerCircle.x = radius * 0.5;
	innerCircle.y = radius * 0.5;
	innerCircle.radius = radius * 0.5;
	innerGroup.addShape(innerCircle);


	_groupedCircle = new LineMaskDrawer();
	_groupedCircle.addGroup( outerGroup );
	_groupedCircle.addGroup( innerGroup );

	return _groupedCircle;
}


function RectByRect( width, height ) {
	var outerGroup = new LineMaskGroup( defaultOffset, defaultThickness, defaultNextOffset, UIColors.LINES_DARK );
	var innerGroup = new LineMaskGroup( defaultOffset, defaultThickness, 0, UIColors.LINES_DARK_LIGHTER );



	var outerRect = new LineRect( width, height );
	outerGroup.addShape( outerRect );

	var innerRect = new LineRect( width * 0.5, height);
	innerRect.x = width * 0.5;
	innerRect.y = 0;
	innerGroup.addShape( innerRect );

	_groupedCircle = new LineMaskDrawer();
	_groupedCircle.addGroup( outerGroup );
	_groupedCircle.addGroup( innerGroup );

	return _groupedCircle;
}


function RectInRect( width, height  ) {
	var outerGroup = new LineMaskGroup( defaultOffset, defaultThickness, defaultNextOffset, UIColors.LINES_DARK );
	var innerGroup = new LineMaskGroup( defaultOffset, defaultThickness, 0, UIColors.LINES_DARK_LIGHTER );

	var outerRect = new LineRect( width, height );
	outerGroup.addShape( outerRect );

	var innerRect = new LineRect( width * 0.6, height * 0.6 );
	innerRect.x = width * 0.2;
	innerRect.y = height * 0.2;
	innerGroup.addShape( innerRect );

	_groupedCircle = new LineMaskDrawer();
	_groupedCircle.addGroup( outerGroup );
	_groupedCircle.addGroup( innerGroup );

	return _groupedCircle;
}

function DoubleTriangleInRect( width, height ) {
	var outerGroup = new LineMaskGroup( defaultOffset, defaultThickness, defaultNextOffset, UIColors.LINES_DARK );
	var innerGroup = new LineMaskGroup( defaultOffset, defaultThickness, 0, UIColors.LINES_DARK_LIGHTER );

	var outerRect = new LineRect( width, height );
	outerGroup.addShape( outerRect );

	var innerTriangle = new LineTriangleRight( width * 0.5, height );
	// innerTriangle.x = 100;
	innerGroup.addShape( innerTriangle );

	var innerTriangle = new LineTriangleRight( width * 0.5, height );
	innerTriangle.x = width * 0.5;
	innerGroup.addShape( innerTriangle );

	_groupedCircle = new LineMaskDrawer();
	_groupedCircle.addGroup( outerGroup );
	_groupedCircle.addGroup( innerGroup );

	return _groupedCircle;
}


function TriangleInRect( width, height ) {
	var outerGroup = new LineMaskGroup( defaultOffset, defaultThickness, defaultNextOffset, UIColors.LINES_DARK );
	var innerGroup = new LineMaskGroup( defaultOffset, defaultThickness, 0, UIColors.LINES_DARK_LIGHTER );

	var outerRect = new LineRect( width, height );
	outerGroup.addShape( outerRect );

	var innerTriangle = new LineTriangle( width, height );
	// innerTriangle.x = width * 0.2;
	// innerTriangle.y = height * 0.2;
	innerGroup.addShape( innerTriangle );

	_groupedCircle = new LineMaskDrawer();
	_groupedCircle.addGroup( outerGroup );
	_groupedCircle.addGroup( innerGroup );

	return _groupedCircle;
}