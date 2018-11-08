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
