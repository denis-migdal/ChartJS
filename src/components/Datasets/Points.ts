import { ChartDataset } from "chart.js";
import { ComponentArgs, WithExtraProps } from "..";
import Dataset, { datasetArgsParser } from ".";

import {Chart, ScatterController, PointElement} from 'chart.js';
// Can't register plugins after graph creation...
Chart.register(ScatterController, PointElement);


type ArgsData = [number, number][];
type Args     = ComponentArgs<Points, [ArgsData]>;

// https://github.com/microsoft/TypeScript/issues/62395
export default class Points extends WithExtraProps(Dataset, {
            data      : [] as ArgsData, // vs RawData...
            type      : "scatter" as const,
        }) {

    // one line due to ConstructorParem use...
    constructor(...args: Args) {
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

import ChartJS from "../../Chart";

declare module "../../Chart" {
    interface ChartJS {
        addPoints   (...args: Args): ChartJS;
        createPoints(...args: Args): Points;
    }
}

ChartJS.prototype.addPoints = function(...args: Args) {
    this.createPoints(...args);
    return this;
}
ChartJS.prototype.createPoints = function(...args: Args) {
    const line = new Points(...args);
    this.append(line);
    return line;
}