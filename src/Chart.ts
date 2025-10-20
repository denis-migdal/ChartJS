import WithUpdate from "@misc/WithUpdate";

import { type ComponentParent, IS_INSERT_PENDING, type default as Component, type InternalComponent } from "./Component";

import {Chart} from 'chart.js';

type Canvas = any;

export class ChartJS extends WithUpdate(Object, {selfAsTarget: false})
                     implements ComponentParent {

    readonly canvas  : Canvas;
    protected _chart!: Chart;

    constructor(canvas: Canvas|null = null) {
        super();

        if( canvas === null)
            canvas = document.createElement('canvas')

        this.canvas = canvas;
        this.setVisibilityTarget(canvas);

        this.requestUpdate();
    }

    protected override onUpdate() {
        for(let i = 0; i < this.#components.length; ++i) {
            const compo = this.#components[i];
            if( compo[IS_INSERT_PENDING] === true ) {
                compo._insert(this);
                compo[IS_INSERT_PENDING] = false;
            }
        }

        for(let i = 0; i < this.#components.length; ++i) {
            if( this.#components[i].updateRequested )
                this.#components[i]._update(this);
        }

        this._chart.update('none');
    }

    protected override onInit() {

        this._chart = new Chart(this.canvas, {
            options: {
				locale: 'en-IN',
				animation: false,
				responsive: true,
				maintainAspectRatio: false,
                plugins: {}
            },
            data: {
                datasets: []
            }
        });
    }

    #components = new Array<InternalComponent>();
    append(component: Component) {
        const compo     = component as InternalComponent;
        if( compo.parent !== null)
            compo.parent.removeChild(compo);

        compo[IS_INSERT_PENDING] = true;
        compo.parent = this;

        this.#components.push(compo);
    }

    import<T extends Component>( component: T ): T {
        const clone = component.cloneRef();
        this.append(clone);
        return clone;
    }

    removeChild<T extends Component>(child: T): T {

        const compo = child as any as InternalComponent;
        if( compo[IS_INSERT_PENDING] !== true )
            compo._remove(this);

        compo.parent = null;

        this.requestUpdate();

        return child;
    }

    getComponentNames() {
        const names = new Array<string>(this.#components.length);
        let offset = 0;
        for(let i = 0; i < this.#components.length; ++i)
            if( this.#components[i].name !== null)
                names[offset++] = this.#components[i].name!;

        names.length = offset;

        return names;
    }

    getComponent<T extends Component>(name: string): T|null {
        for(let i = 0; i < this.#components.length; ++i)
            if( this.#components[i].name === name)
                return this.#components[i] as any;

        return null;
    }
}

export abstract class InternalChart extends ChartJS {
    abstract override readonly _chart: Chart;
};

export default ChartJS;