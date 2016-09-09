/**
 * Adds code-hinting to javascript events
 *
 * List from: http://help.dottoro.com/larrqqck.php
 *
 * http://www.quirksmode.org/js/events_mouse.html
 *
 * http://en.wikipedia.org/wiki/DOM_Events
 *
 * For better touch events: http://www.sitepen.com/blog/2011/12/07/touching-and-gesturing-on-iphone-android-and-more/
 */
function Event()
{
}

function MouseEvent()
{
}

function KeyboardEvent()
{
}

function TouchEvent()
{
}

function MutationEvent()
{
}

function MessageEvent()
{
}

function MediaEvent()
{
}

function MouseAndTouchEvent()
{
}

// Events
/*
 *  Occurs when the size of an object has changed.
 */
Event.RESIZE = "resize";
Event.LOAD = "load";
/*
 * Occurs when the contents of an element have been scrolled.
 */
Event.SCROLL = "scroll";
/*
 * OOccurs after some text has been selected in an element.
 */
Event.SELECT = "select";
/*
 * Occurs on a form element when the user clicks on a submit button in the form.
 */
Event.SUBMIT = "submit";
/*
 * Occurs when the hash subsection (begins with a '#' sign) of the current document's URL has changed.
 * NOT SUPPORTED IN IE7 and lower, Safari under version 5
 * FIXME: For browsers that dont support hashchange add an interval function + IE treats all hashes as case insensitive, while the other browsers treat them case sensitive.
 */
Event.HASHCHANGE = "hashchange";

/**
 * Used on: Button, Checkbox, FileUpload, Layer, Password, Radio, Reset, Select, Submit, Text, TextArea, Window
 *
 * Action: The object in question loses focus (e.g. by clicking outside it or pressing the TAB key).
 */
Event.BLUR = "blur";

/**
 * Used on: The data in the form element is changed by the user.
 *
 * Action: The object in question loses focus (e.g. by clicking outside it or pressing the TAB key).
 */
Event.CHANGE = "change";
Event.ABORT = "abort";
// Image
Event.UNLOAD = "unload";
// User exits page - unloads the page
Event.BEFOREUNLOAD = "beforeunload";
Event.LOAD = "load";

/*
 * Fires when an error occurs while loading an external file.
 */
Event.ERROR = "error";
/*
 * Occurs when the right mouse button is clicked on an element and the context menu is shown.
 */
Event.CONTEXTMENU = "contextmenu";
/*
 * Event.COPY
 * Occurs before the selection is copied to the clipboard.
 */
Event.COPY = "copy";
Event.PASTE = "paste";

/*
 * Occurs when the state of the request changes. readystatechange (XMLHttpRequest)
 */
Event.READY_STATE_CHANGE = "readystatechange";
/*
 * Occurs on a form before it is reset.
 */
Event.RESET = "reset";

// Mouse Events
MouseEvent.CLICK = "click";
MouseEvent.MOUSE_DOWN = "mousedown";
MouseEvent.MOUSE_MOVE = "mousemove";
MouseEvent.MOUSE_UP = "mouseup";
MouseEvent.RIGHT_CLICK = "rightclick";
MouseEvent.MOUSE_OVER = "mouseover";
MouseEvent.MOUSE_OUT = "mouseout";

/*
 * Occurs when the user double clicks on an element.
 */
MouseEvent.DOUBLE_CLICK = "dblclick";
/*
 *  Occurs when an element receives focus.
 */
MouseEvent.FOCUS = "focus";
MouseEvent.MOUSE_ENTER = "mouseenter";
MouseEvent.MOUSE_LEAVE = "mouseleave";
MouseEvent.ROLL_OVER = "mouseenter";
MouseEvent.ROLL_OUT = "mouseleave";
/*
 * Occurs on the source element when the user has finished the drag operation.
 */
MouseEvent.DRAG_END = "dragend";
/*
 * Yes  Occurs on an element when the user moves the mouse pointer into it during a drag operation.
 */
MouseEvent.DRAG_ENTER = "dragenter";
/*
 * Occurs on an element when the user moves the mouse pointer out of it during a drag operation.
 */
MouseEvent.DRAG_LEAVE = "dragleave";
/*
 * Occurs periodically on an element while the mouse pointer is over it during a drag operation.
 */
MouseEvent.DRAG_OVER = "dragover";
/*
 * Occurs on the source element when the user starts the drag operation.
 */
MouseEvent.DRAG_START = "dragstart";
/*
 * Occurs on a possible target element when the dragged data is dropped on it.
 */
MouseEvent.DROP = "drop";

/*
 *
 * FIXME: Mozille needs to use :  DOMMouseScroll is for mozilla. http://www.adomas.org/javascript-mouse-wheel/
 */
MouseEvent.MOUSE_WHEEL = "mousewheel";

/*
* Occurs on a node when it is inserted into the document.
* IE7 and 8 not supported
*/
//MutationEvent.DOM_NODE_INSERTED = "DOMNodeInserted";
/*
* Occurs on a node when it is removed from its parent
*/
//MutationEvent.DOM_NODE_REMOVED = "DOMNodeRemoved";

// Keyboard Events
KeyboardEvent.KEY_DOWN = "keydown";
KeyboardEvent.KEY_UP = "keyup";
KeyboardEvent.KEY_PRESS = "keypress";

/*
 *
 *
 */
/*
 * GESTURE_ Only available in iOS (not android support : http://backtothecode.blogspot.com/2009/10/javascript-touch-and-gesture-events.html)
 */
/*TouchEvent.GESTURE_START = "gesturestart";
 TouchEvent.GESTURE_CHANGE = "gesturechange";
 TouchEvent.GESTURE_END = "gestureend";

 TouchEvent.TOUCH_DOWN = "touchdown";
 TouchEvent.TOUCH_UP = "touchup";*/

TouchEvent.TOUCH_START = "touchstart";
TouchEvent.TOUCH_MOVE = "touchmove";
TouchEvent.TOUCH_END = "touchend";
TouchEvent.TOUCH_CANCEL = "touchcancel";

// Overwrite if TABLET OR MOBILE
if (BrowserDetect.TABLET == true || BrowserDetect.MOBILE == true)
{
    MouseAndTouchEvent.MOUSE_DOWN = TouchEvent.TOUCH_START;
    MouseAndTouchEvent.MOUSE_MOVE = TouchEvent.TOUCH_MOVE;
    MouseAndTouchEvent.MOUSE_UP = TouchEvent.TOUCH_END;
}
else
{
    MouseAndTouchEvent.MOUSE_DOWN = MouseEvent.MOUSE_DOWN;
    MouseAndTouchEvent.MOUSE_MOVE = MouseEvent.MOUSE_MOVE;
    MouseAndTouchEvent.MOUSE_UP = MouseEvent.MOUSE_UP;
}
// Message Events
/*
 * Occurs when the postMessage method sends a message to the current window.
 */
MessageEvent.MESSAGE = "message";

MediaEvent.TIME_UPDATE = "timeupdate";

