import { ChartDataset } from "chart.js";
import { ComponentArgs, WithExtraProps } from "..";
import Dataset, { datasetArgsParser, registerDatasetType, WithDataset } from ".";

import ChartJS from "../../Chart";

import {Chart, ScatterController, LineElement, PointElement} from 'chart.js';
// Can't register plugins after graph creation...
Chart.register(ScatterController, LineElement, PointElement);

type ArgsData = [number, number][];

// https://github.com/microsoft/TypeScript/issues/62395
export default class Line extends WithExtraProps(Dataset, {
            data      : [] as ArgsData, // vs RawData...
            type      : "scatter" as const,
            showPoints: false,
        }) {

    constructor(...args: ComponentArgs<Line, [ArgsData]>) {
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


declare module "../../Chart" {
    interface ChartJS extends WithDataset<typeof Line, "Line"> {}
}

registerDatasetType(Line, "Line");