import { ComponentArgs, WithExtraProps } from "..";
import Line from "./Line";
import { datasetArgsParser, registerDatasetType } from ".";

type ArgsData = number|null;
type Args     = ComponentArgs<HLine, [ArgsData]>;

// https://github.com/microsoft/TypeScript/issues/62395
export default class HLine extends WithExtraProps(Line, {
            data: null as ArgsData,
            showPoints: false as const,
        }) {

    // one line due to ConstructorParem use...
    constructor(...args: Args) {
        super( datasetArgsParser(...args) ); // TODO: somehow give condition...
    }

    // fix instance properties type.
    // @ts-ignore
    override defaults!: typeof HLine.Defaults;

    protected override getParsedData() {
        const value = this.properties.getValue("data");
        if( value === null)
            return [];

        //TODO...
        return super.getParsedData([ [Number.NEGATIVE_INFINITY, value],
                                     [Number.POSITIVE_INFINITY, value] ]);
    }
}

// =================== PLUGIN =========================

import ChartJS from "../../Chart";

declare module "../../Chart" {
    interface ChartJS {
        addHLine   (...args: Args): ChartJS;
        createHLine(...args: Args): HLine;
    }
}

registerDatasetType(HLine, "HLine");