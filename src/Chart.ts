import WithUpdate from "../libs/misc/src/WithUpdate";

import * as CJ from 'chart.js';
import type Component from "./components";
import { InternalComponent } from "./components";

// Can't register plugins after graph creation...
CJ.Chart.register([
  CJ.ScatterController,
  CJ.CategoryScale,
  CJ.LineController,
  CJ.LineElement,
  CJ.LinearScale,
  CJ.PointElement
]);

type Canvas = any;

export type InternalChart = {
    readonly _chart: CJ.Chart;
    readonly requestUpdate: () => void;
};

export default class Chart extends WithUpdate(Object, {selfAsTarget: false}) {

    readonly canvas  : Canvas;
    protected _chart!: CJ.Chart;

    constructor(canvas: Canvas = document.createElement('canvas')) {
        super();

        this.canvas = canvas;
        this.setVisibilityTarget(canvas);

        this.requestUpdate();
    }

    protected override onUpdate() {

        for(let i = 0; i < this.#components.length; ++i) {
            const compo = this.#components[i];
            if( compo.insertIsPending ) {
                // @ts-ignore
                compo.onInsert(this);
                compo.insertIsPending = false;
            }
        }

        for(let i = 0; i < this.#components.length; ++i)
            this.#components[i].onUpdate();

        this._chart.update('none');
    }

    protected override onInit() {

        this._chart = new CJ.Chart(this.canvas, {
            options: {
				locale: 'en-IN',
				animation: false,
				responsive: true,
				maintainAspectRatio: false,
            },
            data: {
                datasets: []
            }
        });
    }

    #components = new Array<InternalComponent>();
    append(component: Component) {
        const compo     = component as unknown as InternalComponent;
        compo.insertIsPending = true;
        this.#components.push(compo);
    }
    //TODO: remove component.
    //TODO: addX()
}