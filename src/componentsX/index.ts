import { buildPropertiesKlass, Properties } from "../Properties";
import type Chart from "../Chart";
import { Cstr } from "@misc/types/Cstr";
import Component, { ComponentParent } from "../Component";

export type ComponentArgs<T extends {defaults: Record<string, any>},
                          Prefix extends any[] = []> = 
    | [string, ...Prefix, Partial<T["defaults"]>]
    | [string, ...Prefix]
    | [string, Partial<T["defaults"]>]
    | [string]
    | [...Prefix, Partial<T["defaults"]>]
    | [Partial<T["defaults"]>]
    | [...Prefix]
    | [];

type ArgsPrefix<T> = T extends ComponentArgs<infer U, infer V> ? V : never;
type ArgsOpts<T>   = T extends ComponentArgs<infer U, infer V> ? Partial<U> : never;

export function buildArgsParser<T extends ComponentArgs<any,any>>(
                            parsePrefix: ((   opts: ArgsOpts<T>,
                                           ...args: ArgsPrefix<T>) => void)
                                        | null = null ) {

    return (...args: T) => {
        let opts: Record<string, any> = {};
        let start = 0;
        let end = args.length;

        const last = args[args.length-1]; // out of index gives undefined
        if( typeof last === "object" && ! Array.isArray(last) ) {
            opts = last;
            --end;
        }

        if( typeof args[0] === "string") {
            // @ts-ignore
            opts.name = args[0];
            ++start;
        }

        if( start !== end && parsePrefix !== null)
            parsePrefix( opts as any, ...args.slice(start, end) as any );

        return opts;
    }
}

// extends required as we have protected members.
export default class BaseComponent extends Component {

    static Defaults = {
        name: null as string|null
    };
    static readonly Properties = buildPropertiesKlass(BaseComponent.Defaults);

    readonly defaults!: typeof BaseComponent.Defaults; // for typing purposes.
    readonly properties = new (this.constructor as typeof BaseComponent).Properties(this) as Properties<this["defaults"]>;

    getProperty<T extends keyof this["defaults"]>(propname: T) {
        this.properties.getValue(propname);
    }
    setProperty<T extends keyof this["defaults"]>(propname: T,
                                                  value: this["defaults"][T]) {
        this.properties.setValue(propname, value);
    }
    setProperties<T extends Partial<this["defaults"]>>(properties: T) {
        this.properties.setValues(properties);
    }
    resetProperty<T extends keyof this["defaults"]>(propname: T) {
        this.properties.resetValue(propname);
    }

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

    cloneRef() {
        return this.clone();
    }

    get name() {
        return this.properties.name;
    }

    #parent: ComponentParent|null = null;
    get parent(): ComponentParent|null {
        return this.#parent;
    }
    protected set parent(parent: ComponentParent) {
        this.#parent = parent;
    }

    #updateRequested = true;
    get updateRequested() {
        return this.#updateRequested;
    }

    requestUpdate() {
        //if( this.#updateRequested === true )
        //    return;
        this.#updateRequested = true;

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
        this.#updateRequested = false;
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
        static readonly Properties = {} as ReturnType<typeof buildPropertiesKlass<MergeProps<BP, P>>>;

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
        static Properties = buildPropertiesKlass(Defaults);
    };
}