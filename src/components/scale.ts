import Component, { WithExtraProps } from ".";
import { InternalChart } from "../Chart";

import {CategoryScale, Chart, LinearScale} from 'chart.js';

// Can't register plugins after graph creation...
Chart.register([
  LinearScale,
  CategoryScale
]);

type ScaleOpts = Partial<(typeof Scale)["Defaults"]>;

function parseScaleArgs(name_or_opts: string|ScaleOpts = {}, opts: ScaleOpts = {}) {

    if( typeof name_or_opts === 'string')
        opts.name = name_or_opts;
    else
        opts = name_or_opts;

    return opts;
}

function buildLinearScale() {
    return {
        type    : 'linear',
        // @ts-ignore
        beginAtZero: true,
        offset     : false,
        grid: {
            offset: false,
        }
    } as any; // Fuck this.;
}

function buildLabelScale(pos: "top"|"bottom"|"left"|"right") {
    
    const scale: any = {
        type   : "category",
        offset : true,
        grid: {
            offset: true
        },
    }

    if(pos === "left" || pos === "right") {
        scale.reverse = true;
        scale.ticks = {
            padding: 0,
            align: 'start',
            crossAlign: 'center',
            maxRotation: 90,
            minRotation: 90
        };
    }

    return scale;
}

// https://github.com/microsoft/TypeScript/issues/62395
export default class Scale extends WithExtraProps(Component, {
            name  : "string",
            pos   : null as null|"left"|"right"|"top"|"bottom",
            min   : null as null|number,
            max   : null as null|number,
            labels: null as null|string[]
        }) {

    constructor(...args: [string]|[string, ScaleOpts]|[ScaleOpts & {name: string}]) {
        super( parseScaleArgs(...args) );
    }

    protected override onUpdate(chart: InternalChart): void {

        super.onUpdate(chart);

        const name = this.properties.getValue("name");
        let pos    = this.properties.getValue("pos");

        if( pos === null ) {
            if(name[0] === 'y')
                pos = 'left';
            else
                pos = 'bottom';
        }

        const labels = this.properties.getValue("labels");

        let scale: any;
        if( labels === null ) {
            scale = buildLinearScale();

            const min    = this.properties.getValue("min");
            const max    = this.properties.getValue("max");

            if( min !== null)
                scale.min = min;
            if( max !== null)
                scale.max = max;
        } else {

            scale = buildLabelScale(pos);

            scale.labels = labels;
        }

        scale.position = pos;

        chart._chart.options.scales![name] = scale;
    }

/*
    protected override onUpdate() {
        //TODO: check if pending...
        super.onUpdate();
        this.dataset.data = this.getParsedData();
        this.dataset.borderColor = this.properties.getValue("color");
    }
        */
}



import ChartJS from "../Chart";
import { parse } from "@swc/core";

type ScaleArgs = ConstructorParameters<typeof Scale>;

declare module "../Chart" {
    interface ChartJS {
        addScale   (...args: ScaleArgs): ChartJS;
        createScale(...args: ScaleArgs): Scale;
    }
}

// we keep type checks
ChartJS.prototype.addScale = function(...args: ScaleArgs) {
    this.createScale(...args);
    return this;
}
ChartJS.prototype.createScale = function(...args: ScaleArgs) {
    const scale = new Scale(...args);
    this.append(scale);
    return scale;
}