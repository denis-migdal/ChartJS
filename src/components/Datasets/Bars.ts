import { WithComponent } from "../impl/registerComponent";
import derive from "../impl/derive";
import Dataset from ".";

import {Chart, BarController, BarElement, ChartDataset} from 'chart.js';
Chart.register(BarElement, BarController);

const Points = derive(Dataset, {
    name      : "Bars",
    properties: {
        type: "bar" as const,
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
    }
});

declare module "../../Chart" {
    interface ChartJS extends WithComponent<typeof Points> {}
}

export default Points;