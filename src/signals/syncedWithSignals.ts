import ChartJS, { InternalChart } from "../Chart";
import Component from "../Component";
import BaseComponent from "../components";
import { Signal } from "./TrivialSignal";

type GetSignalValue<T> = T extends Signal<infer U> ? U : never;
type GetSignalValues<T extends any[]> = {
    [key in keyof T]: GetSignalValue<T[key]>|null
}

type Callback<T extends BaseComponent,
              S extends Signal<any>[]> = (target: T, ...params: GetSignalValues<S>) => void;

class SyncedWithSignal<T extends BaseComponent, S extends Signal<any>[]> extends Component {

    readonly #target  : T;
    readonly #signals : S;
    readonly #values  : GetSignalValues<S>;
    readonly #callback: Callback<T,S>;

    constructor(target: T, signals: S, callback: Callback<T, S>) {
        super(); // useless
        this.#target = target;

        this.#callback = callback;
        this.#signals  = signals;
        this.#values   = new Array(this.#signals.length) as any;

        for(let i = 0; i < this.#signals.length; ++i)
            this.#signals[i].listen( () => {
                //TODO: requestUpdate...
                for(let i = 0; i < this.#signals.length; ++i)
                    this.#values[i] = this.#signals[i].value;
                this.#callback(target, ...this.#values);
            })
    }
    
    override clone(): this {
        // @ts-ignore
        return new SyncedWithSignal( this.#target.clone(),
                                     this.#signals,
                                     this.#callback );
    }

    protected override insert(chart: InternalChart) {
        // @ts-ignore
        return this.#target.insert(chart);
    }
    protected override update(): void {
        // @ts-ignore
        return this.#target.update();
    }
}

export default function syncedWithSignals<T extends BaseComponent,
                                          S extends Signal<any>[]>(
                                            model: T,
                                            ...args: [...S, Callback<T, S>]
                                        ) {
    const callback: Callback<T, S> = args[args.length-1] as any;
    const signals : S              = args.slice(0,-1)    as any;

    return new SyncedWithSignal(model.clone(), signals, callback);
}