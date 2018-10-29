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
  var axes = getAxis(s2);
  for (var i=0; i<axes.length; i++) {
    var axis = axes[i];
    var p1 = makeProjection(s1, axis);
    var p2 = makeProjection(s2, axis);
    if (!overlaps(p1, p2))
      return false;
  }
  return true;
}

function getAxes(shape) {
  var axes;
  for (var i=0; i<shape.vetices.length; i++) {
    var p1 = shape.vertices[i];
    var p2 = shape.vertices[i + 1 == shape.vertices.legth ? 0 : i + 1];
    var edge = subtract(p1, p2);
    var normal = perp(edge);
    axes[i] = normal; 
  }
}





/*==============Oggetti==============*/

function projection(min, max) {
  this.min = min;
  this.max = max;
}

function axis(a, b) {
  this.a = a;
  this.b = b;
}
