<div align="center">
  <h1>ChartJS++</h1>

  <p>Chart.JS wrapper enabling you to build and configure your graphs with OO interfaces.</p>
</div>

## Usage

```ts
const chart = new Chart();

chart.addLine("my line", [[0,0], [1,1]])
     .addLine([[0,1], [1,0]], {color: "red"});
```

<p align="center">
  <img src="https://raw.githubusercontent.com/denis-migdal/ChartJS/refs/heads/master/example.png" />
</p>

Graphs are aggregations of components (datasets, scales, etc) you can add or remove:
- `chart.addX(...)`: add a component `X` to the graph.
- `chart.createX(...)`: idem `addX` but returns the created component.
- `chart.append(c)`: add the component `c` to the graph (will be removed from its previous parent).
- `chart.import(c)`: add a clone of the component `c` to the graph.
- `chart.getComponent(name)`: returns the component named `name`.
- `chart.getComponentNames()`: returns the names of the graph's components.

Components are usually created with the following arguments: `([name,][data,...][opts])`. They have the following properties:
- `c.name`: the component name.
- `c.parent`: the component parent (usually the graph).
- `c.remove()`: remove the component from its parent.
- `c.clone()`: clone the component.

Some components has properties you can manipulate:
- `c.properties`
- `c.getProperty(name)`
- `c.setProperty(name, value)`
- `c.setProperties(props)`
- `c.clearProperties(name)`

### Signals

ChartJS++ is compatible with signals (you may need to use an adapter).

```ts
// a trivial implementation of signals.
const dataSignal = new TrivialSignal<number>();

const hline = syncedWithSignals(
  // the target component (will be cloned):
  new HLine(),
  // the signal(s) to listen:
  dataSignal,
  // the update function:
  (target, data) => {
    target.properties.data = data;
  }
);

// clone() is optimized to prevent unnecessary copies and updates.
graph.import(hline);

dataSignal.value = 0;
setInterval( () => ++dataSignal.value, 1000);
```

### Plugins

#### Zoom

Enables to configure the zoom/pan of the graph:
- `graph.setZoom(dir)` : dir is either `"x"`, `"y"`, `"xy"`, `false`.
- `graph.resetZoom()`

#### Datalabels

#### Tooltips

### Dataset

Represents data shown in your graph (e.g. line, histogram, etc).

| Property | Type | Default |
|----------|------|---------|
| `color` | `string` | `"black"` |
| `type` | `string` | `"scatter"` |
| `data` | `[number,number][]` | `[]` |
| `x` | `string` | `"x"` |
| `y` | `string` | `"y"` |

#### Points

Represents a set of points.

| Property | Type | Default |
|----------|------|---------|
| `type` | `"scatter"` | `"scatter"` |

#### Bars

Represents a bar. Works better with a category scale.

| Property | Type | Default |
|----------|------|---------|
| `type` | `"bar"` | `"bar"` |

#### Line

Represents a curve/line.

| Property | Type | Default |
|----------|------|---------|
| `type` | `"scatter"` | `"scatter"` |
| `showPoints` | `boolean` | `false` |

#### VLine/HLine

Represents a vertical/horizontal line.

| Property | Type | Default |
|----------|------|---------|
| `data` | `number\|null` | `null` |

### Scale

Represents a scale. If labels are given, behave as a category scale.

| Property | Type | Default |
|----------|------|---------|
| `name` | `string` | required |
| `pos` | `"auto""\|"left"\|"right"\|"top"\|"bottom"` | `"auto"` |
| `display` | `boolean` | `true` |
| `min` | `null\|number` | `null` |
| `max` | `null\|number` | `null` |
| `labels` | `null\|string[]` | `null` |

### Use the graph

#### In Browser mode (existing canvas)

```ts
const canvas = document.querySelector("canvas");

const chart = new Chart(canvas);

// configure graph here.
```

#### In Browser mode (without existing canvas)

```ts
const chart = new Chart();

// configure graph here.

// add the graph to the page :
document.body.append( chart.canvas );
```

#### In CLI mode

```ts
// use https://github.com/Automattic/node-canvas/
// npm install canvas.
import {Canvas} from "canvas";
const canvas = new Canvas(W,H);

const chart = new Chart(canvas);

// configure graph here.

// In CLI mode (Deno, Node, Bun), changes made after initialization
// requires an explicit call to .update().
chart.update();

// save the graph as a png file.
await Deno.writeFile("chart.png", await canvas.toBuffer());
```

## Build

- `npm run build`
- `npm run build-prod`
- `npm run watch`

### Generate lib .d.ts

`dts-bundle-generator -o ./dist/dev/libs/ChartJS/index.d.ts src/libs/ChartJS/index.ts`

https://github.com/timocov/dts-bundle-generator

- npm-dts : not for bundled files.
- npm-dts-webpack-plugin : not for multiple entries.