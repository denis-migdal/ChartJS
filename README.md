<div align="center">
  <h1>ChartJS++</h1>

  <p>A wrapper of Chart.JS enabling you to configure your graphs with OO interfaces.</p>
</div>

## Usage

### In Browser mode (existing canvas)

```ts
const canvas = document.querySelector("canvas");

const chart = new Chart(canvas);

// configure graph here.
```

### In Browser mode (without existing canvas)

```ts
const canvas = document.createElement("canvas");

const chart = new Chart(canvas);

// configure graph here.

// add the graph to the page :
document.body.append( chart.canvas );
```

### In CLI mode

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

## Utils (TODO: move)

- IS_INTERACTIVE
- WithUpdate()