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

function VLineParser(value: number|null, target: {x: number, y:number}[]) {

    if( value === null) {
        target.length = 0;
        return;
    }

    target.length = 2;
    target[0] = {x: value, y: Number.NEGATIVE_INFINITY};
    target[1] = {x: value, y: Number.POSITIVE_INFINITY};
}

declare module "../../Chart" {
    interface ChartJS extends WithComponent<typeof VLine> {}
}

export default VLine;