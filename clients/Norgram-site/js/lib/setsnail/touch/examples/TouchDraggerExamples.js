/*--------------------------------------------------------*/
/*                                                        */
/*   Copyright Set Snail                                  */
/*   All rights reserved.                                 */
/*                                                        */
/*                                                        */
/*        /^\    /^\                                      */
/*       {  O}  {  O}                                     */
/*        \ /    \ /                                      */
/*        //     //       _------_                        */
/*       //     //     ./~        ~-_                     */
/*      / ~----~/     /              \                    */
/*    /         :   ./       _---_    ~-                  */
/*   |  \________) :       /~     ~\   |                  */
/*   |        /    |      |  :~~\  |   |                  */
/*   |       |     |      |  \___-~    |                  */
/*   |        \ __/`\______\.        ./                   */
/*    \                     ~-______-~\.                  */
/*    .|                                ~-_               */
/*   /_____________________________________~~____         */
/*                                                        */
/*--------------------------------------------------------*/


function TouchDraggerExamples() {

	var _instance = document.createElement( "div" );

	_instance.init = function() {
		//Simple as this; you can now drag the item around the scene.
		// TouchDragger.add( item );

		// singleSimpleDrag();
		// dragWithBounds();
		// dragGroup();
		// dragWithEase();
		// dragSnap();
		dragScroll();


		//ALSO
		//Every plugin has the abilty to be disabled and enabled indevidual .disable(); .enable(); isEnabled();
	};

	function singleSimpleDrag() {
		//test item;
		var gfx = document.createElement( "div" );// new Quad( 50, 50, 0xFF0000 );
		gfx.style.position = "absolute";
		gfx.style.width = 200 + "px";
		gfx.style.height = 200 + "px";
		gfx.style.top = 200 + "px";
		gfx.style.left = 200 + "px";
		gfx.style.backgroundColor = "#FF0000";
		_instance.appendChild( gfx );

		// var item = new Touchable( gfx );

		//This would start a normal drag on that item;
		// TouchDragger.add( gfx );

//		---------------------------

		//PlainDragger is a plugin containing some of the most basic settings; like dragAmount and lock;
		var plainDragger = new DragBasic();

		//Locks the direction of a drag, if lockX is set true, then you can only drag in the y deirection;
		// plainDragger.lockY = true;
		// plainDragger.lockX = true;

		//This will make the dragged item go twice as fast; .5 would be twice as slow;
		plainDragger.dragAmount = 1;


		var plugins = [
						plainDragger
		];

		TouchDragger.add( gfx, plugins );
	}


	function dragWithBounds() {
		var bounds = new Rectangle( 200, 200, 800, 500 );

		var boundsGfx = document.createElement( "div" );// new Quad( 50, 50, 0xFF0000 );
		boundsGfx.style.position = "absolute";
		boundsGfx.style.width = bounds.width + "px";
		boundsGfx.style.height = bounds.height + "px";
		boundsGfx.style.top = bounds.x + "px";
		boundsGfx.style.left = bounds.y + "px";
		boundsGfx.style.backgroundColor = "#00FF00";
		_instance.appendChild( boundsGfx );

		var gfx = document.createElement( "div" );// new Quad( 50, 50, 0xFF0000 );
		gfx.style.position = "absolute";
		gfx.style.width = 200 + "px";
		gfx.style.height = 200 + "px";
		gfx.style.top = 200 + "px";
		gfx.style.left = 200 + "px";
		gfx.style.backgroundColor = "#FF0000";
		_instance.appendChild( gfx );

		var plainDragger = new DragBasic();
		plainDragger.dragAmount = 1;

		//To add bounds you need the DragBounds plugin;
		var dragBounds = new DragBounds( bounds );
		//When dragging this ease will be added when dragging out side of the bounds
		dragBounds.boundsEase = 0.2;
		//Set if the items bounds should be calculated with the bounds. Set to false if you want to do this manualy (false to make it work as the old flash drag features)
		// dragBounds.useItemsSize = false;

		//There are 5 events it will dispatch on change if set to true; Look them up as the static consts in DragBounds
		// dragBounds.dispacthEvents = true;
		// dragBounds.addEventListener( DragBounds.STATE_OUTSIDE_TOP, function(){
		//	console.log("Outside Top");
		// } );

		//If dispatchOnObjects is set true, the events will be dispatched on all of the objects instead;
		//Note: This requires the object to extend EventDispatcher;
//		dragBounds.dispatchOnObjects = true;
//		item.addEventListener( DragBounds.STATE_OUTSIDE_TOP, onStateChange );

		var plugins = [
						plainDragger,
						dragBounds
		];

		TouchDragger.add( gfx, plugins );
	}

	function dragGroup() {
		var bounds = new Rectangle( 100, 100, 800, 500 );

		var boundsGfx = document.createElement( "div" );// new Quad( 50, 50, 0xFF0000 );
		boundsGfx.style.position = "absolute";
		boundsGfx.style.width = bounds.width + "px";
		boundsGfx.style.height = bounds.height + "px";
		boundsGfx.style.top = bounds.x + "px";
		boundsGfx.style.left = bounds.y + "px";
		boundsGfx.style.backgroundColor = "#00FF00";
		_instance.appendChild( boundsGfx );

		var easePlugin = new DragEase();

		//First set plugins
		var dragBounds1 = new DragBounds( bounds );
		// dragBounds1.easeEase = Back.easeOut;
//		dragBounds1.easeDist = 2;
		dragBounds1.boundsEase = 0.2;

		//Second set plugins;
		var dragBound2 = new DragBounds( bounds );
		var plainDragger2 = new DragBasic();
		plainDragger2.dragAmount = 1.5;

		//Displayobject to move;
		var gfx1 = document.createElement( "div" );
		gfx1.style.position = "absolute";
		gfx1.style.width = 50 + "px";
		gfx1.style.height = 50 + "px";
		gfx1.style.top = 150 + "px";
		gfx1.style.left = 150 + "px";
		gfx1.style.backgroundColor = "#FF0000";
		_instance.appendChild( gfx1 );

		var gfx2 = document.createElement( "div" );
		gfx2.style.position = "absolute";
		gfx2.style.width = 50 + "px";
		gfx2.style.height = 50 + "px";
		gfx2.style.left = 300 + "px";
		gfx2.style.top = 200 + "px";
		gfx2.style.backgroundColor = "#FFFF00";
		_instance.appendChild( gfx2 );

		var gfx3 = document.createElement( "div" );
		gfx3.style.position = "absolute";
		gfx3.style.width = 50 + "px";
		gfx3.style.height = 50 + "px";
		gfx3.style.left = 350 + "px";
		gfx3.style.top = 250 + "px";
		gfx3.style.backgroundColor = "#FF00FF";
		_instance.appendChild( gfx3 );

		//The group dragger;
		var dragGroupItem = new GroupDragger( [ gfx1, gfx2 ], [ dragBounds1, easePlugin ] );

		//The touchdragger;
		var dragger = new TouchDragger( dragGroupItem );

		//Adding displayobjects as second parameter makes all touch events listne on this displayobjects instead;
//		var dragger:TouchDragger = new TouchDragger( dragGroup, new <DisplayObject>[ boundsBox ] );

		//You can allways add more objects to the same dragger and aply diffrent plugins.
		dragger.add( [ gfx3 ], [ plainDragger2, dragBound2 ] );
	}

	function dragWithEase() {
		var bounds = new Rectangle( 100, 100, 800, 500 );

		var boundsGfx = document.createElement( "div" );// new Quad( 50, 50, 0xFF0000 );
		boundsGfx.style.position = "absolute";
		boundsGfx.style.width = bounds.width + "px";
		boundsGfx.style.height = bounds.height + "px";
		boundsGfx.style.top = bounds.x + "px";
		boundsGfx.style.left = bounds.y + "px";
		boundsGfx.style.backgroundColor = "#00FF00";
		_instance.appendChild( boundsGfx );

		//Vizual bounding box;
		// var boundsBox = new Quad( bounds.width, bounds.height, 0x00FF00 );
		// boundsBox.alpha = 0.5;
		// boundsBox.x = bounds.x;
		// boundsBox.y = bounds.x;

		// addChild( boundsBox );


		var gfx1 = document.createElement( "div" );// new Quad( 50, 50, 0xFF0000 );
		gfx1.style.position = "absolute";
		gfx1.style.width = 100 + "px";
		gfx1.style.height = 100 + "px";
		gfx1.style.top = 200 + "px";
		gfx1.style.left = 200 + "px";
		gfx1.style.backgroundColor = "#FF0000";
		_instance.appendChild( gfx1 );

		// var gfx2 = document.createElement( "div" );// new Quad( 50, 50, 0xFF0000 );
		// gfx2.style.position = "absolute";
		// gfx2.style.width = 100 + "px";
		// gfx2.style.height = 100 + "px";
		// gfx2.style.top = 400 + "px";
		// gfx2.style.left = 400 + "px";
		// gfx2.style.backgroundColor = "#FF0000";
		// _instance.appendChild( gfx2 );


		//Test items;
		// var item = new Quad( 50, 50, 0xFF0000 );
		// item.x = 150;
		// item.y = 150;
		// addChild( item );
		// var item2 = new Quad( 50, 50, 0xFF0000 );
		// item2.x = 250;
		// item2.y = 250;
		// addChild( item2 );

		//Add the Ease plugin to enable throwing behavior;
		var easePlugin = new DragEase();
		//For how long should the ease last;
		easePlugin.time = 2;
		//How fare the item be thrown based on drag amount
		easePlugin.distance = 1;
		//What ease should be used for the throw; Expo.easeOut is Default;
		easePlugin.ease = Expo.easeOut;

		//DragBounds also have easeing features you can use;
		var dragBounds = new DragBounds( bounds );
		//When dragging this ease will be added when dragging out side of the bounds
		dragBounds.boundsEase = 0.3;
		//The ease used when items are outside of the bounderies, Back.easeOut will give a bouncy effect and Linear.easeNone (DEFAULT) will simply ease the item back inside the bounds;
		// dragBounds.easeEase = Back.easeOut;
		//Detirmens how mutch ease the outside ease should have
		dragBounds.easeDist = 10;

		//Easeing works on both single target and on Groups;
		TouchDragger.add( gfx1, [
			dragBounds,
			easePlugin
			] );
//		var dragger:TouchDragger = TouchDragger.addGroup( new GroupDragger( new <DisplayObject>[ item, item2 ], new <DraggerPlugin>[ easePlugin, dragBounds ] ) );

	}

	function dragScroll() {
		var totalHeight = 4000;

		//FakeScroll;
		var fakeScroll = document.createElement("div");
		fakeScroll.style.height = totalHeight + "px";
		_instance.appendChild(fakeScroll);

		/**
		* GFX
		*/
		var contentContainer = document.createElement("div");
		contentContainer.style.position = "fixed";
		contentContainer.style.top = 0 + "px";
		contentContainer.style.left = 0 + "px";
		contentContainer.style.width = window.innerWidth + "px";
		contentContainer.style.height = window.innerHeight + "px";

		var partHeight = 200;
		var l = Math.floor( totalHeight / partHeight );

		var part;
		for( var i = 0; i < l; i++ ){
			part = document.createElement( "div" );
			part.style.height = partHeight + "px";
			part.style.width = window.innerWidth + "px";
			part.style.backgroundColor = i % 2 ? "#ff0000" : "#0000FF";
			part.style.top = (partHeight * i) + "px";

			contentContainer.appendChild( part );
		}

		_instance.appendChild(contentContainer);



		/**
		* DRAGGER
		*/

		var basic = new DragBasic();
		basic.lockX = true;

		var easePlugin = new DragEase();
		//For how long should the ease last;
		easePlugin.time = 2;
		//How fare the item be thrown based on drag amount
		easePlugin.distance = 1;
		//What ease should be used for the throw; Expo.easeOut is Default;
		easePlugin.ease = Expo.easeOut;

		var bounds = new Rectangle( 0, -totalHeight + window.innerHeight, window.innerWidth, totalHeight );

		var dragBounds1 = new DragBounds( bounds );
		// dragBounds1.easeEase = Back.easeOut;
		dragBounds1.easeDist = 2;
		dragBounds1.boundsEase = 0.2;

		var scroll = new DragScroll( fakeScroll );

		TouchDragger.add( contentContainer, [basic, easePlugin, dragBounds1, scroll] );
	}


	function dragSnap() {
		/**
		Snap dragging is a work in progress
		DOES NOT WORK AT THE MOMENT;
		*/


		var gfx = document.createElement( "div" );// new Quad( 50, 50, 0xFF0000 );
		gfx.style.position = "absolute";
		gfx.style.width = 200 + "px";
		gfx.style.height = 200 + "px";
		gfx.style.top = 200 + "px";
		gfx.style.left = 200 + "px";
		gfx.style.backgroundColor = "#FF0000";
		_instance.appendChild( gfx );

		var snapPlugin = new DragSnap( 10, 10 );

		var easePlugin = new DragEase();

		var dragger = TouchDragger.add( gfx, [ snapPlugin ] );
	}





	return _instance;
}
