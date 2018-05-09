!function(){function buildCanvas(){_canvas=document.getElementById("pattern"),_canvas.style.position="absolute",_canvas.style.left="20px",_ctx=_canvas.getContext("2d")}function addListeners(){window.addEventListener("resize",handleResize),window.addEventListener("mousemove",handleMouseMove)}function buildRows(){for(var gapWidth=16,j=0,rowLength=15;rowLength>j;j++){var row="r"+j;_rowPos[row]={},_rowPos[row].posX=j%2==1?gapWidth/2+.5:.5,_rowPos[row].posX+=window.innerWidth,_rowPos[row].startX=0}}function draw(){var xPos,LINE_HEIGHT=_canvas.height/_numOfRows,yPos=0,strokeWidth=1.5,gapWidth=16;_ctx.clearRect(0,0,_canvas.width,_canvas.height),_ctx.strokeStyle="rgb(0, 0, 0)";for(var j=0;_numOfRows>j;j++){xPos=-_rowPos["r"+j].posX,_ctx.lineWidth=strokeWidth;for(var i=0,lineLength=500;lineLength>i&&(_ctx.beginPath(),_ctx.moveTo(xPos,yPos),_ctx.lineTo(xPos,yPos+LINE_HEIGHT),_ctx.closePath(),_ctx.stroke(),xPos+=gapWidth,!(xPos-strokeWidth>_canvas.width));i++);strokeWidth+=.5,yPos+=LINE_HEIGHT}}function render(){window.innerWidth>600&&draw(),requestAnimationFrame(render)}function handleMouseMove(e){_mousePos.x=e.x,_mousePos.y=e.y;var currentRowNum=getCurrentRow();if(-1===currentRowNum)return void(_prevRowNum=-1);var rowName="r"+currentRowNum,rowObj=_rowPos[rowName];currentRowNum!=_prevRowNum&&(rowObj.startX=_mousePos.x,_prevRowNum=currentRowNum);var destinPos=rowObj.posX+(_mousePos.x-rowObj.startX);0>destinPos?(destinPos=_canvas.width,_rowPos[rowName].posX=_canvas.width,_rowPos[rowName].startX=_mousePos.x):destinPos>3*_canvas.width&&(destinPos=0,_rowPos[rowName].posX=0,_rowPos[rowName].startX=_mousePos.x),TweenLite.killTweensOf(_rowPos[rowName]),TweenLite.to(_rowPos[rowName],1.5,{posX:destinPos,startX:_mousePos.x,ease:Quad.easeOut})}function getCurrentRow(){for(var LINE_HEIGHT=_canvas.height/_numOfRows,j=0;_numOfRows>j;j++){var topOfRow=_colContainer.clientHeight+15+LINE_HEIGHT*j,bottomOfRow=topOfRow+LINE_HEIGHT;if(_mousePos.y>topOfRow&&_mousePos.y<bottomOfRow)return j}return-1}function handleResize(){_canvas.style.top=_colContainer.clientHeight+15+"px",_canvas.width=window.innerWidth-40,_canvas.height=window.innerHeight-_colContainer.clientHeight-35-15,_numOfRows=window.innerHeight>780?15:window.innerHeight>700?12:window.innerHeight>600?10:8,draw()}var _numOfRows,_colContainer,_canvas,_ctx,_instance={},_prevRowNum=-1,_rowPos={},_mousePos={x:0,y:0};_instance.init=function(){_colContainer=document.querySelector(".col-container"),addListeners(),buildCanvas(),buildRows(),handleResize(),draw(),requestAnimationFrame(render)},window.Main=_instance}(),window.onload=Main.init;