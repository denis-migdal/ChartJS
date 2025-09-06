import { WithExtraProps } from "..";
import Line from "./Line";

//TODO: move out...
type LineData = null|number;
type LineOpts = Partial<(typeof HLine)["Defaults"]>;

//TODO... generic fct ?
function buildOpts(data_or_opts?: LineData|LineOpts,
                           opts?: LineOpts) {
    if( data_or_opts === null || typeof data_or_opts === "number" ) { // condition might change...
        if( opts === undefined)
            opts = {};
        opts.value = data_or_opts;
    } else {
        opts = data_or_opts;
    }

    return opts;
}

// https://github.com/microsoft/TypeScript/issues/62395
export default class HLine extends WithExtraProps(Line, {
            value: null as null|number,
        }) {

    // one line due to ConstructorParem use...
    constructor(...args: [LineData]|[LineOpts]|[LineData, LineOpts]) {
        super( buildOpts(...args) ); // TODO: somehow give condition...
    }

    protected override getParsedData() {
        const value = this.properties.getValue("value");
        if( value === null)
            return [];

        //TODO...
        return super.getParsedData([ [0, value], [1, value] ]);
    }

    override onUpdate() {
        super.onUpdate();
    }
}

// =================== PLUGIN =========================

import Chart from "../../Chart";

type LineArgs = ConstructorParameters<typeof HLine>;

declare module "../../Chart" {
    interface Chart {
        addHLine   (...args: LineArgs): Chart;
        createHLine(...args: LineArgs): HLine;
    }
}

Chart.prototype.addHLine = function(...args: LineArgs) {
    this.createHLine(...args);
    return this;
}
Chart.prototype.createHLine = function(...args: LineArgs) {
    const line = new HLine(...args);
    this.append(line);
    return line;
}