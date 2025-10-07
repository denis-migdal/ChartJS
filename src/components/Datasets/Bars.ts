import { BarController, ChartDataset } from "chart.js";
import { ComponentArgs, WithExtraProps } from "..";
import Dataset, { datasetArgsParser, registerDatasetType, WithDataset } from ".";

import {Chart, ScatterController, BarElement} from 'chart.js';
// Can't register plugins after graph creation...
Chart.register(ScatterController, BarElement, BarController);

type ArgsData = [number, number][];

//TODO: reversed: boolean

// https://github.com/microsoft/TypeScript/issues/62395
export default class Bars extends WithExtraProps(Dataset, {
            data      : [] as ArgsData, // vs RawData...
            type      : "bar" as const,
        }) {

    constructor(...args: ComponentArgs<Bars, [ArgsData]>) {
        super( datasetArgsParser(...args) );
    }

    static createDataset() {
        const dataset = Dataset.createDataset("bar");

        dataset.borderWidth   = 0;
        dataset.barPercentage = 1;
        dataset.categoryPercentage = 1;
        // for linear scale ?
        dataset.grouped = false;

        // dataset.barThickness = "flex"; // not working properly ?

        dataset.parsing     = false;
        dataset.normalized  = true;

        return dataset;
    }

    override get dataset(): ChartDataset<"bar"> {
        return super.dataset as any;
    }
}

// =================== PLUGIN =========================

declare module "../../Chart" {
    interface ChartJS extends WithDataset<typeof Bars, "Bars"> {}
}

registerDatasetType(Bars, "Bars");