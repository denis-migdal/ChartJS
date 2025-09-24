import Chart from "./Chart";

// abstract class required as we have protected members.
export default abstract class Component {
    abstract clone(): this;

    protected abstract insert(chart: Chart): void;
    protected abstract update(): void;
    //TODO: onRemove
}

export const IS_INSERT_PENDING = Symbol("INSERT_PENDING");

export abstract class InternalComponent extends Component {

    abstract [IS_INSERT_PENDING]: boolean;
    abstract override insert(chart: Chart): void;
    abstract override update(): void;
}