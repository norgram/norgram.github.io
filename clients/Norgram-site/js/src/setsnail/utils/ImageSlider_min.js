function ImageSlider(urls){function tweenToImgId(){TweenMax.to(_imageContainer,1,{x:(_width+_spacing)*_currImgId,onUpdate:updateImgPos,ease:Expo.easeOut})}function resizeContent(){TweenMax.set(_mask,{width:_width,height:_height});for(var l=_images.length,xPos=0,i=0;l>i;i++){var img=_images[i];img.setSize(_width,_height),TweenMax.set(img,{x:xPos}),xPos+=_width+_spacing}_totalWidth=xPos,TweenMax.killTweensOf(_imageContainer),TweenMax.set(_imageContainer,{x:(_width+_spacing)*_currImgId}),updateImgPos()}function updateImgPos(){for(var l=_images.length,containerX=_imageContainer._gsTransform.x,i=0;l>i;i++){for(var img=_images[i],imgX=img._gsTransform.x;-containerX-_width-_spacing>imgX;)imgX+=_totalWidth;for(;imgX>-containerX+_width+_spacing;)imgX-=_totalWidth;TweenMax.set(img,{x:imgX})}}function setupImages(){for(var l=urls.length,xPos=0,i=0;l>i;i++){var img=new RetinaImage(urls[i]);img.setPreloader(new SlidePreloader("#f4f4f4","#e9e9e9")),img.init(),img.setResizeMode("insideBox"),img.setPosition("center/center"),img.setSize(_width,_height),TweenMax.set(img,{x:xPos}),_images.push(img),_imageContainer.appendChild(img),xPos+=_width+_spacing}_totalWidth=xPos}var _instance=document.createElement("div");_instance.style.position="absolute";var _mask=document.createElement("div");_mask.style.position="absolute",_mask.style.overflow="hidden";var _imageContainer=document.createElement("div");_imageContainer.style.position="absolute",_mask.appendChild(_imageContainer),_instance.appendChild(_mask);var _spacing=18,_width=0,_height=0,_images=[],_currImgId=0,_totalWidth=0;return _instance.init=function(){TweenMax.set(_mask,{width:_width,height:_height}),setupImages()},_instance.setSize=function(width,height){_width=width,_height=height,resizeContent()},_instance.nextImg=function(){_currImgId++,tweenToImgId()},_instance.prevImg=function(){_currImgId--,tweenToImgId()},_instance}