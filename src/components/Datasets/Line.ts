import { ChartDataset } from "chart.js";
import { WithExtraProps } from "..";
import Dataset from ".";

//TODO: move out...
type LineData = [number, number][];
type LineOpts = Partial<(typeof Line)["Defaults"]>;

//TODO... generic fct ?
function buildOpts(data_or_opts?: LineData|LineOpts,
                           opts?: LineOpts) {
    if( Array.isArray(data_or_opts) ) { // condition might change...
        if( opts === undefined)
            opts = {};
        opts.data = data_or_opts;
    } else {
        opts = data_or_opts;
    }

    return opts;
}

// https://github.com/microsoft/TypeScript/issues/62395
export default class Line extends WithExtraProps(Dataset, {
            data      : [] as LineData, // vs RawData...
            type      : "scatter" as const,
            showPoints: false,
        }) {

    // one line due to ConstructorParem use...
    constructor(...args: [LineData]|[LineOpts]|[LineData, LineOpts]) {
        super( buildOpts(...args) ); // TODO: somehow give condition...
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

    override onUpdate() {
        super.onUpdate();

        if( ! this.properties.getValue("showPoints") )
			this.dataset.pointRadius = 0;
    }
}

// =================== PLUGIN =========================

import Chart from "../../Chart";

type LineArgs = ConstructorParameters<typeof Line>;

declare module "../../Chart" {
    interface Chart {
        addLine   (...args: LineArgs): Chart;
        createLine(...args: LineArgs): Line;
    }
}

Chart.prototype.addLine = function(...args: LineArgs) {
    this.createLine(...args);
    return this;
}
Chart.prototype.createLine = function(...args: LineArgs) {
    const line = new Line(...args);
    this.append(line);
    return line;
}