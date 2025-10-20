import type Chart from "../Chart";
import {Chart as _Chart} from 'chart.js';

import zoomPlugin from "chartjs-plugin-zoom";
import Component, { WithExtraProps } from '.';
_Chart.register(zoomPlugin);

type ZoomDirection = "x" | "y" | "xy" | false;

// https://github.com/microsoft/TypeScript/issues/62395
export default class Dataset extends WithExtraProps(Component, {
            name: "zoom" as const,
            direction: "xy" as ZoomDirection
        }) {

    constructor(direction: ZoomDirection = "xy") {
        super({name: "zoom", direction});
    }

    protected override onInsert(chart: Chart) {
        super.onInsert(chart);

        (chart as any as InternalChart)._chart.options.plugins!["zoom"] = {
            zoom: {
                mode: "xy",
                wheel: {
                    enabled: true
                }
            },
            pan: {
                mode: "xy",
                enabled: true
            }
        };
    }
    
    // should not be called (you don't need to remove zoom, only disable it).
    protected override onRemove(chart: Chart) {
        super.onRemove(chart);

        delete (chart as any as InternalChart)._chart.options.plugins!["zoom"];
    }

    protected override onUpdate(chart: Chart) {
        super.onUpdate(chart);

        const direction = this.properties.getValue("direction");
        const cfg = (chart as any as InternalChart)._chart!.options.plugins!.zoom!;

        cfg.pan!.enabled = cfg.zoom!.wheel!.enabled = direction !== false;
        if( direction !== false)
            // @ts-ignore
            cfg.pan!.mode = cfg.zoom!.mode = direction;
    }
}

// =================== PLUGIN =========================

import ChartJS, { InternalChart } from "../Chart";
import { Zoom } from '..';

declare module "../Chart" {
    interface ChartJS {
        setZoom(direction: ZoomDirection): ChartJS;
        resetZoom(): ChartJS
    }
}

ChartJS.prototype.setZoom = function(direction: ZoomDirection) {
    let zoom = this.getComponent("zoom");
    if( zoom === null ) {
        zoom = new Zoom();
        this.append(zoom!);
    }
    (zoom as Zoom).properties.direction = direction;

    return this;
}
ChartJS.prototype.resetZoom = function() {
    this._chart.resetZoom();
    return this;
}