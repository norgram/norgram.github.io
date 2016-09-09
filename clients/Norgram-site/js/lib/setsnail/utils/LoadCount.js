function LoadCount(totalItems)
{
	var _itemsLoaded 		= 0;
	var _callback			= null;
	var _totalItems 		= totalItems;
	var _allLoaded 			= false;
	
	if(isNaN(_totalItems))
	{
		_totalItems = 0;
	}
		
	this.setCallback = function(callback)
	{
		_callback = callback;
	}
	
	this.setCount = function(totalItems)
	{
		_totalItems = totalItems;
	}
	
	this.getCount = function()
	{
		return _totalItems;
	}
	
	
	
	
	this.loaded = function()
	{
		return _allLoaded;	
	}
	
	this.count = function()
	{
		_itemsLoaded += 1;
		
		if(_itemsLoaded == _totalItems)
		{
			_allLoaded = true;
			
			if(_callback)
			{
				if(BrowserDetect.TABLET)
				{
					setTimeout(_callback, 1000 * .1);
				}
				else
				{
					_callback();		
				}
			}
		}
	}
}
