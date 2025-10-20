import { WithComponent } from "../impl/registerComponent";
import derive from "../impl/derive";
import Dataset from ".";


import {Chart, ScatterController, PointElement, ChartDataset} from 'chart.js';
Chart.register(ScatterController, PointElement);

const Points = derive(Dataset, {
    name      : "Points",
    properties: {
        type: "scatter" as const,
    },
    createInternalData() {
        return {
            prevData: null as any,
            dataset  : {
                type       : "scatter",
                borderWidth: 2,
                parsing    : false,
                normalized : true
            } as ChartDataset<"scatter">,
        }
    }
});

declare module "../../Chart" {
    interface ChartJS extends WithComponent<typeof Points> {}
}

export default Points;