//imposta i colori
function setColors(stroke, shadow, fill) {
  if (stroke != null)
    ctx.strokeStyle = stroke;
  else
    ctx.strokeStyle = backgroundColor;

  if (shadow != null) {
    ctx.shadowColor = shadow;
    ctx.shadowBlur = 10;
  }
  else
    ctx.shadowColor = backgroundColor;

  if (fill != null)
    ctx.fillStyle = fill;
  else
    ctx.fillStyle = backgroundColor;
}

/*
genera un numero random nell'intervallo (offset, offset+max]
*/
function rand(max, offset) {
  return Math.floor(Math.random()*max) + offset;
}

/*
Controlla se il mouse si trova nel rettangolo
*/
function mouseInRectangle(rect) {
  if (mousePoint.x >= rect.rpoint.x && mousePoint.x <= rect.rpoint.x + rect.width && mousePoint.y >= rect.rpoint.y && mousePoint.y <= rect.rpoint.y + rect.height)
    return true;
  else
    return false;
}

/*
Controlla se il mouse si trova all'interno del cerchio
*/
function mouseInCircle(circle) {
  if (distance(circle.center, mousePoint) <= circle.radius)
    return true;
  else
    return false;
}

/*
Cambia la velocità dei poligoni quando urtano un bordo
*/
function bouncePolygons() {
  for (var i=0; i<polygons.length; i++) {
    for (var j=0; j<polygons[i].vertices.length; j++) {
      var x = polygons[i].vertices[j].x;
      var y = polygons[i].vertices[j].y;
      //urto una parete verticale inverto la componente x
      if (x + polygons[i].vx >= canvas.width || x + polygons[i].vx <= 0) {
        polygons[i].vx = -polygons[i].vx;
        break;
      }
      //urto una parete orizzontale inverto la componente y
      if (y + polygons[i].vy >= canvas.height || y + polygons[i].vy <= 0) {
        polygons[i].vy = -polygons[i].vy;
        break;
      }
    }
  }
}

/*
Disegna una linea tratteggiata
*/
function drawDashLine(p1, p2, c) {
  setColors(c.makeColor(1), c.makeColor(1), null);
  ctx.setLineDash([8, 7]);
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
  ctx.setLineDash([]);
}

/*
Copia un poligono
*/
function clonePolygon(p) {
  var newP = new polygon(p.center, p.sides, p.size, new color(255, 255, 255), new color(255, 255, 255), p.rv, p.vx, p.vy, p.angle, p.speedBonus, p.doubleBall);
  newP.strokeColor = p.strokeColor;
  newP.shadowColor = p.shadowColor;
  newP.rotation = p.rotation;
  return newP;
}

/*
Trova le coordinate realative dentro il canvas
*/
function findRelativeCoordinates(x, y) {
  var offsetX = x;
  var offsetY = y;
  var ele = canvas;
  var i=0;
  while (ele) {
    offsetX -= ele.offsetLeft;
    offsetY -= ele.offsetTop;
    ele = ele.offsetParent;
  }
  return new point(offsetX, offsetY);
}

/*
Aggiorna le componenti veloctà della pallina
*/
function updateV(circle, norm) {
  var v = new vector(circle.vx, circle.vy);
  var n = norm.normalize();
  var dp = v.dotp(n);
  n.x *= -2*dp;
  n.y *= -2*dp;
  var newV = new vector(n.x + v.x, n.y + v.y);
  circle.vx = newV.x;
  circle.vy = newV.y;
}

/*
Disegna la linea di mira della palla
*/
function drawTargetLine(circle) {
  v = circle.center.subtract(mousePoint);
  oppositePoint = new point(circle.center.x - v.x, circle.center.y - v.y);
  drawDashLine(oppositePoint, circle.center, new color(255, 255, 255));
}
