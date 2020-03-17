/**
 * Draws an arrow, where the control-points are the shape of the arrow-head
 * Based upon https://github.com/frogcat/canvas-arrow
 * @param ctx The canvas render context
 * @param startX
 * @param startY
 * @param endX
 * @param endY
 * @param [controlPoints]
 * @param [filled] Stroke or fill the arrow
 * @param [color]
 */
export const drawArrow = (
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  controlPoints: number[] | null = [0, 1, -10, 1, -10, 5],
  filled: boolean = true,
  color: string = '#000'
) => {
  if (!controlPoints) {
    controlPoints = [0, 1, -10, 1, -10, 5];
  }
  const oldShadow = ctx.shadowBlur;
  const oldShadowColor = ctx.shadowColor;
  const oldFill = ctx.fillStyle;
  const oldStroke = ctx.strokeStyle;

  const dx = endX - startX;
  const dy = endY - startY;
  const len = Math.sqrt(dx * dx + dy * dy);
  const sin = dy / len;
  const cos = dx / len;
  const a = [];
  a.push(0, 0);
  for (let i = 0; i < controlPoints.length; i += 2) {
    const x = controlPoints[i];
    const y = controlPoints[i + 1];
    a.push(x < 0 ? len + x : x, y);
  }
  a.push(len, 0);
  for (let i = controlPoints.length; i > 0; i -= 2) {
    const x = controlPoints[i - 2];
    const y = controlPoints[i - 1];
    a.push(x < 0 ? len + x : x, -y);
  }
  a.push(0, 0);

  ctx.shadowBlur = 1;
  ctx.shadowColor = color;
  ctx.fillStyle = color;
  ctx.strokeStyle = color;

  ctx.beginPath();
  for (let i = 0; i < a.length; i += 2) {
    const x = a[i] * cos - a[i + 1] * sin + startX;
    const y = a[i] * sin + a[i + 1] * cos + startY;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  filled ? ctx.fill() : ctx.stroke();

  ctx.shadowColor = oldShadowColor;
  ctx.shadowBlur = oldShadow;
  ctx.fillStyle = oldFill;
  ctx.strokeStyle = oldStroke;
};

/**
 * Draws a curved line between two co-ordinates in the canvas.
 * The line supports any curvature, even self-curves like a line with the same starting and ending co-ordinates.
 * Based upon: https://github.com/vasturiano/force-graph
 * @param ctx
 * @param sx
 * @param sy
 * @param ex
 * @param ey
 * @param curvature
 * @param width
 * @param color
 */
export const drawCurvedLine = (
  ctx: CanvasRenderingContext2D,
  sx: number,
  sy: number,
  ex: number,
  ey: number,
  curvature: number,
  width: number,
  color: string
) => {
  const oldShadow = ctx.shadowBlur;
  const oldShadowColor = ctx.shadowColor;
  const oldFill = ctx.fillStyle;
  const oldStroke = ctx.strokeStyle;

  ctx.beginPath();

  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  //Anti-aliasing
  ctx.shadowBlur = 2;
  ctx.shadowColor = color;

  ctx.moveTo(sx, sy);
  if (curvature === 0) {
    ctx.lineTo(ex, ey);
    ctx.stroke();
    return;
  }

  const lineLength = Math.sqrt(Math.pow(ex - sx, 2) + Math.pow(ey - sy, 2));
  if (lineLength > 0) {
    //Line angle
    const lineAngle = Math.atan2(ey - sy, ex - sx);
    //Control point distance
    const controlPointDistance = lineLength * curvature;
    //Control point
    const cp = {
      x:
        (sx + ex) / 2 +
        controlPointDistance * Math.cos(lineAngle - Math.PI / 2),
      y:
        (sy + ey) / 2 + controlPointDistance * Math.sin(lineAngle - Math.PI / 2)
    };
    ctx.quadraticCurveTo(cp.x, cp.y, ex, ey);
  } else {
    // Same point, draw a loop
    const distance = curvature * 70;
    const cps = [ex, ey - distance, ex + distance, ey];
    // @ts-ignore
    ctx.bezierCurveTo(...cps, ex, ey);
  }
  ctx.stroke();

  ctx.shadowColor = oldShadowColor;
  ctx.shadowBlur = oldShadow;
  ctx.fillStyle = oldFill;
  ctx.strokeStyle = oldStroke;
};

/**
 * Draws a dashed circle/arc
 * Based upon https://github.com/oychao/canvas-dashed-arc
 * @param ctx
 * @param centerX
 * @param centerY
 * @param radius
 * @param startAngle
 * @param endAngle
 * @param [parts] default = 30
 */
export const drawDashedCircle = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number,
  parts: number | null = 30,
  color: string = '#000'
) => {
  if (!parts) {
    parts = 30;
  }
  const oldShadow = ctx.shadowBlur;
  const oldShadowColor = ctx.shadowColor;
  const oldStroke = ctx.strokeStyle;

  //Anti-aliasing
  ctx.shadowBlur = 1;
  ctx.shadowColor = color;
  ctx.strokeStyle = color;

  const unitSegment = (endAngle - startAngle) / parts;
  ctx.beginPath();
  for (let i = 0; i < parts; i++) {
    const curStart = startAngle + unitSegment * i;
    const curEnd = curStart + unitSegment;
    if (i % 2 === 0) {
      ctx.arc(centerX, centerY, radius, curStart, curEnd);
    } else {
      ctx.moveTo(
        centerX + radius * Math.cos(curEnd),
        centerY + radius * Math.sin(curEnd)
      );
    }
  }
  ctx.stroke();

  ctx.shadowBlur = oldShadow;
  ctx.shadowColor = oldShadowColor;
  ctx.strokeStyle = oldStroke;
};

