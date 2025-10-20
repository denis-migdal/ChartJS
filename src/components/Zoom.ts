import {Chart} from 'chart.js';
import createComponentClass from './impl/createComponentClass';

import zoomPlugin from "chartjs-plugin-zoom";
Chart.register(zoomPlugin);

type ZoomDirection = "x" | "y" | "xy";


const Zoom = createComponentClass({
    name      : "Zoom",
    properties: {
        name     : "zoom" as const,
        direction: "xy"   as ZoomDirection|false
    },
    createInternalData() {
        return {
            // chartJS internal state
            zoom: {
                zoom: {
                    mode: "xy" as ZoomDirection,
                    wheel: {
                        enabled: true
                    }
                },
                pan: {
                    mode: "xy" as ZoomDirection,
                    enabled: true
                }
            },
        }
    },
    onInsert(chart, internals) {

        //if( chart.options.plugins!["zoom"] !== undefined )
        //    throw new Error("Chart already has a zoom");

        chart.options.plugins!["zoom"] = internals.zoom;
    },
    onRemove(chart, internals) {
        delete chart.options.plugins!["zoom"];
    },
    onUpdate(data, internals, refs) {

        const direction = data.direction;
        const cfg       = internals.zoom;

        cfg.pan!.enabled = cfg.zoom!.wheel!.enabled = direction !== false;
        if( direction !== false)
            cfg.pan!.mode = cfg.zoom!.mode = direction;
    },
});

export default Zoom;

// =================== PLUGIN =========================

import ChartJS from "../Chart";
import { WithComponent } from './impl/registerComponent';

declare module "../Chart" {
    interface ChartJS extends WithComponent<typeof Zoom> {
        resetZoom(): ChartJS
    }
}

ChartJS.prototype.resetZoom = function() {
    this._chart.resetZoom();
    return this;
}