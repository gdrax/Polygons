/*
Determina se due poligoni stanno collidendo o no
*/
function detectCollision(s1, s2) {
  //genero assi per il primo oggetto
  var axes = getAxes(s1);
  for (var i=0; i<axes.length; i++) {
    var axis = axes[i];
    //genero proiezioni delle due figure sull'asse
    var p1 = makeProjection(s1, axis);
    var p2 = makeProjection(s2, axis);
    if (!overlaps(p1, p2)) {
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
      return false;
    }
  }
  return true;
}

/*
Determina se un cerchio e un poligono collidono
*/
function detectCircleShapeCollision(circle, shape) {
  //genero gli assi per il poligono
  var axes = getAxes(shape);
  for (var i=0; i<axes.length; i++) {
    var axis = axes[i];
    var p1 = makeCircleProjection(circle, axis);
    var p2 = makeProjection(shape, axis);
    if (!overlaps(p1, p2)) {
      return false;
    }
  }

  //genero l'asse tra il centro del cerchio e il vertice più vicino ad esso del poligono
  var closestVertex = findClosestVertex(circle, shape);
  var axis = findCircleAxis(circle, closestVertex);
  var p1 = makeCircleProjection(circle, axis);
  var p2 = makeProjection(shape, axis);
  if (!overlaps(p1, p2)) {
    return false;
  }
  return true;
}

function detectCircleShapeCollision2(circle, shape) {
  for (var i=0; i<shape.vertices.length; i++) {
    var v1 = shape.vertices[i];
    var v2 = shape.vertices[(i+1)%shape.vertices.length];
    var edge = v1.subtract(v2).normalize();
    var proj = edge.dotp(circle.center);
    var showP = new ball(proj, 10, new color(255, 255, 255), new color(255, 255, 255), 0, 0).drawWithLights();
    if (distance(proj, circle.center) < circle.radius)
      return true;
    else
      return false;
    /*
    var length = distance(v1, v2);
    var axis = circle.center.subtract(v1).normalize();
    var dot = axis.dotp(edge);
    var closestPoint = new point(v1.x + (dot * (v2.x - v1.x)), v1.y + (dot * (v2.y - v1.y)));
    var showP = new ball(closestPoint, 10, new color(255, 255, 255), new color(255, 255, 255), 0, 0).drawWithLights();
    if (pointOnLine(v1, v2, closestPoint)) {
      return false;
    }
    var dist = distance(circle.center, closestPoint);
    if (dist < circle.radius)
      return true;
    else
      return false;*/
  }
}

/*
Genera gli assi di un poligono
*/
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
  //normalizzo gli assi
  for (axis in axes) {
    axis = axis.normalize();
  }
  return axes;
}

/*
Genera l'asse tra il centro del cerchio e il vertice del poligono più vicino
*/
function findCircleAxis(circle, closestVertex) {
  var edge = closestVertex.subtract(circle.center);
  return edge.normalize();
}

/*
Calcola gli estremi della proiezione di una figura su una retta
*/
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

/*
Calcola la proiezione di un cerchio su un asse
*/
function makeCircleProjection(circle, axis) {
  var normal = axis.perp();
  //trovo i punti del cerchio che corrispondono agli estremi della proiezione
  var v1 = new point(circle.center.x + (-normal.y * circle.radius), circle.center.y + (normal.x * circle.radius));
  var v2 = new point(circle.center.x + (normal.y * circle.radius), circle.center.y + (-normal.x * circle.radius));
  //proietto i due punti sull'asse
  var min = axis.dotp(v1);
  var max = min;
  var p = axis.dotp(v2);
  if (p < min)
    min = p;
  if (p > max)
    max = p;
  return new projection(min, max);
}

/*
Calcola se due proiezioni si sovrappongono
*/
function overlaps(p1, p2) {
  return  (!(p1.max < p2.min || p1.min > p2.max));
}

/*
Restituisce true se il punto è contenuto nella figura, false altrimenti
*/
function contains(shape, point) {
  var cn = 0;
  //conto quanti lati incrociano il semiasse orizzontale che parte dal punto 'point'
  for (var i=0; i<shape.vertices.length; i++) {
    if (crossing(shape.vertices[i], shape.vertices[(i+1)%shape.vertices.length], point))
      cn++;
  }
  //se un solo lato incrocia il semiasse, il punto è all'interno della figura (il modulo serve nel caso la figura sia concava)
  if (cn%2 == 1)
    return true;
  else
    return false;
}

/*
Calcola se il semiasse orizzontale che parte da p incrocia il segmento v1-v2 (lato del poligono)
*/
function crossing(v1, v2, p) {
  //retta orizzontale, non si incrocia
  if (v1.y == v2.y)
      return false
  //retta verticale
  if (v1.x == v2.x)
    //se la y del punto p è compresa nel segmento p si trova a sinistra della retta, si incrociano
    if (v1.x > p.x && betweenY(v1, v2, p))
      return true;
    else
      return false;
  //se la y del punto è fuori dall'intervallo dei due vertici, non si incrociano
  if (!betweenY(v1, v2, p) || (v1.x < p.x && v2.x < p.x))
    return false;
  //calcolo retta passante per i due vertici
  var r = new rect((v1.y - v2.y)/(v1.x - v2.x), (v1.x*v2.y - v2.x*v1.y)/(v1.x - v2.x));
  //calcolo la x dell'incrocio tra le due rette
  var x = (p.y - r.q)/r.m;
  //se il punto è a sinistra del punto di incontro si incrociano
  if (x > p.x)
    return true;
  else
    return false;
}

/*
Calcola se l'ordinata del punto p è compresa tra quelle dei vertici v1 e v2
*/
function betweenY(v1, v2, p) {
  if (p.y > Math.min(v1.y, v2.y) && p.y < Math.max(v1.y, v2.y))
    return true;
  else
    return false;
}

/*
Calcola se l'ascissa del punto p è compresa tra quelle dei vertici v1 e v2
*/
function betweenX(v1, v2, p) {
  if (p.x > Math.min(v1.x, v2.x) && p.x < Math.max(v1.x, v2.x))
    return true;
  else
    return false;
}

function pointOnLine(v1, v2, p) {
  return distance(v1, p) + distance(v2, p) == distance(v1, v2);
}

/*
Trova il vertice più vicino al centro del cerchio
*/
function findClosestVertex(circle, shape) {
  var minDistance = 2000;
  var closestVertex = null;
  for (var i=0; i<shape.vertices.length; i++) {
    if (distance(shape.vertices[i], circle.center) < minDistance)
      closestVertex = shape.vertices[i];
  }
  return closestVertex;
}

/*
Calcola la distanza tra due punti
*/
function distance(p1, p2) {
  return Math.sqrt((p1.x - p2.x)*(p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
}

/*==============Oggetti==============*/

function projection(min, max) {
  this.min = min;
  this.max = max;

  this.print = function() {
    console.log(min+" "+max);
  }
}

function vector(x, y) {
  this.x = x;
  this.y = y;

  //restituisce il vettore perpendicolare
  this.perp = function() {
    return new vector(-this.y, this.x);
  }

  //calcola il prodotto scalare
  this.dotp = function(p) {
    return this.x * p.x + this.y * p.y;
  }

  this.inverse = function() {
    return new vector(-this.x, -this.y);
  }

  this.normalize = function() {
    var div = Math.sqrt(this.x * this.x + this.y * this.y);
    return new vector(this.x/div, this.y/div);
  }
}

function rect(m, q) {
  this.m = m;
  this.q = q;
}
