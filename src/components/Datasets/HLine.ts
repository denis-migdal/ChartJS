import { WithExtraProps } from "..";
import Line from "./Line";

//TODO: move out...
type HLineData = null|number;
type HLineOpts = Partial<(typeof HLine)["Defaults"]>;

function parseHLineArgs(data_or_opts?: HLineData|HLineOpts,
                                opts?: HLineOpts) {
    if( data_or_opts === null || typeof data_or_opts === "number" ) {
        if( opts === undefined)
            opts = {};
        opts.data = data_or_opts;
    } else {
        opts = data_or_opts;
    }

    return opts;
}

// https://github.com/microsoft/TypeScript/issues/62395
export default class HLine extends WithExtraProps(Line, {
            data: null as HLineData,
            showPoints: false as const,
        }) {

    // one line due to ConstructorParem use...
    constructor(...args: [HLineData]|[HLineOpts]|[HLineData, HLineOpts]) {
        super( parseHLineArgs(...args) ); // TODO: somehow give condition...
    }

    // fix instance properties type.
    // @ts-ignore
    override defaults!: typeof HLine.Defaults;

    protected override getParsedData() {
        const value = this.properties.getValue("data");
        if( value === null)
            return [];

        //TODO...
        return super.getParsedData([ [0, value], [1, value] ]);
    }
}

Line.Defaults
HLine.Defaults // defaults is incorrect...

// =================== PLUGIN =========================

import ChartJS from "../../Chart";

type HLineArgs = ConstructorParameters<typeof HLine>;

declare module "../../Chart" {
    interface ChartJS {
        addHLine   (...args: HLineArgs): ChartJS;
        createHLine(...args: HLineArgs): HLine;
    }
}

ChartJS.prototype.addHLine = function(...args: HLineArgs) {
    this.createHLine(...args);
    return this;
}
ChartJS.prototype.createHLine = function(...args: HLineArgs) {
    const line = new HLine(...args);
    this.append(line);
    return line;
}