import WithUpdate from "@misc/WithUpdate";

import type Component from "./components";
import { InternalComponent } from "./components";

import {Chart} from 'chart.js';

type Canvas = any;

export type InternalChart = {
    readonly _chart: Chart;
    readonly requestUpdate: () => void;
};

export class ChartJS extends WithUpdate(Object, {selfAsTarget: false}) {

    readonly canvas  : Canvas;
    protected _chart!: Chart;

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
                compo.onInsert(this as any);
                compo.insertIsPending = false;
            }
        }

        for(let i = 0; i < this.#components.length; ++i)
            this.#components[i].onUpdate(this as any);

        this._chart.update('none');
    }

    protected override onInit() {

        this._chart = new Chart(this.canvas, {
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

export default ChartJS;