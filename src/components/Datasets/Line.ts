import { ChartDataset } from "chart.js";
import Component, { WithExtraProps } from "..";
import Dataset from ".";

// https://github.com/microsoft/TypeScript/issues/62395
export default class Line extends WithExtraProps(Dataset, {
            data      : [] as [number, number][], // vs RawData...
            type      : "scatter" as const,
            showPoints: false,
        }) {

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

    override onUpdate() {
        super.onUpdate();

        if( ! this.properties.getValue("showPoints") )
			this.dataset.pointRadius = 0;
    }
}