/**
 * Draws a round rectangle
 * based upon: https://stackoverflow.com/a/7838871
 * @param ctx
 * @param x
 * @param y
 * @param width
 * @param height
 * @param radius
 * @param [filled]
 * @param [strokes] An array of distances between each stroke (for different patterns).
 */
export const drawRoundRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  filled: boolean = true,
  color: string = '#000',
  strokes: number[] = []
) => {
  const oldFillStyle = ctx.fillStyle;
  const oldStrokeStyle = ctx.strokeStyle;
  const oldShadow = ctx.shadowBlur;
  const oldShadowColor = ctx.shadowColor;
  debugger;

  //Anti-aliasing
  ctx.shadowBlur = 1;
  ctx.shadowColor = color;

  if (width < 2 * radius) {
    radius = width / 2;
  }
  if (height < 2 * radius) {
    radius = height / 2;
  }

  if (filled) {
    ctx.fillStyle = color;
  } else {
    ctx.strokeStyle = color;
  }

  ctx.beginPath();
  ctx.setLineDash(strokes);
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
  filled ? ctx.fill() : ctx.stroke();

  ctx.fillStyle = oldFillStyle;
  ctx.strokeStyle = oldStrokeStyle;
  ctx.shadowBlur = oldShadow;
  ctx.shadowColor = oldShadowColor;
};

/**
 * Draws a filled circle
 * @param ctx
 * @param x
 * @param y
 * @param radius
 * @param [startAngle] default = 0
 * @param [endAngle] default = 2 * Math.PI
 * @param [filled] default = true
 */
export const drawCircle = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  startAngle: number = 0,
  endAngle: number = 2 * Math.PI,
  filled: boolean = true,
  color: string = '#000'
) => {
  const oldFillStyle = ctx.fillStyle;
  const oldStrokeStyle = ctx.strokeStyle;
  const oldShadow = ctx.shadowBlur;
  const oldShadowColor = ctx.shadowColor;

  //Anti-aliasing
  ctx.shadowBlur = 1;
  ctx.shadowColor = color;

  if (filled) {
    ctx.fillStyle = color;
  } else {
    ctx.strokeStyle = color;
  }

  ctx.beginPath();
  ctx.arc(x, y, radius, startAngle, endAngle, false);
  filled ? ctx.fill() : ctx.stroke();

  ctx.fillStyle = oldFillStyle;
  ctx.strokeStyle = oldStrokeStyle;
  ctx.shadowBlur = oldShadow;
  ctx.shadowColor = oldShadowColor;
};

