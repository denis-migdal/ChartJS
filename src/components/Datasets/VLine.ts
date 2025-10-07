import { ComponentArgs, WithExtraProps } from "..";
import Line from "./Line";
import { datasetArgsParser, registerDatasetType } from ".";

type ArgsData = number|null;
type Args     = ComponentArgs<VLine, [ArgsData]>;

// https://github.com/microsoft/TypeScript/issues/62395
export default class VLine extends WithExtraProps(Line, {
            data: null as ArgsData,
            showPoints: false as const,
        }) {

    // one line due to ConstructorParem use...
    constructor(...args: Args) {
        super( datasetArgsParser(...args) ); // TODO: somehow give condition...
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

declare module "../../Chart" {
    interface ChartJS {
        addVLine   (...args: Args): ChartJS;
        createVLine(...args: Args): VLine;
    }
}

registerDatasetType(VLine, "VLine");