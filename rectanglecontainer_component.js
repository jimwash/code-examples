define([
  'jquery',
  'underscore',
  'backbone',
  'rect_component'
], function ($, _, Backbone, Rect) {
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

  // Add a rectangle to the container
  // break up remaining space into 2 other containers
  RectContainer.prototype.addRect = function(width,height) {
      this.rect = new Rect(width,height);
      console.log("add rect:"+width+","+height);
      this.top =  new RectContainer(width,this.height-height);
      console.log("top:"+this.top.width+","+this.top.height);
      this.right = new RectContainer(this.width-width,this.height);
      console.log("right:"+this.right.width+","+this.right.height);
  };

  // Can the rectangle be contained within the given container
  RectContainer.prototype.canContain = function(rect) {
    console.log("rect w:"+rect.width);
    console.log("rect h:"+rect.height);
  	return (this.width >= rect.width && this.height >= rect.height);
  };


  // Compare rects to order the larger rects first
  // if size is same then use height to break tie (forces more consistency between browsers)
  /*
  var compareRects = function(a,b) {
    var cmp = (b.width*b.height) - (a.width*a.height);
    if (cmp === 0) {
      return b.height - a.height;
    }

    return cmp;
  };
  */

  // Find the next largest rectangle that this container can hold
  // add it and find the next largest rectangle it's remaining space can hold
  // continue until it can't hold any more
  RectContainer.prototype.findRect = function(rects) {
    console.log('r:'+rects.length)
  	for (var i=0;i<rects.length;i++) {
  		if (this.canContain(rects[i])) {
        console.log('addrect:'+i)
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

  RectContainer.prototype.clearRects = function(svg) {
  };

  // Draw the rectangles as added
  RectContainer.prototype.drawRects = function(svg,startx,starty) {
    if (typeof(startx) === 'undefined') {
      startx = 0;
    }
    if (typeof(starty) === 'undefined') {
      starty = 0;
    } 
    // console.log("Draw Location:"+startx+","+starty+"  Size:"+this.width+","+this.height);
    var retstr = "";

    if (this.rect) {

        console.log("Draw Location:"+startx+","+starty+"  Size:"+this.rect.width+","+this.rect.height);

        svg.append("rect")
        .style('fill','none')
        .style('stroke','black')
        .style('stroke-width','1px')
        .attr("x", startx+"px")
        .attr("y", starty+"px")
        .attr("width",this.rect.width+"px")
        .attr("height",this.rect.height+"px");

        if (this.top) {
          retstr+=this.top.drawRects(svg,startx,this.rect.height+starty);
        }
        if (this.right) {
          retstr+=this.right.drawRects(svg,this.rect.width+startx,starty);
        }
    }

    return retstr;
  };

  RectContainer.prototype.makeRects = function(rs) {
        var retval = [];
        for (var i=0;i<rs.length;i++) {
          retval.push(new Rect(rs[i].w,rs[i].h));
        }
        retval.sort(this.compareRects);

        return retval;
  };

  RectContainer.prototype.compareRects = function(a,b) {
    var cmp = (b.width*b.height) - (a.width*a.height);
    if (cmp === 0) {
      return b.height - a.height;
    }

    return cmp;
  };


  return RectContainer;
});