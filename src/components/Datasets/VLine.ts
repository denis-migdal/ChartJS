import { updateDataset } from ".";
import override from "../impl/override";
import { WithComponent } from "../impl/registerComponent";
import Line from "./Line";

const VLine = override(Line, {
    name      : "VLine",
    properties: {
        data      : null  as number|null,
        showPoints: false as const,
    },
    cstrArgsParser(opts, value: number) {
        opts.data = value
    },
    onUpdate(data, internals) {
        updateDataset(data, internals, VLineParser);
    }
});

function VLineParser(value: number|null) {

    if( value === null)
        return [];

    return [{x: value, y: Number.NEGATIVE_INFINITY},
            {x: value, y: Number.POSITIVE_INFINITY}];
}

declare module "../../Chart" {
    interface ChartJS extends WithComponent<typeof VLine> {}
}

export default VLine;