import { Chart } from "chart.js";
import ChartJS, { InternalChart } from "../../Chart";
import Component, { ComponentParent } from "../../Component";
import ComponentInstance, { Updater } from "./ComponentInstance";

function getChart(chart: ChartJS) {
    return (chart as InternalChart)._chart;
}

// Need to be overridden in order to have correct constructor arguments.
export default class ComponentRef<
                                    P extends Record<string,any>,
                                    I extends {}
                                > extends Component {

    protected readonly target;
    readonly properties;
    chart : Chart| null = null; // internal use only
    
    constructor(target: ComponentInstance<P,I>) {
        super();
        this.target = target;
        target.addReference(this);

        this.properties = target.properties;
    }

    // public API
    get name(): string|null {
        return this.target.properties.name ?? null;
    }

    cloneRef(): this {
        return Reflect.construct(ComponentRef,
                                [this.target],
                                this.constructor );
    }
    override clone(): this {
        return Reflect.construct(ComponentRef,
                                [this.target.clone()],
                                this.constructor );
    }
    override remove(): this {
        if(this.parent === null)
            return this;
        this.parent.removeChild(this);
        return this;
    }

    // Redirect properties
    getProperty<T extends keyof P>(propname: T) {
        this.properties.getValue(propname);
    }
    setProperty<T extends keyof P>(propname: T,
                                   value: P[T]) {
        this.properties.setValue(propname, value);
    }
    setProperties<T extends Partial<P>>(properties: T) {
        this.properties.setValues(properties);
    }
    resetProperty<T extends keyof P>(propname: T) {
        this.properties.resetValue(propname);
    }

    addUpdater(updater: Updater<P>) {
        this.target.addUpdater(updater);
    }

    // parent might or might not be the chart.
    #parent: ComponentParent|null = null;
    get parent(): ComponentParent|null {
        return this.#parent;
    }
    protected set parent(parent: ComponentParent) {
        this.#parent = parent;
    }

    // internal methods
    protected override _insert(chart: ChartJS): void {
        this.chart = getChart(chart);
        this.target.onInsert( this.chart );
    }
    protected override _remove(chart: ChartJS): void {
        
        if( getChart(chart) !== this.chart)
            throw new Error("Unmatched charts");

        this.target.onRemove(this.chart);
        this.chart = null;
    }

    get updateRequested() {
        return this.target.updateRequested;
    }

    requestUpdate() {
        if(this.parent !== null)
            this.parent.requestUpdate();
    }

    protected override _update(chart: ChartJS): void {
        this.target.onUpdate();
    }
}