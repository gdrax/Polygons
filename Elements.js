/*
Oggetto che rappresenta un rettangolo con gli angoli arrotondati
*/
function roundRectangle(width, height, shadowColor) {
  this.width = width;
  this.height = height;
  this.shadowColor = shadowColor.makeColor(1);
  this.color = new color(255, 255, 255).makeColor(1);
  this.radius = 10; //raggio degli angoli rotondi
  this.rpoint = null;
  this.arrowOffsetX = null; //distanza delle frecce laterali dal rettangolo
  //vertici delle frecce
  this.leftp1 = null;
  this.leftp2 = null;
  this.leftp3 = null;
  this.rightp1 = null;
  this.rightp2 = null;
  this.rightp3 = null;
  //per mostrare le frecce
  this.showLeftArrow = false;
  this.showRightArrow = true;

  //imposta la largheza del rettangolo
  this.setWidth = function(width) {
    this.width = width;
  }

  /*
  disegna il rettangolo
  @param point: punto di parenza del rettangolo (in altro a sx)
  @param shadows: true per disegnare solo l'ombra
  */
  this.draw = function(point, shadows) {
    //pulisco l'area
    setColors(null, null, null);
    ctx.fillRect(this.rpoint.x, this.rpoint.y, this.width, this.height);

    //disegno rettangolo
    ctx.beginPath();
    ctx.moveTo(this.rpoint.x + this.radius, this.rpoint.y);
    ctx.lineTo(this.rpoint.x + this.width - this.radius, this.rpoint.y);
    ctx.quadraticCurveTo(this.rpoint.x + this.width, this.rpoint.y, this.rpoint.x + this.width, this.rpoint.y + this.radius);
    ctx.lineTo(this.rpoint.x + this.width, this.rpoint.y + this.height - this.radius);
    ctx.quadraticCurveTo(this.rpoint.x + this.width, this.rpoint.y + this.height, this.rpoint.x + this.width - this.radius, this.rpoint.y + this.height);
    ctx.lineTo(this.rpoint.x + this.radius, this.rpoint.y + this.height);
    ctx.quadraticCurveTo(this.rpoint.x, this.rpoint.y + this.height, this.rpoint.x, this.rpoint.y + this.height - this.radius);
    ctx.lineTo(this.rpoint.x, this.rpoint.y + this.radius);
    ctx.quadraticCurveTo(this.rpoint.x, this.rpoint.y, this.rpoint.x + this.radius, this.rpoint.y);
    ctx.closePath();
    setColors(this.color, this.shadowColor, null);
    if (shadows)
      ctx.strokeStyle = this.shadowColor;
    else
      ctx.strokeStyle = this.color;
    ctx.stroke();
  }

  /*
  Disegna il rettangolo (con le ombre se contiene il mouse)
  @param startingPoint: punto di parenza del rettangolo (in altro a sx)
  @return true se il mouse si trova all'interno, false altrimenti
  */
  this.drawWithLights = function(startingPoint) {
    this.rpoint = startingPoint;
    var shadows = mouseInRectangle(this);
    //se il mouse si trova all'interno del rettangolo disegno le ombre
    if (shadows) {
      this.draw(new point(this.rpoint.x-this.rpoint.x/500, this.rpoint.y+this.rpoint.y/500), true);
    }
    this.draw(this.rpoint, false);
    return shadows;
  }

  /*
  Disegna una freccia (trinagolo)
  @param p1, p2, p3: vertici del triangolo
  @param s: offset per disegnare le ombre
  @shadows: true per disegnare l'ombra, false per disegnare il triangolo
  */
  this.drawArrow = function(p1, p2, p3, s, shadows) {
    ctx.beginPath();
    ctx.moveTo(p1.x - s, p1.y + s);
    ctx.lineTo(p2.x - s, p2.y + s);
    ctx.lineTo(p3.x - s, p3.y + s);
    ctx.lineTo(p1.x - s, p1.y + s);
    setColors(this.color, null, null);
    ctx.fill();
    setColors(this.color, this.shadowColor, null);
    if (shadows) {
      ctx.strokeStyle = this.shadowColor;
    }
    else
      ctx.strokeStyle = this.color;
    ctx.stroke();
  }

  /*
  Disegna le frecce con le ombre
  */
  this.drawArrowsWithLights = function() {
    this.arrowOffsetX = this.width/20; 	//distanza delle frecce dai lati del rettangolo e grandezza delle frecce
    //definisco vertici dei trinagoli
    this.leftp1 = new point(this.rpoint.x - this.arrowOffsetX, this.rpoint.y + this.height/2 - this.arrowOffsetX);
    this.leftp2 = new point(this.rpoint.x - this.arrowOffsetX*2, this.rpoint.y + this.height/2);
    this.leftp3 = new point(this.rpoint.x - this.arrowOffsetX, this.rpoint.y + this.height/2 + this.arrowOffsetX);
    this.rightp1 = new point(this.rpoint.x + this.width + this.arrowOffsetX, this.rpoint.y + this.height/2 - this.arrowOffsetX);
    this.rightp2 = new point(this.rpoint.x + this.width + this.arrowOffsetX*2, this.rpoint.y + this.height/2);
    this.rightp3 = new point(this.rpoint.x + this.width + this.arrowOffsetX, this.rpoint.y + this.height/2 + this.arrowOffsetX);

    //disegno le ombre della freccia di sinistra
    if (mouseInTriangle(this.leftp1, this.leftp2, this.leftp3) && this.showLeftArrow) {
      this.drawArrow(this.leftp1, this.leftp2, this.leftp3, this.height/1000, true);
      this.drawArrow(this.leftp1, this.leftp2, this.leftp3, -this.height/1000, true);
    }

    //disegno le ombre della freccia di destra
    if (mouseInTriangle(this.rightp1, this.rightp2, this.rightp3) && this.showRightArrow) {
      this.drawArrow(this.rightp1, this.rightp2, this.rightp3, this.height/1000, true);
      this.drawArrow(this.rightp1, this.rightp2, this.rightp3, -this.height/1000, true)
    }

    //disegno la freccia di sinistra
    if (this.showLeftArrow)
      this.drawArrow(this.leftp1, this.leftp2, this.leftp3, 0, false);

    //disegno la freccia di destra
    if (this.showRightArrow)
      this.drawArrow(this.rightp1, this.rightp2, this.rightp3, 0, false);
  }
}

