import { ChartDataset } from "chart.js";
import { ComponentArgs, WithExtraProps } from "..";
import Dataset, { datasetArgsParser, registerDatasetType } from ".";

import {Chart, ScatterController, LineElement, PointElement} from 'chart.js';
// Can't register plugins after graph creation...
Chart.register(ScatterController, LineElement, PointElement);


type ArgsData = [number, number][];
type Args     = ComponentArgs<Line, [ArgsData]>;

// https://github.com/microsoft/TypeScript/issues/62395
export default class Line extends WithExtraProps(Dataset, {
            data      : [] as ArgsData, // vs RawData...
            type      : "scatter" as const,
            showPoints: false,
        }) {

    // one line due to ConstructorParem use...
    constructor(...args: Args) {
        super( datasetArgsParser(...args) );
    }

    static createDataset() {
        const dataset = Dataset.createDataset<"scatter">();

        dataset.showLine    = true;
        dataset.borderWidth = 2;
        dataset.parsing     = false;
        dataset.normalized  = true;

        return dataset;
    }

    override get dataset(): ChartDataset<"scatter"> {
        return super.dataset as any;
    }

    override onUpdate(chart: ChartJS) {
        super.onUpdate(chart);

        if( ! this.properties.getValue("showPoints") )
			this.dataset.pointRadius = 0;
    }
}

// =================== PLUGIN =========================

import ChartJS from "../../Chart";

declare module "../../Chart" {
    interface ChartJS {
        addLine   (...args: Args): ChartJS;
        createLine(...args: Args): Line;
    }
}

registerDatasetType(Line, "Line");