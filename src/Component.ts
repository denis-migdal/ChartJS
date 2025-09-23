import Chart from "./Chart";

// abstract class required as we have protected members.
export default abstract class Component {
    abstract clone(): this;

    protected abstract onInsert(chart: Chart): void;
    protected abstract onUpdate(chart: Chart): void;
    //TODO: onRemove
}

export const IS_INSERT_PENDING = Symbol("INSERT_PENDING");

export abstract class InternalComponent extends Component {

    abstract [IS_INSERT_PENDING]: boolean;
    abstract override onInsert(chart: Chart): void;
    abstract override onUpdate(chart: Chart): void;
}