/*
Oggetto che rappresenta un scritta circondata da un rettangolo
*/
function writingsRectangle(size, color, shadowColor, text) {
  this.size = size;
  this.color = color.makeColor(1);
  this.shadowColor = shadowColor.makeColor(1);
  this.text = text;
  this.radius = 10;
  this.wpoint = null;
  this.rpoint = null;
  this.width = ctx.measureText(text).width*5.3;
  this.height = this.size*1.5;

  //disegna il rettangolo con la scritta dentro
  this.draw = function(startingPoint, font) {
    this.wpoint = startingPoint;
    this.rpoint = new point(startingPoint.x - this.width*3/25 , startingPoint.y - this.size);
    setColors(null, null, null);
    ctx.fillRect(this.rpoint.x, this.rpoint.y, this.width, this.height);
    ctx.font = this.size+"px "+font;

    if (mouseInRectangle(this)) {
      this.drawShadow(new point(this.wpoint.x+this.size/500, this.wpoint.y-this.size/500));
      this.drawShadow(new point(this.wpoint.x-this.size/500, this.wpoint.y+this.size/500));
      this.drawRect(true);
    }
    setColors(this.color, this.shadowColor, null);
    ctx.strokeText(this.text, this.wpoint.x, this.wpoint.y);
    this.drawRect(false);

  }

  //disegna l'ombra
  this.drawShadow = function(point) {
    setColors(this.shadowColor, this.shadowColor, null);
    ctx.strokeText(this.text, point.x, point.y);
  }

  //disegna il rettangolo
  this.drawRect = function(shadows) {
    setColors(this.color, this.shadowColor, null);
    ctx.beginPath();
    ctx.moveTo(this.rpoint.x + this.radius, this.rpoint.y);
    ctx.lineTo(this.rpoint.x + this.width - this.radius, this.rpoint.y);
    ctx.quadraticCurveTo(this.rpoint.x + this.width, this.rpoint.y, this.rpoint.x + this.width, this.rpoint.y + this.radius);
    ctx.lineTo(this.rpoint.x + this.width, this.rpoint.y + this.height - this.radius);
    ctx.quadraticCurveTo(this.rpoint.x + this.width, this.rpoint.y + this.height, this.rpoint.x + this.width - this.radius, this.rpoint.y + this.height);
    ctx.lineTo(this.rpoint.x + this.radius, this.rpoint.y + this.height);
    ctx.quadraticCurveTo(this.rpoint.x, this.rpoint.y + this.height, this.rpoint.x, this.rpoint.y + this.height - this.radius);
    ctx.lineTo(this.rpoint.x, this.rpoint.y + this.radius);
    ctx.quadraticCurveTo(this.rpoint.x, this.rpoint.y, this.rpoint.x + this.radius, this.rpoint.y);
    ctx.closePath();
    if (shadows)
      ctx.strokeStyle = this.shadowColor;
    else
      ctx.strokeStyle = this.color;
    ctx.stroke();
  }

  //imposta il testo e ricalcola la larghezza del rettangolo
  this.setText = function(text) {
    this.text = text;
    this.width = ctx.measureText(text).width*this.size*3/25;
  }
}

