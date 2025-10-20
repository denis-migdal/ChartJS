import {CategoryScale, Chart, LinearScale, ScaleOptions} from 'chart.js';
import createComponentClass from './impl/createComponentClass';
import { WithComponent } from './impl/registerComponent';
Chart.register(LinearScale, CategoryScale);

type CatScale = ScaleOptions<'category'>;
type LinScale = ScaleOptions<'linear'>;

const Scale = createComponentClass({
    name      : "Scale",
    properties: {
        name   : "string",
        pos    : "auto" as "auto"|"left"|"right"|"top"|"bottom",
        min    : null as null|number,
        max    : null as null|number,
        labels : null as null|string[],
        display: true as boolean
    },
    createInternalData() {
        return {
            // chartJS internal state
            scale  : {} as LinScale|CatScale,
            // impl internal state
            name   : ""
        }
    },
    onInsert(chart, internals) {
        if( internals.name !== "")
            chart.options.scales![internals.name] = internals.scale;
    },
    onRemove(chart, internals) {
        const scales = chart.options.scales!;
        if( scales[internals.name] === internals.scale)
            delete scales[internals.name];
    },
    onUpdate(data, internals, refs) {

        const name = data.name;

        let pos = data.pos;
        if( pos === "auto" ) {
            if(name[0] === 'y')
                pos = 'left';
            else
                pos = 'bottom';
        }

        const scale = internals.scale;
        const type  = scale.type;
        clearScale(scale);

        const labels = data.labels;
        if( labels === null ) {

            if( type !== "linear")
                setScaleAsLinear(scale as LinScale);

            const min = data.min; const max = data.max;

            if( min !== null) scale.min = min;
            if( max !== null) scale.max = max;
        } else {

            if( type !== "category")
                setScaleAsCategory(scale as CatScale);

            (scale as CatScale).labels = labels;

            if(pos === "left" || pos === "right") {
                scale.reverse = true;
                scale.ticks   = CatTicks;
            }
        }

        scale.display  = data.display;
        scale.position = pos;

        internals.scale = scale;

        const renamed = internals.name !== name;
        if( ! renamed ) return;

        // please avoid renaming scales.
        for(let i = 0; i < refs.length; ++i) {
            const chart = refs[i].chart;
            if( chart === null)
                continue;

            const scales = chart.options.scales!;

            if( scales[internals.name] === internals.scale )
                delete scales[internals.name];

            scales[name] = internals.scale;
        }

        internals.name = name;
    },
});

declare module "../Chart" {
    interface ChartJS extends WithComponent<typeof Scale> {}
}

export default Scale;

// avoid building useless objects (small opti).
const LinGrid = { offset: false }
const CatGrid = { offset: true  }
const CatTicks = {
    padding: 0,
    align: 'start',
    crossAlign: 'center',
    maxRotation: 90,
    minRotation: 90
} as const

function clearScale(scale: LinScale|CatScale) {
    delete scale.reverse;
    delete scale.ticks;
    delete scale.min;
    delete scale.max;
}

function setScaleAsLinear(scale: LinScale) {

    scale.type   = 'linear';
    scale.offset = false;
    scale.grid   = LinGrid;
    scale.beginAtZero = true;
}

function setScaleAsCategory(scale: CatScale) {
    
    scale.type   = "category";
    scale.offset = true;
    scale.grid   = CatGrid;
}


