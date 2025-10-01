import Component, { buildArgsParser, ComponentArgs, WithExtraProps } from ".";
import { InternalChart } from "../Chart";

import {CategoryScale, Chart, LinearScale} from 'chart.js';

// Can't register plugins after graph creation...
Chart.register([
  LinearScale,
  CategoryScale
]);

// name option is required.
type ScaleOpts = Partial<(typeof Scale)["Defaults"]>;
type Args = [string]|[string, ScaleOpts]|[ScaleOpts & {name: string}];

const parser = buildArgsParser();

function buildLinearScale() {
    return {
        type        : 'linear',
        beginAtZero : true,
        offset      : false,
        grid        : {
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
        super( parser(...args) );
    }

    protected override onUpdate(chart: ChartJS): void {

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

        (chart as InternalChart)._chart.options.scales![name] = scale;
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

declare module "../Chart" {
    interface ChartJS {
        addScale   (...args: Args): ChartJS;
        createScale(...args: Args): Scale;
    }
}

// we keep type checks
ChartJS.prototype.addScale = function(...args: Args) {
    this.createScale(...args);
    return this;
}
ChartJS.prototype.createScale = function(...args: Args) {
    const scale = new Scale(...args);
    this.append(scale);
    return scale;
}