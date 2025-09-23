import { InternalChart } from "../Chart";
import Component from "../components";

class SyncedWithSignal<T extends Component> extends Component {

    #target: T;
    constructor(target: T) {
        super(); // useless
        this.#target = target;

        this.defaults   = this.#target.defaults;
        this.properties = this.#target.properties;
    }
    
    override readonly defaults   : T["defaults"];
    override readonly properties : T["properties"];
    override clone(): this {
        // @ts-ignore
        return new SyncedWithSignal( this.#target.clone() );
    }
    override requestUpdate() { return this.#target.requestUpdate() }
    protected override onInsert(chart: InternalChart) {
        // @ts-ignore
        return this.#target.onInsert(chart);
    }
    protected override onUpdate(chart: InternalChart): void {
        // @ts-ignore
        return this.#target.onUpdate(chart);
    }
}

export default function syncedWithSignals<T extends Component>(model: T) {
    return new SyncedWithSignal(model.clone());
}