import type Component from "./components";

type PropertiesDescriptor = Record<string, any>;

type Props< K extends {new(...args: any[]): any},
            P extends PropertiesDescriptor> = Omit<K, "constructor">
        & {new(...args: ConstructorParameters<K>): InstanceType<K> & P};

export type Properties<T extends PropertiesDescriptor> = InstanceType<ReturnType<typeof buildProperties<T>>>;

export function buildProperties<T extends PropertiesDescriptor>(defaults: T) {

    class Properties {

        #parent!: Component;

        // be careful:
        // https://github.com/microsoft/TypeScript/issues/62394
        constructor(parent: Component) {
            this.#parent = parent;
        }

        #values: Partial<T> = {};

        setValue<K extends keyof T>(propname: K, propval: T[K]) {
            //TODO: check val...
            this.#values[propname] = propval;
            this.#parent.requestUpdate();

            return this;
        }

        getValue<K extends keyof T>(propname: K): T[K] {
            return this.#values[propname] ?? defaults[propname];
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