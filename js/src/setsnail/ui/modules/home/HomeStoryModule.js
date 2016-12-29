function HomeStoryModule( data, startRatio, useCollapse ) {

	var _instance = Snail.extend(new Module());
	_instance.style.backgroundColor = UIColors.WHITE;

	_instance.onStoryClick;

	var _width = 0;
	var _height = 0;

	var _ratio = 0;
	var _numOfStories = 0;

	var _storyExpandedW = 0;
	var _storyCollapsedW = 0;

	var _stories = [];

	var _currRatio = 0;

	_instance.init = function () {
		_instance.super.init();
		addStories();

		Assets.SCROLL_CONTROLLER.addEventListener(ScrollController.ON_SCROLL_MOVE, onScroll);
		// updateStories();
	};

	_instance.resize_mobile = function(width, height) {
		if( BrowserDetect.DESKTOP ) {
			_instance.resize_desktop(width, height);
			return;
		}
		_storyExpandedW = width * startRatio;
		_storyCollapsedW = width * 1;
		_height = height;

		updateModuleSize();
		updateStories();
	};

	_instance.resize_tablet = function(width, height) {
		if( BrowserDetect.DESKTOP ) {
			_instance.resize_desktop(width, height);
			return;
		}
		_storyExpandedW = width * startRatio;
		_storyCollapsedW = width * 0.3;
		_height = height;

		updateModuleSize();
		updateStories();
	};

	_instance.resize_desktop = function (width, height) {
		_storyExpandedW = width * startRatio;
		_storyCollapsedW = width * 0.2;
		_height = height;

		updateModuleSize();
		updateStories();

		_instance.setToRatio(_currRatio);
	};

	function updateModuleSize() {
		_width = _storyExpandedW * _numOfStories;

		_instance.style.width = _instance.getWidth() + "px";
		_instance.style.height = _height + "px";
	}

	function updateStories() {
		for(var i = 0; i < _numOfStories; i++) {
			var story = _stories[i];
			story.setExpandedWidth( _storyExpandedW );
			story.setCollapsedWidth( _storyCollapsedW );
			story.setHeight( _height );
			story.setRatioOffset(i);

			// if(i == _numOfStories - 1) {
			// 	story.setLastStory();
			// }

			if(useCollapse) {
				story.setRatio(_ratio, true);
			} else {
				// if( BrowserDetect.MOBILE) {
				// 	story.setRatioNoOffset(0, true);
				// }else {
					story.setRatioNoOffset(1, true);
				// }
			}

			TweenMax.set(story, {x:_storyExpandedW * i});
		}
	}


	_instance.getExpandedStoryWidth = function() {
		return _storyExpandedW;
	};

	_instance.getWidth = function() {
		return _width;
	};

	_instance.getNumOfStories = function() {
		return _numOfStories;
	};

	_instance.kill = function() {
		Assets.SCROLL_CONTROLLER.removeEventListener(ScrollController.ON_SCROLL_MOVE, onScroll);
	};


	function onScroll() {
		var scroll = Assets.SCROLL_CONTROLLER.currentScroll.y;
		var offset = scroll;
		var width = _width;

		var ratio = offset / width;
		// console.log(ratio);
		_instance.setToRatio(ratio);
	}

	_instance.setToRatio = function( ratio ) {
		if(!useCollapse) { return; }

		_currRatio = ratio;

		var atIndex = Math.floor(ratio * _numOfStories) - 3;
		if(atIndex < 0) {
			atIndex = 0;
		}

		var scrollingToLast = false;

		var length = atIndex + 7;
		if( length > _numOfStories) {
			length = _numOfStories;
			scrollingToLast = true;
		}

		var xPos = _storyExpandedW * atIndex;
		for(var i = atIndex; i < length; i++) {
			var story = _stories[i];
			story.setRatio( ratio * _numOfStories);
			
			TweenMax.set(story, {x:xPos});

			xPos += story.getWidth();
		}
	};

	function addStories() {
		var stories = ContentManager.getChildrenByAttr(data, "name", "story");
		var modelId = getLongestStoryId(stories);

		var model = new TextAreaModel();
		model.maxFontSize = 18;
		if( BrowserDetect.MOBILE) {
			model.maxFontSize = model.minFontSize = 13;

		}

		_numOfStories = stories.length;
		for(var i = 0; i < _numOfStories; i++) {
			var story = new HomeStory(stories[i], _numOfStories - i, model);
			story.onStoryClick = onStoryClick;
			if( modelId == i ) {
				story.setBodyModelController();
			}
			_stories.push(story);
			_instance.appendChild(story);
			story.init();

			// TweenMax.set(story, {x:_storyExpandedW * i});

			//If last story
			if(useCollapse && i == _numOfStories - 1) {
				var reverseStories = [];
				for( var j = 0; j < 3; j++ ) {
					reverseStories.push(_stories[ _numOfStories - 2 - j ]);
				}
				story.reverseStories(reverseStories);
			}
		}
	}

	function onStoryClick( storyNumber ) {
		if(_instance.onStoryClick != null) {
			_instance.onStoryClick(_numOfStories - storyNumber + 1);
		}
	}

	function getLongestStoryId( stories ) {
		var highestCount = 0;
		var highsetId = -1;
		var l = stories.length;
		for(var i = 0; i < l; i++) {
			var bodyHtml = ContentManager.getChildByAttr(stories[i], "name", "body").innerHTML;
			if(bodyHtml.length > highestCount) {
				highestCount = bodyHtml.length;
				highsetId = i;
			}
		}
		return highsetId;
	}

	return _instance;

}