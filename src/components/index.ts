import { buildProperties, Properties } from "../Properties";
import type Chart from "../Chart";
import { Cstr } from "@misc/types/Cstr";
import Component, { ComponentParent } from "../Component";

let id = 0;

// extends required as we have protected members.
export default class BaseComponent extends Component {

    id = ++id;

    static Defaults = {};
    static readonly Properties = buildProperties(BaseComponent.Defaults);

    readonly defaults!: {}; // for typing purposes.
    readonly properties = new (this.constructor as typeof BaseComponent).Properties(this) as Properties<this["defaults"]>;

    constructor(opts: Record<string, any> = {}) {
        super(); // useless
        for(let k in opts) {
            const key = k as keyof typeof BaseComponent.Defaults;
            // @ts-ignore
            this.properties[key] = opts[key];
        }
    }

    clone(): this {
        // @ts-ignore
        return new this.constructor(this.properties);
    }

    #parent: ComponentParent|null = null;
    get parent(): ComponentParent|null {
        return this.#parent;
    }
    protected set parent(parent: ComponentParent) {
        this.#parent = parent;
    }

    requestUpdate() {
        if( this.#parent !== null)
            this.#parent.requestUpdate();
    }

    protected _insert(chart: Chart) {
        this.onInsert(chart);
    }
    protected onInsert(chart: Chart) {}

    remove() {
        if( this.#parent !== null) {
            this.#parent.removeChild(this);
            this.#parent = null;
        }
    }

    protected _remove(chart: Chart) {
        this.onRemove(chart);
    }
    protected onRemove(chart: Chart) {}

    //TODO: check if pending...
    protected _update(chart: Chart) {
        this.onUpdate(chart!);
    }
    protected onUpdate(chart: Chart) {}
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
                    B  extends Cstr,
                    BP extends Record<string, any>,
                    P  extends Record<string, any>
                >(Base: B, extra: P) {

    //const Defaults = {...Base.Defaults, ...extra};

    return class extends Base {

        static Defaults            = {} as MergeProps<BP, P>;
        static readonly Properties = {} as ReturnType<typeof buildProperties<MergeProps<BP, P>>>;

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