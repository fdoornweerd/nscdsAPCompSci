const canvas1 = document.getElementById('canvas1');
const ctx1 = canvas1.getContext('2d');
 
const canvas2 = document.getElementById('canvas2');
const ctx2 = canvas2.getContext('2d');
 
function setUp(scale){
   canvas1.width = scale;
   canvas1.height = scale;
   canvas1.style.position = 'absolute';
   canvas2.width = scale;
   canvas2.height = scale;
   canvas2.style.position = 'absolute';
   if(scale<window.innerHeight){
       canvas1.style.left = (window.innerWidth-canvas1.width)/2+"px";
       canvas1.style.top = (window.innerHeight-canvas1.height)/2+"px";
       canvas2.style.left = (window.innerWidth-canvas2.width)/2+"px";
       canvas2.style.top = (window.innerHeight-canvas2.height)/2+"px";
   }
}
 
function checkBounded(pt){
   //if the magnitude is greater than 2 then it will go to infinity and not stay bound
   if(Math.sqrt(Math.pow(pt[0],2)+Math.pow(pt[1],2))<2){
       return true;
   }
   return false;
}
 
function itterate(pt){
   //f(x) = x^2+C
   //pt[0] --> current amount (x,y)
   //pt[1] --> C (starting number on graph) (R,I)
   //(2nd Layer of 2D array) pt[0](x)-->(real) pt[1](y)-->(immaginary)
   //for [[x,y],[R,I]] new point = [x^2-y^2+R, 2xy+I]
       //(x+yi)^2+r+Ii --> x^2+2xyi-y^2+r+Ii --> x^2-y^2+r(real part) + 2xyi+Ii(immaginary part)
 
   // cubed -> return [[Math.pow(pt[0][0],3)+pt[1][0]-3*pt[0][0]*Math.pow(pt[0][1],2),3*Math.pow(pt[0][0],2)*pt[0][1]+pt[1][1]-Math.pow(pt[0][1],3)],[pt[1][0],pt[1][1]]];
   // quarted-> return [[Math.pow(pt[0][0],4)-6*Math.pow(pt[0][0],2)*Math.pow(pt[0][1],2)+Math.pow(pt[0][1],4)+pt[1][0],4*Math.pow(pt[0][0],3)*pt[0][1]-4*pt[0][0]*Math.pow(pt[0][1],3)+pt[1][1]],[pt[1][0],pt[1][1]]];
 
  return [[Math.pow(pt[0][0],2)-Math.pow(pt[0][1],2)+pt[1][0],2*pt[0][0]*pt[0][1]+pt[1][1]],pt[1],pt[2]];
}
 
function initSet(scale){
   var pts = [];
   for(var y=0; y<(scale)+1; y++){
       for(var x=0; x<(scale)+1; x++){
           var pt = toPt([x,y],scale/4);
           if(checkBounded(pt)){
               pts.push([pt,pt,[x,y]]);
           }
       }
   }
   return pts;
}
 
function colorInSet(set,color){
   for(var i in set){
       ctx1.fillStyle = color;
       ctx1.beginPath();
       ctx1.arc(set[i][2][0],set[i][2][1],1,0,Math.PI*2);
       ctx1.fill();
   }
}
 
function colorInEscaped(escaped){
   for(var i in escaped){
       ctx1.fillStyle = escaped[i][1];
       ctx1.beginPath();
       ctx1.arc(escaped[i][0][0],escaped[i][0][1],1,0,Math.PI*2);
       ctx1.fill();
   }
}
 
function toPt(px,scale){
   var x = px[0]-canvas1.width/2;
   var y = px[1]-canvas1.height/2;
   return [x/scale,y/scale*-1]; 
}
 
function completeIteration(set,colors,iterationNum){
   var newSet = [];
   var escaped = [];
   for(var s in set){
       var output = itterate(set[s]);
       if(!checkBounded(output[0])){
           escaped.push([output[2],colors[iterationNum%colors.length]]);
       }
       else{
           newSet.push(output);
       }
   }
   return [newSet,escaped];
}

