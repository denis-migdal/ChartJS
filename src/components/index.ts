import { buildProperties, Properties } from "../Properties";
import type { InternalChart } from "../Chart";
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

    readonly defaults!: {}; // for typing purposes.
    readonly properties = new (this.constructor as typeof Component).Properties(this) as Properties<this["defaults"]>;

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

// As always TS is stupid...
// We need 2 steps :
// - One to properly set defaults.
// - One to properly set constructor.

type MergeProps<BP extends Record<string, any>,
                P  extends Record<string, any>
            > = {
    [K in keyof BP | keyof P]: K extends keyof P ? P[K]
                                                 : K extends keyof BP ? BP[K]
                                                                      : never;
}

// for type purpose
function ExtendsMixins<
                    B  extends Cstr<any>,
                    BP extends Record<string, any>,
                    P  extends Record<string, any>
                >(Base: B, extra: P) {

    //const Defaults = {...Base.Defaults, ...extra};

    return class extends Base {

        static Defaults            = null as any as MergeProps<BP, P>;
        static readonly Properties = null as any as ReturnType<typeof buildProperties<MergeProps<BP, P>>>;

        // for type purposes
        defaults!: MergeProps<BP, P>;
    }
}

type MixP<B extends Cstr<any> & {Defaults: Record<string,any>},
          P extends Record<string, any>
        > = ReturnType<typeof ExtendsMixins<Omit<B, "Defaults"> & {new(): InstanceType<B>}, B["Defaults"], P>>

// for now, works
// Can't Omit<InstanceType<B>> without removing protected members...
export function WithExtraProps<
                        B extends Cstr<any> & {Defaults: Record<string,any>},
                        P extends Record<string, any>
                    >(Base: B, extra: P)
                : Omit<MixP<B,P>, "prototype">
                & {new(args?: Partial<MergeProps<B, P>>): InstanceType<MixP<B,P>>} {

    const Defaults = {...Base.Defaults, ...extra};

    return class extends Base {
        static override Defaults  = Defaults;
        static Properties = buildProperties(Defaults);
    };
}