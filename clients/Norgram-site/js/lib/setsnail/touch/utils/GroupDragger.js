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


GroupDragger.NUM_OF_ITEMS_CHANGEST				= "NUM_OF_ITEMS_CHANGEST";
GroupDragger.DRAG_ENDED							= "DRAG_ENDED";

function GroupDragger( items, plugins, groupId ) {

	var _instance									= new EventDispatcher();

	var _itemGroups = [];
	var _listenOn = [];

	_instance.init = function( items, plugins, groupId ) {
		plugins = plugins ? plugins : [];
		_instance.addGroup( items, plugins, groupId );
	};

	_instance.addGroup = function( items, plugins, groupId ) {
		_itemGroups.push( new DragGroup( items, plugins, groupId ) );
	};

	_instance.addItemGroup = function( item, plugins, groupId ) {
		_instance.addGroup( [ item ], plugins, groupId );
	};

	_instance.addToGroup = function( item, groupId ) {
		var l = _itemGroups.length;

		for( var i = 0; i < l; i++ ) {
			if( groupId == _itemGroups[ i ].getGroupId() ) {
				_itemGroups[ i ].add( item );
				break;
			}
		}

		_instance.dispatchEvent( GroupDragger.NUM_OF_ITEMS_CHANGEST );
	};

	_instance.removeItem = function( item ) {
		var l = _itemGroups.length;

		for( var i = 0; i < l; i++ ) {
			_itemGroups[ i ].remove( item );
		}

		_instance.dispatchEvent( GroupDragger.NUM_OF_ITEMS_CHANGEST );
	};

	_instance.removeFromGroup = function( item, groupId ) {
		var l = _itemGroups.length;

		for( var i = 0; i < l; i++ ) {
			if( groupId == _itemGroups[i].getGroupId() ) {
				_itemGroups[ i ].remove( item );
				break;
			}
		}

		_instance.dispatchEvent( GroupDragger.NUM_OF_ITEMS_CHANGEST );
	};

	_instance.getAllItems = function() {
		var allItems = [];
		var numOfGroups = _itemGroups.length;

		for( var i = 0; i < numOfGroups; i++ ) {
			var groupItems = _itemGroups[ i ].getAllItems();
			var numOfChildren = groupItems.length;

			for( var j = 0; j < numOfChildren; j++ ) {
				allItems.push( groupItems[ j ] );
			}
		}

		return allItems;
	};
	
	_instance.enable3DTransform = function() {
		var l = _itemGroups.length;
		for( var i = 0; i < l; i++ ) {
			_itemGroups[ i ].enable3DTransform();
		}
	};
	

	/** for internal use only */
	_instance.dragStartet = function() {
		var l = _itemGroups.length;
		for( var i = 0; i < l; i++ ) {
			_itemGroups[ i ].dragStarted();
		}
	};

	/** for internal use only */
	_instance.updateDist = function( xDist, yDist ) {
		var l = _itemGroups.length;
		for( var i = 0; i < l; i++ ) {
			_itemGroups[ i ].updateDist( xDist, yDist );
		}
	};

	/** for internal use only */
	_instance.dragEnded = function() {
		var l = _itemGroups.length;
		for( var i = 0; i < l; i++ ) {
			_itemGroups[ i ].dragEnded();
		}

		_instance.dispatchEvent( GroupDragger.DRAG_ENDED );
	};

	_instance.getAllGroups = function() { return _itemGroups; };

	_instance.init( items, plugins, groupId );

	return _instance;
}
