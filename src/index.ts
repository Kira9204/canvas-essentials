import * as ctxTools from './ctxTools';
import * as ctxShapes from './ctxShapes';

(window as any).CanvasEssentials = {
  ...ctxTools,
  ...ctxShapes
};
