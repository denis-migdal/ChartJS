import { InternalChart } from "../Chart";
import Component, { UpdateController } from "../Component";
import BaseComponent from "../components";
import { Signal } from "./TrivialSignal";

type GetSignalValue<T> = T extends Signal<infer U> ? U : never;
type GetSignalValues<T extends any[]> = {
    [key in keyof T]: GetSignalValue<T[key]>|null
}

type Callback<T extends BaseComponent,
              S extends Signal<any>[]> = (target: T, ...params: GetSignalValues<S>) => void;

class SyncedWithSignalRef<T extends BaseComponent, S extends Signal<any>[]> {

    readonly #target  : T;
    readonly #signals : S;
    readonly #values  : GetSignalValues<S>;
    readonly #callback: Callback<T,S>;

    #dirty: boolean = true;

    readonly #hosts: SyncedWithSignalHost<T,S>[] = [];

    constructor(target: T, signals: S, callback: Callback<T, S>) {

        this.#target = target;
        // (target as any as InternalComponent).setUpdaterCtler(this);
        // no needs -> is RO...

        this.#callback = callback;
        this.#signals  = signals;
        this.#values   = new Array(this.#signals.length) as any;

        for(let i = 0; i < this.#signals.length; ++i)
            this.#signals[i].listen( this.callback );
    }

    readonly callback = () => {
        this.requestUpdate();
    }

    addHost(host: SyncedWithSignalHost<T,S>) {
        this.#hosts.push(host);
    }

    requestUpdate() {
        this.#dirty = true;
        for(let i = 0; i < this.#hosts.length; ++i)
            this.#hosts[i].requestUpdate();
    }

    insert(chart: InternalChart) {
        // @ts-ignore
        return this.#target.insert(chart);
    }
    update(chart: InternalChart): void {

        if( this.#dirty ) {
            for(let i = 0; i < this.#signals.length; ++i)
                    this.#values[i] = this.#signals[i].value;
            this.#dirty = false;
        }

        this.#callback(this.#target, ...this.#values);
        // @ts-ignore
        return this.#target.update(chart);
    }
}

class SyncedWithSignalHost<T extends BaseComponent, S extends Signal<any>[]> extends Component {

    #ref: SyncedWithSignalRef<T,S>;

    constructor(ref: SyncedWithSignalRef<T,S>) {
        super();

        this.#ref = ref;
        ref.addHost(this);
    }
    
    override clone(): this {
        // @ts-ignore
        return new SyncedWithSignalHost(this.#ref);
    }

    #updateControler: UpdateController|null = null;
    protected override setUpdaterCtler(updateCtler: UpdateController): void {
        this.#updateControler = updateCtler;
    }
    requestUpdate() {
        if( this.#updateControler !== null)
            this.#updateControler.requestUpdate();
    }

    protected override insert(chart: InternalChart) {
        // @ts-ignore
        return this.#ref.insert(chart);
    }
    protected override update(chart: InternalChart): void {
        // @ts-ignore
        return this.#ref.update(chart);
    }
}

export default function syncedWithSignals<T extends BaseComponent,
                                          S extends Signal<any>[]>(
                                            model: T,
                                            ...args: [...S, Callback<T, S>]
                                        ) {
    const callback: Callback<T, S> = args[args.length-1] as any;
    const signals : S              = args.slice(0,-1)    as any;

    const ref = new SyncedWithSignalRef(model.clone(), signals, callback)
    return new SyncedWithSignalHost(ref);
}