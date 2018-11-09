/*
Determina se due oggetti stanno collidendo o no
*/
function detectCollision(s1, s2) {
  //genero assi per il primo oggetto
  var axes = getAxes(s1);
  console.log(axes.length);
  for (var i=0; i<axes.length; i++) {
    var axis = axes[i];
    //genero proiezioni delle due figure sull'asse
    var p1 = makeProjection(s1, axis);
    var p2 = makeProjection(s2, axis);
    if (!overlaps(p1, p2)) {
      console.log("p1 not overlaps");
      return false;
    }
  }
  //genero assi per il secondo oggetto
  var axes = getAxes(s2);
  for (var i=0; i<axes.length; i++) {
    var axis = axes[i];
    var p1 = makeProjection(s1, axis);
    var p2 = makeProjection(s2, axis);
    if (!overlaps(p1, p2)) {
      console.log("p2 not overlaps");
      return false;
    }
  }
  return true;
}

//restituisce gli assi di una figura
function getAxes(shape) {
  var axes = [];
  for (var i=0; i<shape.vertices.length; i++) {
    var v1 = shape.vertices[i];
    var v2 = shape.vertices[(i+1)%shape.vertices.length];
    var edge = v1.subtract(v2);
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
  for (var i=1; i<shape.vertices.length; i++) {
    var p = axis.dotp(shape.vertices[i]);
    if (p < min)
      min = p;
    if (p > max)
      max = p;
  }
  return new projection(min, max);
}

//calcola se due proiezioni si sovrappongono
function overlaps(p1, p2) {
  if (p1.max < p2.min || p1.min > p2.max)
    return false;
  else
    return true;
}

//restituisce true se il punto è contenuto nella figura, false altrimenti
function contains(shape, point) {
  var cn = 0;
  for (var i=0; i<shape.vertices.length; i++) {
    if (crossing(shape.vertices[i], shape.vertices[(i+1)%shape.vertices.length], point))
      cn++;
  }
  if (cn%2 == 0)
    return false;
  else
    return true;
}

function crossing(e1, e2, p) {
  //UNA RETTA E ORIZZONTALE
}

/*==============Oggetti==============*/

function projection(min, max) {
  this.min = min;
  this.max = max;
}

function vector(a, b) {
  this.a = a;
  this.b = b;

  //restituisce il vettore perpendicolare
  this.perp = function() {
    return new vector(-this.b, this.a);
  }

  //calcola il prodotto scalare
  this.dotp = function(p) {
    return this.a * p.x + this.b * p.y;
  }
}

function rect(a, b, c) {
  this.a = a;
  this.b = b;
  this.q = q;
  this.m = a==0 ? null : a/b;
}
