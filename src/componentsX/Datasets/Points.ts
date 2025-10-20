import { ChartDataset } from "chart.js";
import { ComponentArgs, WithExtraProps } from "..";
import Dataset, { datasetArgsParser, registerDatasetType, WithDataset } from ".";

import {Chart, ScatterController, PointElement} from 'chart.js';
// Can't register plugins after graph creation...
Chart.register(ScatterController, PointElement);


type ArgsData = [number, number][];

// https://github.com/microsoft/TypeScript/issues/62395
export default class Points extends WithExtraProps(Dataset, {
            data      : [] as ArgsData, // vs RawData...
            type      : "scatter" as const,
        }) {

    constructor(...args: ComponentArgs<Points, [ArgsData]>) {
        super( datasetArgsParser(...args) );
    }

    static createDataset() {
        const dataset = Dataset.createDataset<"scatter">();

        dataset.borderWidth = 2;
        dataset.parsing = false;
        dataset.showLine = false;

        return dataset;
    }

    override get dataset(): ChartDataset<"scatter"> {
        return super.dataset as any;
    }
}

// =================== PLUGIN =========================

declare module "../../Chart" {
    interface ChartJS extends WithDataset<typeof Points, "Points"> {}
}

registerDatasetType(Points, "Points");