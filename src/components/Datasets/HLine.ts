import { updateDataset } from ".";
import override from "../impl/override";
import { WithComponent } from "../impl/registerComponent";
import Line from "./Line";

const HLine = override(Line, {
    name      : "HLine",
    properties: {
        data      : null  as number|null,
        showPoints: false as const,
    },
    cstrArgsParser(opts, value: number) {
        opts.data = value
    },
    onUpdate(data, internals) {
        updateDataset(data, internals, HLineParser);
    }
});

function HLineParser(value: number|null) {

    if( value === null)
        return [];

    return [{x: Number.NEGATIVE_INFINITY, y: value},
            {x: Number.POSITIVE_INFINITY, y: value}];
}

declare module "../../Chart" {
    interface ChartJS extends WithComponent<typeof HLine> {}
}

export default HLine;