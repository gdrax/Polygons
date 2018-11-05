/*
Determina se due oggetti stanno collidendo o no
*/
function detectCollision(s1, s2) {
  //genero assi per il primo oggetto
  var axes = getAxes(s1);
  for (var i=0; i<axes.length; i++) {
    var axis = axes[i];
    //genero proiezioni delle due figure sull'asse
    var p1 = makeProjection(s1, axis);
    var p2 = makeProjection(s2, axis);
    if (!overlaps(p1, p2))
      return false;
  }
  //genero assi per il secondo oggetto
  var axes = getAxes(s2);
  for (var i=0; i<axes.length; i++) {
    var axis = axes[i];
    var p1 = makeProjection(s1, axis);
    var p2 = makeProjection(s2, axis);
    if (!overlaps(p1, p2))
      return false;
  }
  return true;
}

//restituisce gli assi di una figura
function getAxes(shape) {
  var axes;
  for (var i=0; i<shape.vetices.length; i++) {
    var p1 = shape.vertices[i];
    var p2 = shape.vertices[i + 1 == shape.vertices.legth ? 0 : i + 1];
    var edge = p1.subtract(p2);
    //perpendicolare al lato
    var normal = edge.perp();
    axes[i] = normal;
  }
  return axes;
}

//calcola gli estremi della proiezione di una figura su una retta
function makeProjection(shape, axis) {
  var min = axis.dotp(shape.vertices[0]);
  var max = min;
  for (var i=0; i<shape.vertices.legth; i++) {
    var p = axis.dotp(shape.vertices[i]);
    if (p < min)
      min = p;
    if (p > max)
      max = p;
  }
  return new projection(min, max);
}

function overlaps(p1, p2) {
  if (p1.max < p2.min || p1.min > p2.max)
    return false;
  else
    return true;
}

/*==============Oggetti==============*/

function projection(min, max) {
  this.min = min;
  this.max = max;
}

function vector(a, b) {
  this.a = a;
  this.b = b;

  this.subtract = function(v) {
    return new vector(v.a - this.a, v.b - this.b);
  }

  //restituisce il vettore perpendicolare
  this.perp = function() {
    return new vector(this.a, -this.b);
  }

  //calcola il prodotto scalare
  this.dotp = function(p) {
    return this.a * p.x + this.b * p.y;
  }
}
