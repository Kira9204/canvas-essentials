/**
 * Given a window mouse event, returns the mouse position inside the canvas.
 * The canvas can be of any resolution, and for optimization you can store away the rectangle
 * shape and send that in instead. Just remember that if you do, the BoundingClientRect needs to be
 * replaced by the canvas.width and canvas.height values.
 * The expected co-ordinate system for the canvas is a top-left 0,0.
 *
 * @param canvas
 * @param evt
 * @returns {{x: number, y: number}}
 */
export type Rect = {
  top: number;
  bottom: number;
  left: number;
  right: number;
  //Use element width instead of BoundingClientRect value!
  width: number;
  //Use element width instead of BoundingClientRect value!
  height: number;
};
export const getCanvasMousePos = (
  evt: MouseEvent,
  canvas: HTMLCanvasElement & Rect
) => {
  const rect = canvas.getBoundingClientRect
    ? canvas.getBoundingClientRect()
    : canvas;
  return {
    x: ((evt.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
    y: ((evt.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height
  };
};

/**
 * Converts a float to an integer in the fastest way possible.
 * This avoids the very slow browser inter-polarization, and allows for pixel perfect drawings.
 * If you have a lot of movement the animations using this function will appear pretty jagged.
 * Based upon https://seblee.me/2011/02/html5-canvas-sprite-optimisation/
 * @param x The float that will be converted to an int.
 * @returns {number} A rounded int
 */
export const fastInt = (x: number) => {
  return (x + 0.5) | 0;
};

/**
 * Enables or disables Anti-Aliasing when drawing lines
 * Note: For simple shapes and lines, i recommend using shadow-blurs instead.
 * @param ctx
 * @param [val]
 */
export const setEnableLineAA = (
  ctx: CanvasRenderingContext2D,
  val: boolean = true
) => {
  const tv = val ? 0.5 : 1;
  ctx.translate(tv, tv);
};

/**
 * Enables or disables Anti-Aliasing when drawing images.
 * If the browser does not support image smoothing, nothing will be done.
 * @param ctx
 * @param [val]
 */
export const setEnableImageAA = (
  ctx: CanvasRenderingContext2D,
  val: boolean = true
) => {
  if (ctx.imageSmoothingEnabled !== undefined) {
    ctx.imageSmoothingEnabled = val;
    ctx.imageSmoothingQuality = 'high';
  }
};

/**
 * Resets the canvas to a "standard" top left co-ordinate system.
 * @param ctx
 */
export const resetTransformationMatrix = (ctx: CanvasRenderingContext2D) => {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
};

/**
 * If you intend to draw on-top of a canvas with a different transformation matrix, this will be your life-saver.
 * @param ctx
 * @param funcArr
 */
export const drawUsingDefaultTransform = (
  ctx: CanvasRenderingContext2D,
  funcArr: Function[]
) => {
  ctx.save();
  resetTransformationMatrix(ctx);
  for (let i = 0; i < funcArr.length; i++) {
    funcArr[i]();
  }
  ctx.restore();
};

/**
 * Given an existing canvas in the DOM, properly set up the internal pixel resolution and density
 * @param queryStr
 * @param scale
 */
export const setupCanvas = (queryStr: string, scale: number = 1) => {
  const c = <HTMLCanvasElement>document.querySelector(queryStr);
  if (!c) {
    return null;
  }

  c.width = c.clientWidth * scale;
  c.height = c.clientHeight * scale;

  const ctx = c.getContext('2d');
  resetTransformationMatrix(ctx);
  setEnableLineAA(ctx);
  setEnableImageAA(ctx);

  return c ? ctx : null;
};