/*
Oggetto che rappresenta un poligono in movimeto
*/
function polygon(sides, size, color, shadowColor, rv, vx, vy, angle, sB, dB) {
	this.sides = sides;
	this.size = size;
	this.color = color.makeColor(1);
	this.shadowColor = shadowColor.makeColor(1);
	this.rotation = 0;
	this.rv = rv;
	this.translationX = 0;
  this.translationY = 0;
	this.vx = vx;
  this.vy = vy;
	this.angle = angle;
  this.vertices = [];
  this.speedBonus = sB;
  this.doubleBall = dB;

	this.draw = function(center, shadows) {
    setColors(this.color, this.shadowColor, null);
	  if (shadows)
		  ctx.strokeStyle = this.shadowColor;
	  else
		  ctx.strokeStyle = this.color;
		ctx.beginPath();

		ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
		for (var i=1; i<this.sides; i++)
			ctx.lineTo(this.vertices[i].x, this.vertices[i].y);
		ctx.closePath();
    ctx.fill();
		ctx.stroke();
    //aggiorno rotazione e traslazione solo quando non disegno le ombre
    if (!shadows) {
  		this.rotation = (this.rotation + this.rv) % (Math.PI * 2);
  		this.translationX += this.vx;
      this.translationY += this.vy;
    }
	}

	this.drawWithLights = function(center) {
    for (var i=0; i<this.sides; i++) {
      this.vertices[i] = new point(center.x + this.size * Math.cos(i * 2 * Math.PI / this.sides + this.rotation) + this.translationX * Math.cos(this.angle),
                                   center.y + this.size * Math.sin(i * 2 * Math.PI / this.sides + this.rotation) + this.translationY * Math.sin(this.angle));
    }
    if (contains(this, mousePoint)) {
  		var s = this.size;
  		this.size = s+s/200;
  		this.draw(center, true)
  		this.size = s;
    }
		this.draw(center, false);
	}

  this.invertSpeed = function() {
    this.vx = -this.vx;
    this.vy = -this.vy;
  }
}

/*
Oggetto che modella un cerchio
*/
function ball(center, radius, color, shadowColor, initialVx, initialVy) {
  this.center = center;
  this.radius = radius;
  this.color = color.makeColor(1);
  this.shadowColor = shadowColor.makeColor(1);
  this.vx = initialVx;
  this.vy = initialVy;

  this.angle = function() {
    return Math.atan2(this.vx, this.vy);
  }

  this.v = function() {
    return Math.sqrt(this.vx * this.vx + this.y * this.y);
  }

  this.draw = function(shadows) {
    setColors(this.color, this.shadowColor, null);
    if (shadows)
      ctx.strokeStyle = this.shadowColor;
    else
      ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.center.x, this.center.y, this.radius, 0, 2*Math.PI, false);
    ctx.fill();
    ctx.stroke();
  }

  this.drawWithLights = function() {
    var r = this.radius;
    if (mouseInCircle(this.center, this.radius)) {
      this.radius += 0.001;
      this.draw(true);
    }
    this.radius = r;
    this.draw(false);
    this.borderBounce();
    this.move();
  }

  this.move = function() {
    this.center.x += this.vx;
    this.center.y += this.vy;
  }

  this.borderBounce = function() {
    var nextCenter = new point(this.center.x + this.vx, this.center.y + this.vy);
    if (nextCenter.x + this.radius >= canvas.width || nextCenter.x - this.radius <= 0)
      this.vx = -this.vx;
    if (nextCenter.y + this.radius >= canvas.height || nextCenter.y - this.radius <= 0)
      this.vy = -this.vy;
  }
}

/*
Un punto con coordinate x y
*/
function point(x, y) {
  this.x = x;
  this.y = y;

  this.subtract = function(v) {
    return new vector(v.x - this.x, v.y - this.y);
  }
}

/*
oggetto per generare colori
*/
function color(red, green, blue) {
	this.red = red;
	this.green = green;
	this.blue = blue;
	this.hex = red.toString(16)+green.toString(16)+blue.toString(16);
	this.color = "rgba(0, 0, 0, 0)";

	this.makeColor = function(opacity) {
		this.color = "rgba("+red+", "+green+", "+blue+", "+opacity+")";
		return this.color;
	}

	this.makeHexColor = function() {
		return "#"+this.hex;
	}
}