export const drawRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  filled: boolean = true,
  color: string = '#000',
  strokes: number[] = []
) => {
  const oldFillStyle = ctx.fillStyle;
  const oldStrokeStyle = ctx.strokeStyle;
  const oldShadow = ctx.shadowBlur;
  const oldShadowColor = ctx.shadowColor;

  //Anti-aliasing
  ctx.shadowBlur = 1;
  ctx.shadowColor = color;

  if (filled) {
    ctx.fillStyle = color;
  } else {
    ctx.strokeStyle = color;
  }

  ctx.beginPath();
  ctx.setLineDash(strokes);
  ctx.rect(x, y, width, height);
  filled ? ctx.fill() : ctx.stroke();

  ctx.fillStyle = oldFillStyle;
  ctx.strokeStyle = oldStrokeStyle;
  ctx.shadowBlur = oldShadow;
  ctx.shadowColor = oldShadowColor;
};

/**
 * Draws a rounded rectangle with text inside of it
 * @param ctx
 * @param x
 * @param y
 * @param height
 * @param text
 * @param filled default = true
 * @param colorBackground
 * @param colorText
 * @param font
 * @param [roundRectY] Same as y, but may need manual tinkering
 * @param [fillTextY] Same as y, but may need manual tinkering
 */
export const drawTextOnRoundRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  height: number,
  text: string,
  filledBackground: boolean,
  filledForeGround: boolean,
  colorBackground: string,
  colorText: string,
  radius: number = 3,
  roundRectY: number = y,
  fillTextY: number = y
) => {
  const oldFont = ctx.font;
  const oldFillStyle = ctx.fillStyle;
  const oldStrokeStyle = ctx.strokeStyle;
  const oldLineWidth = ctx.lineWidth;
  const newFont = height - 10 + 'px' + oldFont.substring(oldFont.indexOf(' '));
  ctx.font = newFont;

  const textSize = ctx.measureText(text);
  debugger;
  drawRoundRect(
    ctx,
    x,
    roundRectY,
    textSize.width + 20,
    height,
    radius,
    filledBackground,
    colorBackground
  );

  if (filledForeGround) {
    ctx.fillStyle = colorText;
  } else {
    ctx.strokeStyle = colorText;
  }
  ctx.lineWidth = 1;

  filledForeGround
    ? ctx.fillText(text, x + 10, fillTextY + height / 1.5)
    : ctx.strokeText(text, x + 10, fillTextY + height / 1.5);

  ctx.font = oldFont;
  ctx.fillStyle = oldFillStyle;
  ctx.strokeStyle = oldStrokeStyle;
  ctx.lineWidth = oldLineWidth;
};

/**
 * Draws a rectangle with text in it
 * @param ctx
 * @param x
 * @param y
 * @param height
 * @param text
 * @param filled default = true
 * @param colorBackground
 * @param colorText
 * @param font
 * @param [fillTextX] Same as x, but may need manual tinkering
 * @param [fillTextY] Same as y, but may need manual tinkering
 * @param [strokes]
 */
export const drawTextOnRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  height: number,
  text: string,
  filledBackground: boolean,
  filledForeGround: boolean,
  colorBackground: string,
  colorText: string,
  fillTextX: number = x,
  fillTextY: number = y,
  strokes: number[] = []
) => {
  const oldFont = ctx.font;
  const oldFillStyle = ctx.fillStyle;
  const oldStrokeStyle = ctx.strokeStyle;
  const oldLineWidth = ctx.lineWidth;
  const newFont = height - 10 + 'px' + oldFont.substring(oldFont.indexOf(' '));
  ctx.font = newFont;
  ctx.fillStyle = colorBackground;

  const textSize = ctx.measureText(text);
  drawRect(
    ctx,
    x,
    y,
    textSize.width + 20,
    height,
    filledBackground,
    colorBackground,
    strokes
  );

  if (filledForeGround) {
    ctx.fillStyle = colorText;
  } else {
    ctx.strokeStyle = colorText;
  }
  ctx.lineWidth = 1;

  filledForeGround
    ? ctx.fillText(text, x + 10, fillTextY + height / 1.5)
    : ctx.strokeText(text, x + 10, fillTextY + height / 1.5);

  ctx.font = oldFont;
  ctx.fillStyle = oldFillStyle;
  ctx.strokeStyle = oldStrokeStyle;
  ctx.lineWidth = oldLineWidth;
};

