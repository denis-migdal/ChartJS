import { ChartDataset } from "chart.js";
import createComponentClass from "../impl/createComponentClass";

const Dataset = createComponentClass({
    name          : "Dataset",
    properties: {
        name : null as string|null,
        type : "scatter",
        color: "black",
        data : [] as [number, number][],
        x    : "x",
        y    : "y"
    },
    cstrArgsParser: (opts, data: [number, number][]) => {
        opts.data = data;
    },
    createInternalData() {
        return {
            prevData: null as any,
            dataset : {} as ChartDataset<any>,
        }
    },
    onInsert(chart, internals) {
        chart.data.datasets.push(internals.dataset);
    },
    onRemove(chart, internals) {
        const datasets = chart.data.datasets;
        const idx = datasets.indexOf(internals.dataset);
        if( idx === -1)
            throw new Error("Dataset not found");
        datasets.splice(idx, 1);
    },
    onUpdate(data, internals) {
        internals.dataset.type = data.type;
        updateDataset(data, internals, rawParser);
    },
});

type Data<D extends any> = {
    color: string,
    x    : string,
    y    : string,
    data : D
}

type Internal<D extends any> = {
    dataset : ChartDataset<any>,
    prevData: D
}

type DataParser<D extends any> = (raw: D) => {x: number, y: number}[];

export function rawParser(data: ReadonlyArray<readonly [number,number]>) {
    let parsedData = new Array(data.length);
    for(let i = 0; i < data.length; ++i)
        parsedData[i] = {x: data[i][0], y: data[i][1]};

    return parsedData;
}

export function updateDataset<D extends any>(data      : Data<D>,
                                             internals : Internal<D>,
                                             dataParser: DataParser<D>) {

    const dataset = internals.dataset;
    dataset.xAxisID = data.x;
    dataset.yAxisID = data.y;

    dataset.borderColor = dataset.backgroundColor = data.color;

    // recomputing data might be costly...
    if( internals.prevData !== data.data) {
        internals.prevData = data.data;
        dataset.data = dataParser(data.data);
    }
}

export default Dataset;