function zoom(scale,iterations,colors,inSetColor){
   var drag = false;
   var startPt = undefined;
   var zoomFrac = 1;
   var prevStartPx = [0,0];
   addEventListener('mousedown',function(evt){
       drag = true;
       startPt = [evt.x,evt.y];
       if(scale<window.innerHeight){
           startPt[0]-=(window.innerWidth-canvas2.width)/2;
           startPt[1]-=(window.innerHeight-canvas2.height)/2;
       }
   });
 
   addEventListener('mouseup',function(evt){
      
       var mouse = {
           x:evt.x,
           y:evt.y
       }
       if(scale<window.innerHeight){
           mouse.x-=(window.innerWidth-canvas2.width)/2;
           mouse.y-=(window.innerHeight-canvas2.height)/2;
       }
 
 
       if(startPt[0] >= 0 && startPt[0]<=scale && startPt[1] >= 0 && startPt[1]<=scale && mouse.x >= 0 && mouse.x <=scale && mouse.y >=0 && mouse.y <= scale){
           ctx2.clearRect(0,0,canvas2.width,canvas2.height);
           var newScale = (Math.abs(mouse.x-startPt[0]));
           if(mouse.x < startPt[0]){
               startPt = [mouse.x,mouse.y];
           }
 
           var scaledPx = [startPt[0]*zoomFrac,startPt[1]*zoomFrac];
           scaledPx[0]+=prevStartPx[0];
           scaledPx[1]+=prevStartPx[1];
           prevStartPx=scaledPx;
 
 
           var pt = toPt(scaledPx,scale/4);
 
           var pastZoomInfo = [];
           var newZoomFrac=newScale/scale;
           zoomFrac=zoomFrac*newZoomFrac;
           pastZoomInfo.push(zoomFrac);
 
           zoomDraw(pt,scale,iterations,pastZoomInfo,colors,inSetColor);
 
       }
 
       drag = false;
       startPt = undefined;
   });
 
   addEventListener('mousemove',function(evt){zoomBox(evt,scale,drag,startPt)});
}

function zoomBox(evt,scale,drag,startPt){
   if(drag && startPt[0] >= 0 && startPt[0]<=scale && startPt[1] >= 0 && startPt[1]<=scale){
       ctx2.clearRect(0,0,canvas2.width,canvas2.height);
       var mouse = {
           x:evt.x,
           y:evt.y
       }
       if(scale<window.innerHeight){
           mouse.x-=(window.innerWidth-canvas2.width)/2;
           mouse.y-=(window.innerHeight-canvas2.height)/2;
       }
 
       if(mouse.x >= 0 && mouse.x <=scale && mouse.y >=0 && mouse.y <= scale){
           ctx2.strokeRect(startPt[0],startPt[1],mouse.x-startPt[0],mouse.x-startPt[0]);
       }
   }
}

function zoomDraw(startPt,origonalScale,iterations,pastZoomInfo,colors,inSetColor){
   ctx1.clearRect(0,0,canvas1.width,canvas1.height);
 
   var set = zoomSet(origonalScale,startPt,pastZoomInfo,inSetColor);
   var escaped = [];
   for(var i=0; i<iterations; i++){
       pastEscaped = escaped;
       sets = completeIteration(set,colors,i);
       set = sets[0];
       escaped = pastEscaped.concat(sets[1]);
   }
 
   colorInSet(set,inSetColor);
   colorInEscaped(escaped);
}

function zoomSet(initialScale,startPt,pastZoomInfo,inSetColor){
   var pts = [];
 
   for(var x = 0; x<(initialScale); x++){
       for(var y=0; y<(initialScale); y++){
           var pt = [[(pastZoomInfo[0]*(x/(initialScale/4)))+startPt[0],-1*((pastZoomInfo[0]*(y/(initialScale/4))-startPt[1]))],[(pastZoomInfo[0]*(x/(initialScale/4)))+startPt[0],-1*((pastZoomInfo[0]*(y/(initialScale/4)))-startPt[1])],[x,y]];
           if(checkBounded(pt[0])){
               pts.push(pt);
               ctx1.fillStyle = inSetColor;
               ctx1.beginPath();
               ctx1.arc(x,y,1,0,Math.PI*2);
               ctx1.fill();
           }
       }
   }
   return pts
}

function init(scale,iterations){
   var inSetColor = 'black';
   var colors = [];
 
   //-------GRAYSCALE---------
   /* */
   for(var i =256; i>50; i-=2){
       colors.push('rgb('+i+','+i+','+i+')')
   }
   for(var i =50; i<256; i+=2){
       colors.push('rgb('+i+','+i+','+i+')')
   }
  
 
   //-------COLOR---------
   /*
   for(var b=256; b>0; b-=5){
       for(var r=256; r>0; r-=5){
           for(var g=256; g>0; g-=5){
               colors.push('rgb('+r+','+g+','+b+')')
           }
       }
   }*/
 
 
   setUp(scale);
   var set = initSet(scale);
   var escaped = [];
   for(var i=0; i<iterations; i++){
       pastEscaped = escaped;
       sets = completeIteration(set,colors,i);
       set = sets[0];
       escaped = pastEscaped.concat(sets[1]);
   }
 
   colorInSet(set,inSetColor);
   colorInEscaped(escaped);
 
 
   zoom(scale,iterations,colors,inSetColor);
}
 
 
init(400,400);