/**
 * Draws fetched a an image from the given url and draws it to the screen
 * @param ctx
 * @param image
 * @param x
 * @param y
 * @param [width]
 * @param [height]
 */
export const drawImage = (
  ctx: CanvasRenderingContext2D,
  imageSrc: string,
  x: number,
  y: number,
  width: number = 0,
  height: number = 0
) => {
  const image = new Image();
  image.src = imageSrc;
  image.onload = () => {
    const newWidth = width === 0 ? image.width : width;
    const newHeight = width === 0 ? image.height : height;
    ctx.drawImage(image, x - width, y - height, newWidth, newHeight);
  };
};

export const drawTextBold = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  size: number,
  filled: boolean = true,
  color: string = '#000'
) => {
  const oldShadow = ctx.shadowBlur;
  const oldShadowColor = ctx.shadowColor;
  const oldLineWidth = ctx.lineWidth;
  //Anti-aliasing
  ctx.shadowBlur = 1;
  ctx.shadowColor = color;

  const oldFont = ctx.font;
  const newFont = size + 'px bold' + oldFont.substring(oldFont.indexOf(' '));
  ctx.font = newFont;
  ctx.lineWidth = 1;
  const textSize = ctx.measureText(text);

  if (filled) {
    const oldColor = ctx.fillStyle;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    ctx.fillStyle = oldColor
  } else {
    const oldColor = ctx.strokeStyle;
    ctx.strokeStyle = color;
    ctx.strokeText(text, x, y);
    ctx.strokeStyle = oldColor;
  }
  ctx.font = oldFont;
  ctx.shadowBlur = oldShadow;
  ctx.shadowColor = oldShadowColor;
  ctx.lineWidth = oldLineWidth;

  return textSize;
};

export const drawTextItalic = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  size: number,
  filled: boolean = true,
  color: string = '#000'
) => {
  const oldShadow = ctx.shadowBlur;
  const oldShadowColor = ctx.shadowColor;
  const oldLineWidth = ctx.lineWidth;
  //Anti-aliasing
  ctx.shadowBlur = 1;
  ctx.shadowColor = color;

  const oldFont = ctx.font;
  const newFont = size + 'px italic' + oldFont.substring(oldFont.indexOf(' '));
  ctx.font = newFont;
  ctx.lineWidth = 1;
  const textSize = ctx.measureText(text);

  if (filled) {
    const oldColor = ctx.fillStyle;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    ctx.fillStyle = oldColor
  } else {
    const oldColor = ctx.strokeStyle;
    ctx.strokeStyle = color;
    ctx.strokeText(text, x, y);
    ctx.strokeStyle = oldColor;
  }
  ctx.font = oldFont;
  ctx.shadowBlur = oldShadow;
  ctx.shadowColor = oldShadowColor;
  ctx.lineWidth = oldLineWidth;

  return textSize;
};

export const drawText = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  size: number,
  filled: boolean = true,
  color: string = '#000'
) => {
  const oldShadow = ctx.shadowBlur;
  const oldShadowColor = ctx.shadowColor;
  const oldLineWidth = ctx.lineWidth;
  //Anti-aliasing
  ctx.shadowBlur = 1;
  ctx.shadowColor = color;

  const oldFont = ctx.font;
  const newFont = size + 'px' + oldFont.substring(oldFont.indexOf(' '));
  ctx.font = newFont;
  ctx.lineWidth = 1;
  const textSize = ctx.measureText(text);
  if (filled) {
    const oldColor = ctx.fillStyle;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    ctx.fillStyle = oldColor
  } else {
    const oldColor = ctx.strokeStyle;
    ctx.strokeStyle = color;
    ctx.strokeText(text, x, y);
    ctx.strokeStyle = oldColor;
  }

  ctx.font = oldFont;
  ctx.shadowBlur = oldShadow;
  ctx.shadowColor = oldShadowColor;
  ctx.lineWidth = oldLineWidth;

  return textSize;
};
