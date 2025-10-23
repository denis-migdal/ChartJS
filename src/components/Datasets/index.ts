import { ChartDataset } from "chart.js";
import createComponentClass from "../impl/createComponentClass";
import { TooltipLabel } from "../Tooltips/DefaultTooltipSystem";
import { Datalabel    } from "../Datalabels/DefaultDatalabelSystem";

type DatasetExtra = {
    tooltip  ?: TooltipLabel,
    datalabel?: Datalabel
}

export type ParsedDataset = {x: number, y: number}[];
export type RawDataset    = [number, number][]|ParsedDataset;

const Dataset = createComponentClass({
    name          : "Dataset",
    properties: {
        name   : null as string|null,
        type   : "scatter",
        color  : "black",
        data   : [] as RawDataset,
        x      : "x",
        y      : "y",
        tooltip  : null as TooltipLabel,
        datalabel: null as Datalabel
    },
    cstrArgsParser: (opts, data: RawDataset) => {
        opts.data = data;
    },
    createInternalData() {
        return {
            prevData: null as any,
            dataset : {} as ChartDataset<any> & DatasetExtra,
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
    color    : string,
    x        : string,
    y        : string,
    data     : D,
    tooltip  : TooltipLabel,
    datalabel: Datalabel
}

type Internal<D extends any> = {
    dataset : ChartDataset<any> & DatasetExtra,
    prevData: D
}

type DataParser<D extends any> = (raw: D, target: ParsedDataset) => ParsedDataset;

function isParsed(data: RawDataset): data is ParsedDataset {
    return data.length === 0 || ! Array.isArray(data[0]);
}

export function rawParser(data  : RawDataset,
                          prev  : ParsedDataset) {
    
    if( isParsed(data) )
        return data;

    // reuse previous data.
    const target = prev;

    if( data.length < target.length)
        target.length = data.length;

    let i;
    for(i = 0; i < target.length; ++i) {
        target[i].x = data[i][0]
        target[i].y = data[i][1]
    }

    if( target.length === data.length )
        return target;
    
    target.length = data.length;
    for(i = 0; i < target.length; ++i)
        target[i] = {x: data[i][0], y: data[i][1]}

    return target;
}

export function updateDataset<D extends any>(data      : Data<D>,
                                             internals : Internal<D>,
                                             dataParser: DataParser<D>) {

    const dataset = internals.dataset;
    dataset.xAxisID = data.x;
    dataset.yAxisID = data.y;

    dataset.borderColor = dataset.backgroundColor = data.color;

    internals.dataset.tooltip   = data.tooltip;
    internals.dataset.datalabel = data.datalabel;

    // recomputing data might be costly...
    if( internals.prevData !== data.data) {
        internals.prevData = data.data;
        dataset.data = dataParser(data.data, dataset.data);
    }
}

export default Dataset;