import Chart from "./Chart";

export type ComponentParent = {
    /*
        compo.remove() => parent.removeChild(compo) => compo._remove(...)
        we need this indirection as a component can be registered into several graphs.
    */
    removeChild<T extends Component>(child: T): T;
    requestUpdate(): void;
};

// abstract class required as we have protected members.
export default abstract class Component {
    abstract clone(): this;
    abstract remove(): void;
    readonly abstract parent: ComponentParent|null;

    protected abstract _insert(chart: Chart): void;
    protected abstract _remove(chart: Chart): void;
    protected abstract _update(chart: Chart): void;
}

export const IS_INSERT_PENDING = Symbol("INSERT_PENDING");

export abstract class InternalComponent extends Component {

    abstract [IS_INSERT_PENDING]: boolean;

    abstract override parent: ComponentParent|null;

    abstract override _insert(chart: Chart): void;
    abstract override _remove(chart: Chart): void;
    abstract override _update(chart: Chart): void;
}