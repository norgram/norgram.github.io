function CaseTextModule(data){function addTop(){var topData=ContentManager.getChildByAttr(data,"name","top");null!=topData&&(_top=new TextArea(topData.innerHTML,Text.getNewReg(13)),_top.style.color=UIColors.FONT_DARK,_top.init(),_textAreas.push(_top),_instance.appendChild(_top))}function addMid(){var midData=ContentManager.getChildByAttr(data,"name","mid");null!=midData&&(_mid=new TextArea(midData.innerHTML,Text.getNewReg(13)),_mid.style.color=UIColors.FONT_DARK,_mid.init(),_textAreas.push(_mid),_instance.appendChild(_mid))}function addBot(){var botData=ContentManager.getChildByAttr(data,"name","bot");null!=botData&&(_bot=new TextArea(botData.innerHTML,Text.getNewReg(13)),_bot.style.color=UIColors.FONT_DARK,_bot.init(),_textAreas.push(_bot),_instance.appendChild(_bot))}function setModel(){_model=new TextAreaModel;for(var l=_textAreas.length,controlId=getLongestTextId(_textAreas),i=0;l>i;i++){var mode;mode=i==controlId?TextAreaModel.MODE_CONTROL:TextAreaModel.MODE_LISTEN,_textAreas[i].addModel(_model,mode)}}function getLongestTextId(textAreas){for(var highestCount=0,highsetId=-1,l=textAreas.length,i=0;l>i;i++){var bodyHtml=textAreas[i].getTextInstance().innerHTML;bodyHtml.length>highestCount&&(highestCount=bodyHtml.length,highsetId=i)}return highsetId}var _instance=Snail.extend(new Module);_instance.style.position="absolute";var _width,_height,_model,_top,_bot,_mid,_widthScale=1,_textAreas=[];return _instance.init=function(){var scaleData=data.getAttribute("data-width-scale");null!=scaleData&&(_widthScale=scaleData,console.log(scaleData)),addTop(),addMid(),addBot(),setModel()},_instance.resize_desktop=function(width,height){_width=.2*width,_height=height,_textHeightScale=.3;var margin=9,textWidth=(_width-2*margin)*_widthScale;null!=_top&&(_top.setSize(textWidth,_height*_textHeightScale),TweenMax.set(_top,{x:margin,y:SiteGuides.OFFSET_TOP})),null!=_mid&&(_mid.setSize(textWidth,_height*_textHeightScale),TweenMax.set(_mid,{x:margin,y:SiteGuides.getCenterOffset()})),null!=_bot&&(_bot.setSize(textWidth,_height*_textHeightScale),TweenMax.set(_bot,{x:margin,y:_height-SiteGuides.OFFSET_BOTOM-_bot.getTextInstance().offsetHeight+2*Text.getOffsetY(_bot.getTextInstance())}))},_instance.getWidth=function(){return _width},_instance}