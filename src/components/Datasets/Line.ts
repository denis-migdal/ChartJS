import { ChartDataset } from "chart.js";
import { WithExtraProps } from "..";
import Dataset from ".";

import {Chart, ScatterController, LineElement, PointElement} from 'chart.js';
// Can't register plugins after graph creation...
Chart.register([
  ScatterController,
  LineElement,
  PointElement
]);

type LineData = [number, number][];
type LineOpts = Partial<(typeof Line)["Defaults"]>;

function parseLineArgs(data_or_opts: LineData|LineOpts = {},
                               opts: LineOpts = {}) {
    if( Array.isArray(data_or_opts) ) // condition might change...
        opts.data = data_or_opts;
    else
        opts = data_or_opts;

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
        super( parseLineArgs(...args) ); // TODO: somehow give condition...
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

    override onUpdate(chart: InternalChart) {
        super.onUpdate(chart);

        if( ! this.properties.getValue("showPoints") )
			this.dataset.pointRadius = 0;
    }
}

// =================== PLUGIN =========================

import ChartJS, { InternalChart } from "../../Chart";

type LineArgs = ConstructorParameters<typeof Line>;

declare module "../../Chart" {
    interface ChartJS {
        addLine   (...args: LineArgs): ChartJS;
        createLine(...args: LineArgs): Line;
    }
}

ChartJS.prototype.addLine = function(...args: LineArgs) {
    this.createLine(...args);
    return this;
}
ChartJS.prototype.createLine = function(...args: LineArgs) {
    const line = new Line(...args);
    this.append(line);
    return line;
}