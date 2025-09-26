import WithUpdate from "@misc/WithUpdate";

import { IS_INSERT_PENDING, type default as Component, type InternalComponent } from "./Component";

import {Chart} from 'chart.js';

type Canvas = any;

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
            if( compo[IS_INSERT_PENDING] === true ) {
                compo.setUpdaterCtler(this);
                compo.insert(this);
                compo[IS_INSERT_PENDING] = false;
            }
        }

        for(let i = 0; i < this.#components.length; ++i)
            this.#components[i].update(this);

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
        const compo     = component as InternalComponent;
        compo[IS_INSERT_PENDING] = true;
        this.#components.push(compo);
    }

    import<T extends Component>( component: T ): T {
        const clone = component.clone();
        this.append(clone);
        return clone;
    }
    //TODO: remove component.
}

export abstract class InternalChart extends ChartJS {
    abstract override readonly _chart: Chart;
};

export default ChartJS;