import {Chart} from 'chart.js';
import ComponentRef from "./ComponentRef";

type G = Chart;

type ComponentTypeCallback<I extends unknown>
        = (this: void, chart: G, internals: I) => void;
export type ComponentTypeUpdateCallback<D extends Record<string, any>,
                                 I extends {}>
        = (this: void, data: Readonly<D>, internals: I, references: ComponentRef<D,I>[]) => void;

export type ComponentTypeBehaviors<D extends Record<string, any>,
                                    I extends {}> = {
    onInsert: ComponentTypeCallback<I>,
    onRemove: ComponentTypeCallback<I>,
    onUpdate: ComponentTypeUpdateCallback<D,I>,
}

export type ComponentTypeDescriptor<N extends string,
                                    D extends Record<string, any>,
                                    I extends {},
                                    C extends any[] = [],
                                    > = {
    name               : N,
    properties         : D,
    cstrArgsParser    ?: (opts: Partial<NoInfer<D>>, ...args: C) => void,
    createInternalData?: (this: void) => I,
} & ComponentTypeBehaviors<NoInfer<D>,NoInfer<I>>;