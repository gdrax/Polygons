function detectBallCollision(ball, shape) {
  for (var i=0; i<shape.vertices.length; i++) {
    console.log(rectDistance(ball.center, rectToPoints(shape.vertices[i], shape.vertices[(i + 1)%shape.vertices.length])));
    if (rectDistance(ball.center, rectToPoints(shape.vertices[i], shape.vertices[(i + 1)%shape.vertices.length])) <= ball.radius && beetweenY(shape.vertices[i], shape.vertices[(i+1)%shape.vertices.length], ball.center)) {
      ball.vx = -ball.vx;
      ball.vy = -ball.vy;
    }
  }
}

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

//calcola se il semiasse orizzontale che parte da p incrocia il segmento v1-v2 (lato del poligono)
function crossing(v1, v2, p) {
  //retta orizzontale, non si incrocia
  if (v1.y == v2.y)
      return false
  //retta verticale
  if (v1.x == v2.x)
    //se la y del punto p è compresa nel segmento p si trova a sinistra della retta, si incrociano
    if (v1.x > p.x && beetweenY(v1, v2, p))
      return true;
    else
      return false;
  //se la y del punto è fuori dall'intervallo dei due vertici, non si incrociano
  if (!beetweenY(v1, v2, p) || (v1.x < p.x && v2.x < p.x))
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

//calcola se l'ordinata del punto p è compresa tra quelle dei vertici v1 e v2
function beetweenY(v1, v2, p) {
  if (p.y > Math.min(v1.y, v2.y) && p.y < Math.max(v1.y, v2.y))
    return true;
  else
    return false;
}

//calcola la distanza tra due punti
function distance(p1, p2) {
  return Math.sqrt((p1.x - p2.x)*(p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
}

function rectToPoints(p1, p2) {
  if (p1.x == p2.x)
    //retta verticale
    return new rect(null, p1.x);
  else
    return new rect((p1.y - p2.y)/(p1.x - p2.x), -p2.x*(p1.y - p2.y)/(p1.x - p2.x) + p2.y);
}

function rectDistance(p, r) {
  if (r.m == null)
    return distance(p, new point(r.q, p.y));
  else {
    r.generalEq();
    return Math.abs(r.a*p.x + r.b*p.y + r.c)/Math.sqrt(r.a*r.a + r.b*r.b);
  }
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

function rect(m, q) {
  this.m = m;
  this.q = q;
  this.a = null;
  this.b = null;
  this.c = null;

  this.generalEq = function() {
    this.a = -this.m;
    this.b = 1;
    this.c = -this.q;
  }

  this.computeMQ = function() {
    if (b != 0) {
      this.m = -this.a/this.b;
      this.q = -this.c/this.b;
    }
    else {
      this.m = null;
      this.q = null;
    }
  }
}
