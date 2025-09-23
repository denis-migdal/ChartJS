import { WithExtraProps } from "..";
import Line from "./Line";

//TODO: move out...
type VLineData = null|number;
type VLineOpts = Partial<(typeof VLine)["Defaults"]>;

function parseVLineArgs(data_or_opts?: VLineData|VLineOpts,
                                opts?: VLineOpts) {
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
export default class VLine extends WithExtraProps(Line, {
            data: null as VLineData,
            showPoints: false as const,
        }) {

    // one line due to ConstructorParem use...
    constructor(...args: [VLineData]|[VLineOpts]|[VLineData, VLineOpts]) {
        super( parseVLineArgs(...args) ); // TODO: somehow give condition...
    }

    // fix instance properties type.
    // @ts-ignore
    override defaults!: typeof VLine.Defaults;

    protected override getParsedData() {
        const value = this.properties.getValue("data");
        if( value === null)
            return [];

        //TODO...
        return super.getParsedData([ [value, Number.NEGATIVE_INFINITY],
                                     [value, Number.POSITIVE_INFINITY] ]);
    }
}

// =================== PLUGIN =========================

import ChartJS from "../../Chart";

type VLineArgs = ConstructorParameters<typeof VLine>;

declare module "../../Chart" {
    interface ChartJS {
        addVLine   (...args: VLineArgs): ChartJS;
        createVLine(...args: VLineArgs): VLine;
    }
}

ChartJS.prototype.addVLine = function(...args: VLineArgs) {
    this.createVLine(...args);
    return this;
}
ChartJS.prototype.createVLine = function(...args: VLineArgs) {
    const line = new VLine(...args);
    this.append(line);
    return line;
}