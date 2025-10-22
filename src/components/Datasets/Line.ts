import Dataset, { rawParser, updateDataset } from ".";

import {Chart, ScatterController, LineElement, PointElement, ChartDataset} from 'chart.js';
import derive from "../impl/derive";
import { WithComponent } from "../impl/registerComponent";
Chart.register(ScatterController, LineElement, PointElement);

const Line = derive(Dataset, {
    name      : "Line",
    properties: {
        type      : "scatter" as const,
        showPoints: false,
    },
    createInternalData: () => {
        return {
            prevData: null as any,
            dataset  : {
                type       : "scatter",
                data       : [],
                showLine   : true,
                borderWidth: 2,
                parsing    : false,
                normalized : true
            } as ChartDataset<"scatter">,
        }
    },
    onUpdate: (data, internals) => {
        
        updateDataset(data, internals, rawParser);

        if( data.showPoints )
			delete internals.dataset.pointRadius;
        else
            internals.dataset.pointRadius = 0;
    },
});

declare module "../../Chart" {
    interface ChartJS extends WithComponent<typeof Line> {}
}

export default Line;