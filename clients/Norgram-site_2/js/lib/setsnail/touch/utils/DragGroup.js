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

function DragGroup( items, plugins, groupId ) {

	var _instance							= {};

	var _items								;
	var _allPlugins							;
	var _easePlugins						= [];

	var _dragInfo							= new DragInfo();
	var _groupId							;

	var _use3DTransform						= false;

	_instance.init = function( items, plugins, groupId ){
		_items = items;
		_allPlugins = plugins ? plugins : [];
		_groupId = groupId;

		setupPlugins();
	};

	_instance.enable3DTransform = function(){
		var l			= _items.length;
		var item		;

		for( var i = 0; i < l; i++ ) {
			item = _items[ i ];
			if( item.aniRender === undefined ) {
				AnimationUtils.apply( item );
			}
		}

		l = _allPlugins.length;

		//add item to plugins;
		for( var j = 0; j < l; j++ ){
			_allPlugins[j].use3DTransform = true;
		}

		_use3DTransform = true;
	}

	_instance.add = function( item ) {
		var l = _allPlugins.length;

		//add item to plugins;
		for( var i = 0; i < l; i++ ){
			_allPlugins[i].addDragItem( item );
		}

		//push item;
		_items.push( item );
	};

	_instance.remove = function( item ) {
		var l = _allPlugins.length;
		var plugin;

		//Remove item from plugins;
		for( var i = 0; i < l; i++ ){
			_allPlugins[i].removeDragItem( item );
		}

		//Splice item
		var index = _items.indexOf( item );
		if( index != -1 ) {
			_items.splice( index, 1 );
		}
	};

	_instance.getGroupId = function() { return _groupId; };

	_instance.getAllItems = function() { return _items; };

	function setupPlugins() {
		var l = _allPlugins.length;
		var plugin;
		var easePlugin;
		var easeInfo = new EaseInfo();

		for( var i = 0; i < l; i++ ) {
			plugin = _allPlugins[i];

			//Set default settings;
			plugin.setDragInfo( _dragInfo );
			plugin.addDragItems( _items );
			plugin.onForcedUpdateDist( _instance.updateDist );
			plugin.onForcedUpdatePlugins( _instance.dragMove );
			plugin.onForcedUpdateMove( _instance.moveItems );
			plugin.onForceEnded( _instance.dragEnded );

			//Set the easePlugin if found;
			if( plugin.setEasePlugins !== undefined ){
				easePlugin = plugin;
			}

			//Setup and Push easePlugin ref to seperate container;
			if( plugin.setEaseInfo !== undefined ) {
				plugin.setEaseInfo( easeInfo );
				_easePlugins.push( plugin );
			}
		}

		//Enable ease if plugin found;
		if( easePlugin ) {
			_easePlugins.sort( DraggerPlugin.pluginSortRules );
			easePlugin.setEasePlugins( _easePlugins );
		}

		_allPlugins.sort( DraggerPlugin.pluginSortRules );
	}

	_instance.updateDist = function( xDist, yDist ) {
		// console.log( "update dist Y = " + yDist);

		_dragInfo.dist.x = xDist;
		_dragInfo.dist.y = yDist;
		dragMove();
		moveItems();
	};

	_instance.dragStarted = function() {
		var l = _allPlugins.length;

		for( var i = 0; i < l; i++ )
			if( _allPlugins[i].isEnabled() )
				_allPlugins[i].dragStarted();
	};

	_instance.dragEnded = function() {
		var l = _allPlugins.length;

		for( var i = 0; i < l; i++ ){
			if( _allPlugins[i].isEnabled() ){
				_allPlugins[i].dragEnded();
			}
		}
	};

	function dragMove() {
		var l = _allPlugins.length;

		for( var i = 0; i < l; i++ ){
			if( _allPlugins[ i ].isEnabled() ){
				_allPlugins[ i ].dragMove();
			}
		}
	}

	function moveItems() {
		var l			= _items.length;
		var item		;

		for( var i = 0; i < l; i++ ) {
			item = _items[ i ];
			if( _use3DTransform ) {
//				trace( "USING 3DTRANSFORM" );
				item.aniSetX( item.aniGetX() + _dragInfo.dist.x );
				item.aniSetY( item.aniGetY() + _dragInfo.dist.y );
				item.aniRender();

				// console.log( item.aniGetY() + " : " + _dragInfo.dist.y  );
			} else {

				item.style.left = ( parseInt( item.style.left ) + _dragInfo.dist.x ) + "px";
				item.style.top = ( parseInt( item.style.top ) + _dragInfo.dist.y ) + "px";

				// console.log( item.style.top );
			}

		}
	}

	_instance.init( items, plugins, groupId );

	return _instance;
}
