import { ComponentArgs, WithExtraProps } from "..";
import Line from "./Line";
import { datasetArgsParser, registerDatasetType, WithDataset } from ".";

type ArgsData = number|null;

// https://github.com/microsoft/TypeScript/issues/62395
export default class VLine extends WithExtraProps(Line, {
            data: null as ArgsData,
            showPoints: false as const,
        }) {

    constructor(...args: ComponentArgs<VLine, [ArgsData]>) {
        super( datasetArgsParser(...args) );
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

declare module "../../Chart" {
    interface ChartJS extends WithDataset<typeof VLine, "VLine"> {}
}

registerDatasetType(VLine, "VLine");