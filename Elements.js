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
    //ctx.fillRect(this.rpoint.x, this.rpoint.y, this.width, this.height);

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
}

/*
Oggetto che rappresenta un poligono in movimeto
*/
function polygon(center, sides, size, strokeColor, shadowColor, rv, vx, vy, angle) {
	this.sides = sides;
	this.size = size;
	this.strokeColor = strokeColor.makeColor(1);
	this.shadowColor = shadowColor.makeColor(1);
	this.rotation = rv;
	this.rv = rv;
	this.translationX = 0;
  this.translationY = 0;
	this.vx = vx;
  this.vy = vy;
	this.angle = angle;
  this.vertices = [];
  this.center = center;
  this.effect = 0;

	this.draw = function(shadows) {
    setColors(this.strokeColor, this.shadowColor, null);
	  if (shadows) {
		  ctx.strokeStyle = this.shadowColor;
      ctx.fillStyle = this.shadowColor;
    }
	  else
		  ctx.strokeStyle = this.strokeColor;
		ctx.beginPath();

		ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
		for (var i=1; i<this.sides; i++)
			ctx.lineTo(this.vertices[i].x, this.vertices[i].y);
		ctx.closePath();
    ctx.fill();
		ctx.stroke();
    //aggiorno rotazione e traslazione solo quando non disegno le ombre
    if (!shadows) {
      ctx.lineWidth = 7;
      if (this.effect > 0) {
        var effectVertices = getVertices(this.center, this.effect, this.sides, this.rotation);
        ctx.beginPath();
        ctx.moveTo(effectVertices[0].x, effectVertices[0].y);
        for (var i=1; i<this.sides; i++)
          ctx.lineTo(effectVertices[i].x, effectVertices[i].y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        this.effect -= 4;
        var effectVertices = getVertices(this.center, this.effect, this.sides, this.rotation);
        ctx.beginPath();
        ctx.moveTo(effectVertices[0].x, effectVertices[0].y);
        for (var i=1; i<this.sides; i++)
          ctx.lineTo(effectVertices[i].x, effectVertices[i].y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        this.effect -= 4;
      }
      ctx.lineWidth = 1;
  		this.center.x += this.vx;
      this.center.y += this.vy;
    }
	}

	this.drawWithLights = function() {
    this.vertices = getVertices(this.center, this.size, this.sides, this.rotation);
    if (contains(this, mousePoint)) {
  		var s = this.size;
  		this.size = s+s/200;
  		this.draw(true)
  		this.size = s;
    }
		this.draw(false);
	}
}

/*
Oggetto che modella un cerchio
*/
  function ball(center, radius, strokeColor, shadowColor, initialVx, initialVy) {
  this.center = new point(center.x, center.y);
  this.radius = radius;
  this.strokeColor = strokeColor.makeColor(1);
  this.shadowColor = shadowColor.makeColor(1);
  this.vx = initialVx;
  this.vy = initialVy;
  this.line = false;

  this.angle = function() {
    return Math.atan2(this.vx, this.vy);
  }

  this.v = function() {
    return Math.sqrt(this.vx * this.vx + this.y * this.y);
  }

  this.draw = function(shadows) {
    setColors(this.strokeColor, this.shadowColor, null);
    if (shadows)
      ctx.strokeStyle = this.shadowColor;
    else
      ctx.strokeStyle = this.strokeColor;
    ctx.beginPath();
    ctx.arc(this.center.x, this.center.y, this.radius, 0, 2*Math.PI, false);
    ctx.fill();
    ctx.stroke();
  }

  this.drawWithLights = function() {
    if (this.line)
      drawTargetLine(this);
    var r = this.radius;
    if (mouseInCircle(this)) {
      this.radius += 0.001;
      this.draw(true);
    }
    this.radius = r;
    this.draw(false);
    this.borderBounce();
    this.move();
  }

  //sposta il centro di un passo
  this.move = function() {
    this.center.x += this.vx;
    this.center.y += this.vy;
    this.vy += gravity;
  }

  //modifica le componenti velocità se c'è un urto con un bordo
  this.borderBounce = function() {
    var nextCenter = new point(this.center.x + this.vx, this.center.y + this.vy);
    if (nextCenter.x + this.radius >= canvas.width || nextCenter.x - this.radius <= 0) {
      this.center.x = nextCenter.x > canvas.width/2 ? canvas.width - this.radius : this.radius;
      this.vx *= bounce;
    }
    if (nextCenter.y + this.radius >= canvas.height || nextCenter.y - this.radius <= 0) {
      this.center.y = nextCenter.y > canvas.height/2 ? canvas.height - this.radius : this.radius;
      this.vy *= bounce;
    }
  }

  //imposta nuove componenti velocità
  this.setSpeed = function(vx, vy) {
    this.vx = vx;
    this.vy = vy;
  }

  //cambia il colore dell'ombra
  this.changeShadowColor = function(newShadowColor) {
    this.shadowColor = newShadowColor.makeColor(1);
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
