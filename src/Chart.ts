import * as CJ from 'chart.js';

CJ.Chart.register([
  CJ.CategoryScale, CJ.LineController, CJ.LineElement, CJ.LinearScale,
  CJ.PointElement
]);

type Canvas = any;

export default class Chart {

    readonly canvas : Canvas;
    readonly #_chart: CJ.Chart;

    constructor(canvas: Canvas = document.createElement('canvas') ) {
        this.canvas = canvas;

        this.#_chart = new CJ.Chart(canvas,
        {
            type: 'line',
            data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
            label: '# of Votes',
            data: [[0,0], [1,1]],
            borderColor: 'red'
            }]
            }
        });
    }
}