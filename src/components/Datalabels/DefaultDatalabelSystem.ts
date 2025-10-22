import { Chart } from 'chart.js';
import createComponentClass from '../impl/createComponentClass';

import ChartDataLabels, { Context } from 'chartjs-plugin-datalabels';
Chart.register(ChartDataLabels);

type DatalabelCallback = (value: {x: number, y: number}, context: Context) => string|null;

export type Datalabel = null|string|DatalabelCallback;

const DefaultDatalabelSystem = createComponentClass({
    name      : "DefaultDatalabelSystem",
    properties: {},
    createInternalData() {
        return {
            datalabel: {
                borderRadius: 4,
                font: { weight: 'bold' as const },
                color      : (context: Context): string => {
                    //TODO...
                    return 'white';
                },
                backgroundColor: (context: Context): string => {
                    // context.dataset.pointBackgroundColor ??
                    return context.dataset.backgroundColor as string
                        ?? 'black';
                },
                formatter: (value: {x: number, y: number}, context: Context) => {
                    let datalabel: Datalabel = (context.dataset as any).datalabel;

                    console.warn(context.dataset, datalabel);

                    if( typeof datalabel === "function")
                            datalabel = datalabel(value, context);

                    if(    datalabel === undefined
                        || datalabel === null
                        || datalabel === "")
                        return null;
                    
                    return datalabel;
                }
            }
            //TODO: onHover/onClick
        }
    },
    onInsert(chart, internals) {
        chart.options.plugins!.datalabels = internals.datalabel;
    },
    onRemove(chart, internals) {
        delete chart.options.plugins!.datalabels;
    },
    onUpdate(data, internals, refs) {
        //TODO...
    },
});

export default DefaultDatalabelSystem;


import { WithComponent } from '../impl/registerComponent';
declare module "../../Chart" {
    interface ChartJS extends WithComponent<typeof DefaultDatalabelSystem> {}
}

/*
//enabled: true,

    backgroundColor: (context: any) => {
        return context.dataset.pointBackgroundColor ?? context.dataset.backgroundColor ?? 'black';
    },
    borderRadius: 4,
    color: 'white',
    borderColor: 'white',
    font: {
        weight: 'bold'
    },
    formatter: (_value, context) => {

        const ref = (context.dataset as any).dataset as Dataset;
        
        return ref.datalabels(context);
    }
*/