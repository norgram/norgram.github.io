/*========================================================*/
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
/*========================================================*/

function DragInfo( lockX, lockY ) {

	var _instance							= {};

	_instance.dist							= {x:0, y:0};
	_instance.lastDist						= {x:0, y:0};

	_instance.lastPos						= {x:0, y:0};
	_instance.newPos						= {x:0, y:0};

	_instance.lockX							= false;
	_instance.lockY							= false;

	_instance.init = function( lockX, lockY ) {
		_instance.lockX = lockX;
		_instance.lockY = lockY;
	};

	_instance.updateLastDist = function() {
		// console.log("last dist = " + _instance.lastDist.x);
		_instance.lastDist.x = _instance.dist.x;
		_instance.lastDist.y = _instance.dist.y;
	};

	_instance.init( lockX, lockY );

	return _instance;
}
