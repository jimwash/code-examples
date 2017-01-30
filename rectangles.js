/* jshint esversion: 6 */
// order rectangles by size
var RectContainer = function(width,height) {
    this.width = width;
    this.height = height;
    this.x = 0;
    this.y = 0;

    this.right = null;
    this.top = null;

    this.rect = null;
};

var Rect = function(width,height) {
	this.width = width;
	this.height = height;
};

RectContainer.prototype.addRect = function(width,height) {
    this.rect = new Rect(width,height);
    console.log("add rect:"+width+","+height);
    // this.top =  new RectContainer(this.width,this.height-height)
    this.top =  new RectContainer(width,this.height-height);
    console.log("top:"+this.top.width+","+this.top.height);
    this.right = new RectContainer(this.width-width,this.height);
    console.log("right:"+this.right.width+","+this.right.height);
};

RectContainer.prototype.canContain = function(rect) {
	return (this.width >= rect.width && this.height >= rect.height);
};


var compareRects = function(a,b) {
	return (b.width*b.height) - (a.width*a.height);
};


RectContainer.prototype.findRect = function(rects) {
	for (var i=0;i<rects.length;i++) {
		if (this.canContain(rects[i])) {
			this.addRect(rects[i].width,rects[i].height);
			rects.splice(i,1);
			break;
		}
	}

	if (this.right !== null) {
        this.right.findRect(rects);
	}

	if (this.top !== null) {
        this.top.findRect(rects);
	}
};


RectContainer.prototype.printRects = function(startx=0,starty=0) {
  if (this.rect) {
  	 console.log("Location:"+startx+","+starty+"  Size:"+this.rect.width+","+this.rect.height);
     if (this.top) {
  	    this.top.printRects(startx,this.rect.height+starty);
     }
     if (this.right) {
     	this.right.printRects(this.rect.width+startx,0+starty);
     }
  }
};


RectContainer.prototype.divRects = function(svg,startx=0,starty=0) {

  console.log("Location:"+startx+","+starty+"  Size:"+this.width+","+this.height);
  var retstr = "";

  if (this.rect) {
      // retstr+="<div style='position:absolute;border-style:solid;border-width:1px;left:"+startx+"px;top:"+starty+"px;width:"+this.rect.width+"px;height:"+this.rect.height+"px;'></div>";

      /* Example to display Text using D3.js */
      svg.append("rect")
      .style('fill','none')
      .style('stroke','black')
      .style('stroke-width','1px')
      .attr("x", startx+"px")
      .attr("y", starty+"px")
      .attr("width",this.width+"px")
      .attr("height",this.height+"px")

      if (this.top) {
        retstr+=this.top.divRects(svg,startx,this.rect.height+starty);
     }
     if (this.right) {
      retstr+=this.right.divRects(svg,this.rect.width+startx,0+starty);
     }
  }

  return retstr;
};

var rects = [ new Rect(200,300), new Rect(50,10), new Rect(20,60), new Rect(80,30),
              new Rect(10,10), new Rect(10,10), new Rect(10,10),  new Rect(10,10),
              new Rect(10,10), new Rect(10,10), new Rect(10,10),  new Rect(10,10),
              new Rect(10,10), new Rect(10,10), new Rect(10,10),  new Rect(10,10),
              new Rect(10,10), new Rect(10,10), new Rect(10,10),  new Rect(10,10),
              new Rect(10,10), new Rect(10,10), new Rect(10,10),  new Rect(10,10),
              new Rect(10,10), new Rect(10,10), new Rect(10,10),  new Rect(10,10),
              new Rect(10,10), new Rect(10,10), new Rect(10,10),  new Rect(10,10),
              new Rect(10,10), new Rect(10,10), new Rect(10,10),  new Rect(10,10),
              new Rect(10,10), new Rect(10,10), new Rect(10,10),  new Rect(10,10),
              new Rect(10,10), new Rect(10,10), new Rect(10,10),  new Rect(10,10),
              new Rect(100,200), new Rect(200,200), new Rect(200,100), new Rect(100,120)];

rects.sort(compareRects);
var sheet = new RectContainer(400,400);
sheet.findRect(rects);
sheet.printRects();

//
// print left overs
rects.forEach(function(element,idx) {
  console.log("Didn't fit:"+element.width+","+element.height);
});

var svg = d3.select("#rectangle")
.append("svg")
.attr("width", "100%")
.attr("height", "100%")

sheet.divRects(svg); 