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

export default class Chart {

    readonly canvas : Canvas;
    readonly #_chart: CJ.Chart;

    constructor(canvas: Canvas = document.createElement('canvas') ) {
        
        this.canvas = canvas;
        this.#_chart = new CJ.Chart(canvas, {
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

    //TODO: lazy chartJS creation (onInit)
    // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
    //TODO: GUI plugins...
    requestUpdate() {
        // TODO: animationFrameRequest if exists.
    }

    async draw() {
        // TODO: animationFrameRequest if exists.
        // TODO: visibility changed...
        this.update();
    }
    update() {
        this.#_chart.update('none');
    }
}