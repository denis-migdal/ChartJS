import { WithComponent } from "../impl/registerComponent";
import derive from "../impl/derive";
import Dataset, { ParsedDataset, RawDataset, rawParser, updateDataset } from ".";

import {Chart, BarController, BarElement, ChartDataset} from 'chart.js';
Chart.register(BarElement, BarController);

const Bars = derive(Dataset, {
    name      : "Bars",
    properties: {
        type: "bar" as const,
        reversed: false
    },
    createInternalData() {
        return {
            prevData: null as any,
            dataset  : {
                type              : "bar",
                data              : [],
                borderWidth       : 0,
                barPercentage     : 1,
                categoryPercentage: 1,
                // for linear scale ?
                grouped   : false,
                // dataset.barThickness = "flex"; // not working properly ?
                parsing   : false,
                normalized: true
            } as ChartDataset<"bar">,
        }
    },
    onUpdate: (data, internals) => {
        let parser = rawParser;
        if( data.reversed)
            parser = reversedParser;

        updateDataset(data, internals, parser);
    },
});

function reversedParser(data: RawDataset, prev: ParsedDataset) {
    const line = rawParser(data, prev);
    if( line === data)
        throw new Error("Not implemented yet");
    for(let i = 0; i < line.length; ++i)
        line[i].y *= -1;
    return line;
}

declare module "../../Chart" {
    interface ChartJS extends WithComponent<typeof Bars> {}
}

export default Bars;