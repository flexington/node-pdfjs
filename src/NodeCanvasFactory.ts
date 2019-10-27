import * as assert from 'assert';
import { createCanvas } from 'canvas';

export default class NodeCanvasFactory {
    /**
     * create
     */
    public create(height: number, width: number) {
        assert(width > 0 && height > 0, 'Invalid canvas size.');
        let canvas = createCanvas(width, height);
        let context = canvas.getContext('2d');
        return { canvas: canvas, context: context };
    }

    /**
     * reset
     */
    public reset(canvasAndContext, width, height) {
        assert(canvasAndContext.canvas, 'Canvas is not specified.');
        assert(width > 0 && height > 0, 'Invalid canvas size.');
        canvasAndContext.canvas.width = width;
        canvasAndContext.canvas.height = height;

    }

    /**
     * destroy
     */
    public destroy(canvasAndContext) {
        assert(canvasAndContext.canvas, 'Canvas is not specified.');
        assert(canvasAndContext.context, 'Context is not specified.');
        canvasAndContext.canvas.width = 0;
        canvasAndContext.canvas.height = 0;
        canvasAndContext.canvas = null;
        canvasAndContext.context = null;
    }
}