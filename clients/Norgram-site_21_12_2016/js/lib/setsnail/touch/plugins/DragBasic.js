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

function DragBasic( dragAmount, lockX, lockY  ) {

	var _instance = new DraggerPlugin();

	_instance.dragAmount = 1;

	_instance.lockX = false;
	_instance.lockY = false;

	_instance.init = function( dragAmount, lockX, lockY ) {
		_instance.dragAmount = dragAmount ? dragAmount : 1;
		_instance.lockX = lockX;
		_instance.lockY = lockY;
		_instance.priority = -100;
	};

	_instance.dragMove = function() {
		// console.log("DragBasic");
		_instance.dragInfo.dist.x = _instance.lockX ? 0 : _instance.dragInfo.dist.x * _instance.dragAmount;
		_instance.dragInfo.dist.y = _instance.lockY ? 0 : _instance.dragInfo.dist.y * _instance.dragAmount;
	};

	_instance.init( dragAmount, lockX, lockY );

	return _instance;
}
