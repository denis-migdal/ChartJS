import { Chart, ChartTypeRegistry, InteractionMode, Tooltip, TooltipItem } from 'chart.js';
import createComponentClass from '../impl/createComponentClass';

Chart.register(Tooltip);

type Direction = "x" | "xy" | "y";

type TooltipTitleCallback = (items: TooltipItem<keyof ChartTypeRegistry>[]) => string|void;
type TooltipTitle = null|string|TooltipTitleCallback;

export const DEFAULT_TOOLTIP_TITLE: TooltipTitleCallback = (items) => {
    if(items.length === 0)
        return;
    return `${items[0].parsed.x}`;
};

const NULL_TOOLTIP_TITLE = () => {};

// hover seems unnecessary.
// I keep it for now just in case...
const DefaultTooltipSystem = createComponentClass({
    name      : "DefaultTooltipSystem",
    properties: {
        direction: "xy" as Direction,
        title    : null as TooltipTitle
    },
    createInternalData() {
        return {
            /*hover  : {
                mode     : "point" as InteractionMode,
                intersect: true
            },*/
            tooltip: {
                enabled: true,

                titleFont: {
                    family: 'Courier New'
                },
                bodyFont: {
                    family: 'Courier New'
                },

                //TODO: filter (cf chartHTML)
                // filter is per dataset
                
                callbacks: {
                    title: DEFAULT_TOOLTIP_TITLE,
                    label: () => { return "ok" }
                    // label is per dataset
                },

                mode: "point" as InteractionMode,
                intersect: true
            }
        }
    },
    onInsert(chart, internals) {
        //chart.options.hover            = internals.hover;
        chart.options.plugins!.tooltip = internals.tooltip;
    },
    onRemove(chart, internals) {
        delete chart.options.hover;
        delete chart.options.plugins!.tooltip;
    },
    onUpdate(data, internals, refs) {

        let mode: InteractionMode | Direction = data.direction;
        if( mode === "xy")
            mode = "point";

        const intersect = mode === "point";

        internals.tooltip.mode      = mode;
        internals.tooltip.intersect = intersect;

        const title = data.title;
        if( title === null)
            internals.tooltip.callbacks.title = NULL_TOOLTIP_TITLE;
        else if( typeof title === "string")
            internals.tooltip.callbacks.title = () => title;
        else
            internals.tooltip.callbacks.title = title;

        //internals.hover.mode      = internals.tooltip.mode      = mode;
        //internals.hover.intersect = internals.tooltip.intersect = intersect;
    },
});

export default DefaultTooltipSystem;


import { WithComponent } from '../impl/registerComponent';
declare module "../../Chart" {
    interface ChartJS extends WithComponent<typeof DefaultTooltipSystem> {}
}


// OLD CODE (still useful ?)

/*            
    tooltip: {

        filter: <TType extends ChartType>(context: TooltipItem<TType>) => {
            let name = (context.dataset as ChartDataset<TType>).label!;
            return this.#elements[name].filter(context);
        },
    }
}*/

/*itemSort: <TTypeA extends ChartType, TTypeB extends ChartType>(a: TooltipItem<TTypeA>, b: TooltipItem<TTypeB>) => {

            let diff = a.dataset.order - b.dataset.order;
            if( diff !== 0)
                return diff;
            
            diff = a.datasetIndex - b.datasetIndex;

            if( diff !== 0)
                return diff;

            return a.dataIndex - b.dataIndex;
        },
*/