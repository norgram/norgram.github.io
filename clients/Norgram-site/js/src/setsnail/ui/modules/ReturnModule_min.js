function ReturnModule(width){function addArrow(){_arrow=new RetinaImage("assets/images/logo/arrow-left.png",Assets.RETINA_HANDLE,onArrowLoaded),_arrow.init()}function onArrowLoaded(){_arrow.getContent().style.transform="rotatey(180deg)",positionArrow(),_instance.appendChild(_arrow)}function positionArrow(){TweenMax.set(_arrow,{x:17,y:52})}function onClick(){Assets.SCROLL_CONTROLLER.scrollToTop(1,Expo.easeInOut)}var _instance=Snail.extend(new Module);_instance.style.backgroundColor=UIColors.WHITE,_instance.style.cursor="pointer";var _height,_line,_width=null!=width?width:120;return _instance.init=function(){addArrow(),Touchable.apply(_instance),_instance.onClick(onClick)},_instance.addLine=function(color){_line=document.createElement("div"),_line.style.position="absolute",_line.style.backgroundColor=color,_instance.appendChild(_line)},_instance.resize_desktop=function(width,height){_height=height,TweenMax.set(_instance,{width:_instance.getWidth(),height:_height}),null!=_line&&TweenMax.set(_line,{width:1,height:_height,x:0}),_arrow.isLoaded()&&positionArrow()},_instance.setWidth=function(width){_width=width,_arrow.isLoaded()&&positionArrow()},_instance.getWidth=function(){return _width},_instance}