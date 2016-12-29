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

function DraggerEasePlugin() {

	var _instance			= new DraggerPlugin();

	var _easeEnabled		= true;

	_instance.EaseInfo		= null;

	_instance.setEaseInfo = function( info ) { _instance.easeInfo = info; };

	_instance.disableEase = function() { _easeEnabled = false; };

	_instance.enableEase = function() { _easeEnabled = true; };

	_instance.easeStarted = function() { /*OVERRIDE THIS FUNCTION TO MANIPULATE;*/ };

	_instance.easeEnded = function() { /*OVERRIDE THIS FUNCTION TO MANIPULATE;*/ };

	_instance.easeUpdated = function() { /*OVERRIDE THIS FUNCTION TO MANIPULATE;*/ };

	_instance.isEaseEnabled = function() { return _easeEnabled; };

	return _instance;
}
