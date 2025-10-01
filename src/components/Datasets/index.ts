import { ChartDataset, ChartTypeRegistry } from "chart.js";
import Component, { buildArgsParser, WithExtraProps } from "..";
import type Chart from "../../Chart";
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
            type : "scatter"
        }) {

    protected static createDataset<T extends keyof ChartTypeRegistry>(): ChartDataset<T> {
        return {
            type: "scatter",
            data: []
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
        this.dataset.data = this.getParsedData();
        this.dataset.borderColor = this.properties.getValue("color");
    }
}