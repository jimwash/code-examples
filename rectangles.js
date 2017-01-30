// Container for rectangles
var RectContainer = function(width,height) {
    this.width = width;
    this.height = height;
    this.x = 0;
    this.y = 0;

    this.right = null;
    this.top = null;

    this.rect = null;
};

// Rectangle 
var Rect = function(width,height) {
	this.width = width;
	this.height = height;
};

// Add a rectangle to the container
// break up remaining space into 2 other containers
RectContainer.prototype.addRect = function(width,height) {
    this.rect = new Rect(width,height);
    console.log("add rect:"+width+","+height);
    // this.top =  new RectContainer(this.width,this.height-height)
    this.top =  new RectContainer(width,this.height-height);
    console.log("top:"+this.top.width+","+this.top.height);
    this.right = new RectContainer(this.width-width,this.height);
    console.log("right:"+this.right.width+","+this.right.height);
};

// Can the rectangle be contained within the given container
RectContainer.prototype.canContain = function(rect) {
	return (this.width >= rect.width && this.height >= rect.height);
};


// Compare rects to order the larger rects first
// if size is same then use height to break tie (forces more consistency between browsers)
var compareRects = function(a,b) {
  var cmp = (b.width*b.height) - (a.width*a.height);
  if (cmp == 0) {
    return b.height - a.height;
  }

  return cmp;
};

// Find the next largest rectangle that this container can hold
// add it and find the next largest rectangle it's remaining space can hold
// continue until it can't hold any more
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

// print the locations and dimentions of rectangles
RectContainer.prototype.printRects = function(startx,starty) {
  if (typeof(startx) === 'undefined') {
    startx = 0;
  }
  if (typeof(starty) === 'undefined') {
    starty = 0;
  }  
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

// Draw the rectangles as added
RectContainer.prototype.drawRects = function(svg,startx,starty) {
  if (typeof(startx) === 'undefined') {
    startx = 0;
  }
  if (typeof(starty) === 'undefined') {
    starty = 0;
  } 
  console.log("Location:"+startx+","+starty+"  Size:"+this.width+","+this.height);
  var retstr = "";

  if (this.rect) {
      /* Example to display Text using D3.js */
      svg.append("rect")
      .style('fill','none')
      .style('stroke','black')
      .style('stroke-width','1px')
      .attr("x", startx+"px")
      .attr("y", starty+"px")
      .attr("width",this.width+"px")
      .attr("height",this.height+"px");

      if (this.top) {
        retstr+=this.top.drawRects(svg,startx,this.rect.height+starty);
     }
     if (this.right) {
      retstr+=this.right.drawRects(svg,this.rect.width+startx,0+starty);
     }
  }

  return retstr;
};


// Provide some test data
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

// Show sorted rects
//rects.forEach(function(elem,idx){
//   console.log("ELEM 1:"+elem.width+","+elem.height)
//})

// Put the rects on a sheet
var sheet = new RectContainer(400,400);
sheet.findRect(rects);

// sheet.printRects();

//
// print Rects that couldn't fit
rects.forEach(function(element,idx) {
  console.log("Didn't fit:"+element.width+","+element.height);
});


// Using d3 draw the rectangles and their positions
var svg = d3.select("#rectangle")
.append("svg")
.attr("width", "100%")
.attr("height", "100%");

sheet.drawRects(svg); 