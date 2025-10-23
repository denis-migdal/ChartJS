import { ParsedDataset, updateDataset } from ".";
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

function HLineParser(value: number|null, target: ParsedDataset) {

    if( value === null) {
        target.length = 0;
        return target;
    }

    target.length = 2;
    target[0] = {x: Number.NEGATIVE_INFINITY, y: value};
    target[1] = {x: Number.POSITIVE_INFINITY, y: value};

    return target;
}

declare module "../../Chart" {
    interface ChartJS extends WithComponent<typeof HLine> {}
}

export default HLine;