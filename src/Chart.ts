import * as CJ from 'chart.js';

CJ.Chart.register([
  CJ.CategoryScale, CJ.LineController, CJ.LineElement, CJ.LinearScale,
  CJ.PointElement
]);

type Canvas = any;

export default class Chart {

    constructor(canvas: Canvas = document.createElement('canvas') ) {
        this.canvas = canvas;
    }

    readonly canvas;
}