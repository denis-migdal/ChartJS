import { buildProperties } from "../Properties";
import type { InternalChart } from "../Chart";
import Chart from "../Chart";
import { Cstr } from "../../libs/misc/src/types/Cstr";

export type InternalComponent = {
    insertIsPending: boolean;
    onInsert: () => void;
    onUpdate: () => void;
    //TODO: onRemove
}

export default class Component {

    static Defaults = {};

    static readonly Properties = buildProperties(Component.Defaults);

    readonly properties = new (this.constructor as typeof Component).Properties(this);

    constructor(opts: Record<string, any> = {}) {
        for(let k in opts) {
            const key = k as keyof typeof Component.Defaults;
            // @ts-ignore
            this.properties[key] = opts[key];
        }
    }

    #chart: InternalChart|null = null;
    requestUpdate() {
        if( this.#chart !== null)
            this.#chart.requestUpdate();
    }

    private insertIsPending: boolean = false;
    protected onInsert(chart: InternalChart) {
        this.#chart = chart;
    }

    //TODO: check if pending...
    protected onUpdate() {}
}

type Merge<B extends Cstr<any>, P extends Record<string, any>>
    = InstanceType<B> & {properties: InstanceType<ReturnType<typeof buildProperties<P>>>};

// for now, works
// As always TS is stupid...
// Can't Omit<InstanceType<B>> without removing protected members...
export function WithExtraProps<
                        B extends Cstr<any> & {Defaults: Record<string,any>},
                        P extends Record<string, any>
                    >(Base: B, extra: P)
                : Omit<B, "new" | "prototype">
                & {Defaults: P}
                & {new(opts ?: Partial<P & B["Defaults"]>)
                    : Merge<B, P>} {

    const Defaults = {...Base.Defaults, ...extra};

    // @ts-ignore : TS bug...
    return class extends Base {
        static override Defaults = Defaults;
        private static Properties = buildProperties(Defaults);
    };
}