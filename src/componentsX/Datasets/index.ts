import { ChartDataset, ChartTypeRegistry } from "chart.js";
import Component, { buildArgsParser, WithExtraProps } from "..";
import Chart from "../../Chart";
import { InternalChart } from "../../Chart";


export const datasetArgsParser = buildArgsParser( (opts: Record<string,any>,
                                                   data?: unknown,
                                                   ..._) => {
    opts.data = data;
});


// https://github.com/microsoft/TypeScript/issues/62395
export default class Dataset extends WithExtraProps(Component, {
            color: "black",
            data : [] as [number, number][],
            type : "scatter",
            x    : "x",
            y    : "y"
        }) {

    protected static createDataset<T extends keyof ChartTypeRegistry>(type: T = "scatter" as T): ChartDataset<T> {
        return {
            type,
            data: [],
        } as unknown as ChartDataset<T>;
    }

    readonly #dataset: ChartDataset = (this.constructor as typeof Dataset)
                                                            .createDataset();

    get dataset() {
        return this.#dataset;
    }

    // TODO: cache...
    protected getParsedData( data: [number, number][] = this.properties.getValue("data") ) {
        let parsedData = new Array(data.length);
        for(let i = 0; i < parsedData.length; ++i) {
            parsedData[i] = {x: data[i][0], y: data[i][1]};
        }
        return parsedData;
    }

    protected override onInsert(chart: Chart) {
        super.onInsert(chart);
        (chart as InternalChart)._chart.data.datasets.push(this.dataset);
    }

    protected override onRemove(chart: Chart) {
        super.onRemove(chart);
        const datasets = (chart as InternalChart)._chart.data.datasets;
        const idx = datasets.indexOf(this.dataset as any);
        if( idx === -1)
            throw new Error("Child not found");
        datasets.splice(idx, 1);
    }

    protected override onUpdate(chart: Chart) {
        //TODO: check if pending...
        super.onUpdate(chart);

        // @ts-ignore
        this.dataset.xAxisID = this.properties.getValue("x");
        // @ts-ignore
        this.dataset.yAxisID = this.properties.getValue("y");

        this.dataset.data = this.getParsedData();
        this.dataset.borderColor = this.dataset.backgroundColor = this.properties.getValue("color");
    }
}

// ======== PLUGIN ===========

import {Cstr} from "@misc/types/Cstr";

type Add<T extends string> = `add${T}`;
type Create<T extends string> = `create${T}`;
type Filter<T> = (T extends Add<infer U> ? U : never) & (T extends Create<infer U> ? U : never);

type ComponentNames = Filter<keyof Chart>;

type ComponentName<T extends Cstr> = Exclude<keyof {
    [K in ComponentNames as ReturnType<Chart[`create${K}`]> extends InstanceType<T> ? K : never]: true
}, symbol|number>;

export type WithDataset<T extends Cstr<Component>, N extends string> = Record<`create${N}`, (...args: ConstructorParameters<T>) => InstanceType<T>> & Record<`add${N}`, (...args: ConstructorParameters<T>) => Chart>;

// @todo : verif add/create parameters with Cstr parameters (?).
export function registerDatasetType<T extends Cstr<Component>>(Klass: T, name: ComponentName<T>) {

    const    addMeth =    `add${name}` as const;
    const createMeth = `create${name}` as const;

    // @ts-ignore
    Chart.prototype[createMeth] = function(...args: any[]) {
        const dataset = new Klass(...args);
        this.append(dataset);
        return dataset;
    }

    // @ts-ignore
    Chart.prototype[addMeth] = function(...args: any[]) {
        // @ts-ignore
        this[createMeth](...args);
        return this;
    }
}