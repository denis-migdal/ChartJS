import { Chart, ChartType, ChartTypeRegistry, InteractionMode, Tooltip, TooltipItem } from 'chart.js';
import createComponentClass from '../impl/createComponentClass';

Chart.register(Tooltip);

type Direction = "x" | "xy" | "y";


type TooltipLabelCallback = (item: TooltipItem<keyof ChartTypeRegistry>) => string|null;
export type TooltipLabel = null|string|TooltipLabelCallback;

type TooltipTitleCallback = (items: TooltipItem<keyof ChartTypeRegistry>[]) => string|null;
type TooltipTitle = null|string|TooltipTitleCallback;

const NULL_TOOLTIP_TITLE = (items: TooltipItem<keyof ChartTypeRegistry>[]) => {};

const DefaultTooltipSystem = createComponentClass({
    name      : "DefaultTooltipSystem",
    properties: {
        direction: "xy" as Direction,
        title    : null as TooltipTitle
    },
    createInternalData() {
        return {
            hover  : {
                mode     : "point" as InteractionMode,
                intersect: true
            },
            tooltip: {
                enabled: true,

                titleFont: {
                    family: 'Courier New'
                },
                bodyFont: {
                    family: 'Courier New'
                },

                filter<TType extends ChartType>(item: TooltipItem<TType>, ...args: any[]) {

                    const point = item.parsed as any;
                    if( point.x === null || point.y === null )
                        return false;

                    let tooltip: TooltipLabel = (item.dataset as any).tooltip;

                    // Well can't access real label as the callback is called
                    // after filtering...
                    if( typeof tooltip === "function")
                        tooltip = tooltip(item);
                    
                    if(   tooltip === undefined
                       || tooltip === null
                       || tooltip === "")
                        return false;

                    return true;
                },

                callbacks: {
                    title: NULL_TOOLTIP_TITLE,
                    label: (item: TooltipItem<keyof ChartTypeRegistry>) => {

                        let tooltip: TooltipLabel = (item.dataset as any).tooltip;

                        if( typeof tooltip === "function")
                            tooltip = tooltip(item);

                        if( tooltip === undefined || tooltip === null )
                            return "";
                        
                        return tooltip;
                    }
                },

                mode: "point" as InteractionMode,
                intersect: true
            }
        }
    },
    onInsert(chart, internals) {
        chart.options.hover            = internals.hover;
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

        internals.hover.mode      = internals.tooltip.mode      = mode;
        internals.hover.intersect = internals.tooltip.intersect = intersect;

        // we don't care if we recreate a function at each update as tooltip
        // should not be updated frequently.
        const title = data.title;
        if( title === null)
            internals.tooltip.callbacks.title = NULL_TOOLTIP_TITLE;
        else if( typeof title === "string")
            internals.tooltip.callbacks.title = () => title;
        else
            internals.tooltip.callbacks.title = (item) => {
                const res = title(item);
                if( res === null ) return;
                return res;
            };

    },
});

export default DefaultTooltipSystem;


import { WithComponent } from '../impl/registerComponent';
declare module "../../Chart" {
    interface ChartJS extends WithComponent<typeof DefaultTooltipSystem> {}
}


// OLD CODE (still useful ?)

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