function HomeStoryModule( data, startRatio ) {

	var _instance = Snail.extend(new Module());
	_instance.style.backgroundColor = UIColors.WHITE;

	_instance.onStoryClick;

	var _width, _height;

	var _ratio = 0;
	var _numOfStories = 0;

	var _storyExpandedW = 0;

	var _stories = [];

	_instance.init = function () {
		_instance.super.init();

		addStories();

		Assets.SCROLL_CONTROLLER.addEventListener(ScrollController.ON_SCROLL_MOVE, onScroll);
	};

	_instance.resize_desktop = function (width, height) {
		_storyExpandedW = width * startRatio;
		var storyCollapsedW = width * 0.2;

		_width = _storyExpandedW * _numOfStories;
		_height = height;

		_instance.style.width = _instance.getWidth() + "px";
		_instance.style.height = _height + "px";

		var xPos = 0;

		for(var i = 0; i < _numOfStories; i++) {
			var story = _stories[i];
			story.setExpandedWidth( _storyExpandedW );
			story.setCollapsedWidth( storyCollapsedW );
			story.setHeight( _height );
			story.setRatioOffset(i);
			story.setRatio(_ratio, true);

			TweenMax.set(story, {x:xPos});

			xPos += story.getWidth();
		}
	};

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
		_instance.setToRatio(ratio);
	}

	_instance.setToRatio = function( ratio ) {
		var xPos = 0;
		for(var i = 0; i < _numOfStories; i++) {
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
		model.maxFontSize = 20;

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