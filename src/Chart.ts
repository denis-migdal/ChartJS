import WithUpdate from "../libs/misc/src/WithUpdate";

import * as CJ from 'chart.js';

// Can't register plugins after graph creation...
CJ.Chart.register([
  CJ.CategoryScale,
  CJ.LineController,
  CJ.LineElement,
  CJ.LinearScale,
  CJ.PointElement
]);

type Canvas = any;

export default class Chart extends WithUpdate(Object, {selfAsTarget: false}) {

    readonly canvas  : Canvas;
             #_chart!: CJ.Chart;

    constructor(canvas: Canvas = document.createElement('canvas')) {
        super();

        this.canvas = canvas;
        this.setVisibilityTarget(canvas);

        this.requestUpdate();
    }

    protected override onUpdate() {

        // TODO : properties updates + components updates.

        this.#_chart.update('none');
    }

    protected override onInit() {

        this.#_chart = new CJ.Chart(this.canvas, {
            options: {
				locale: 'en-IN',
				animation: false,
				responsive: true,
				maintainAspectRatio: false,
            },
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    type: "line",
                    label: '# of Votes',
                    data: [[0,0], [1,1]],
                    borderColor: 'red'
                }]
            }
        });
    }
}