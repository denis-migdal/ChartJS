import { Chart } from "chart.js";
import { Properties, PropertiesKlass } from "../../Properties";
import { ComponentTypeBehaviors } from "./ComponentTypeDescriptor";
import ComponentRef from "./ComponentRef";

export type Updater<P extends Record<string, any>> = (p: Properties<P>) => void;

export default class ComponentInstance<
                                        P extends Record<string,any>,
                                        I extends {}
                                    > {

    readonly properties;
    readonly internals;
    readonly behaviors;

    constructor(Properties   : PropertiesKlass<P>,
                initialValues: Partial<P>,
                internals    : I,
                behaviors    : ComponentTypeBehaviors<P, I>) {

        this.behaviors  = behaviors;
        this.internals  = internals;

        this.properties = new Properties(this);
        this.properties.setValues(initialValues);
    }

    clone() {
        return new ComponentInstance(
                            this.properties.constructor as PropertiesKlass<P>,
                            this.properties,
                            this.internals,
                            this.behaviors);
    }

    onInsert(chart: Chart) {
        this.behaviors.onInsert(chart, this.internals);
    }
    onRemove(chart: Chart) {
        this.behaviors.onRemove(chart, this.internals);
    }
    onUpdate() {

        // component has already been updated.
        if( this.updateRequested === false)
            return;

        for(let i = 0; i < this.#updaters.length; ++i)
            this.#updaters[i](this.properties);

        // placing it here prevents updators to cause unnecessary updates. 
        this.updateRequested = false;

        this.behaviors.onUpdate(this.properties.values,
                                this.internals,
                                this.references);
    }

    updateRequested: boolean = false;
    requestUpdate() {
        // component has changed and onUpdate hasn't been called yet.
        if( this.updateRequested === true) return;
        this.updateRequested = true;

        // we will wait for a graph update to update the component.
        for(let i = 0; i < this.references.length; ++i)
            this.references[i].requestUpdate();
    }

    #updaters = new Array<Updater<P>>();
    addUpdater(updater: Updater<P>) {
        this.#updaters.push(updater);
    }

    //TODO: WeakRef array...
    protected readonly references = new Array<ComponentRef<P,I>>();
    addReference(ref: ComponentRef<P,I>) {
        this.references.push(ref);
    }
}