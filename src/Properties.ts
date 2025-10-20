type PropertiesDescriptor = Record<string, any>;

type Props< K extends {new(...args: any[]): any},
            P extends PropertiesDescriptor> = Omit<K, "constructor">
        & {new(...args: ConstructorParameters<K>): InstanceType<K> & P};


export type PropertiesKlass<T extends PropertiesDescriptor>
                        = ReturnType<typeof buildPropertiesKlass<T>>;

export type Properties<T extends PropertiesDescriptor>
                        = InstanceType<PropertiesKlass<T>>;

type Target = {
    requestUpdate(): void
}

export function buildPropertiesKlass<T extends PropertiesDescriptor>(defaults: T) {

    class Properties {

        #target!: Target;

        // be careful:
        // https://github.com/microsoft/TypeScript/issues/62394
        constructor(target: Target) {
            this.#target = target;
        }

        readonly values: T = {...defaults};

        onValueChange() {
            this.#target.requestUpdate();
        }

        resetValue<K extends keyof T>(propname: K) {
            this.values[propname] = defaults[propname];
            this.onValueChange();
            return this;
        }

        setValues(vals: Partial<T>) {

            for(let propname in vals)
                this.values[propname] = vals[propname]!;
            
            this.onValueChange();

            return this;
        }

        setValue<K extends keyof T>(propname: K, propval: T[K]) {
            
            this.values[propname] = propval;
            
            this.onValueChange();

            return this;
        }

        getValue<K extends keyof T>(propname: K): T[K] {
            return this.values[propname];
        }
    }

    const props: PropertyDescriptorMap = {};

    for(let name in defaults)
        props[name] = {
            enumerable: true,
            set: function(this: Properties, v: T[typeof name]) {
                this.setValue(name, v)
            },
            get: function(this: Properties) {
                return this.getValue(name)
            },
        }

    Object.defineProperties(Properties.prototype, props);
    
    return Properties as Props<typeof Properties, T>;
}