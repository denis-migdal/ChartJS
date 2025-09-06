// TODO: "import @XXX"
import ChartJS   from "../../../../";

const chart = new ChartJS()
    .addLine([[1,0  ], [0,1  ]], {color: "blue"})
    .addLine([[1,0.5], [0,0.5]]);

const line1 = chart.createLine([[0,0], [1,1]], {showPoints: true});
line1.properties.color = "red";

const line2 = chart.createLine({showPoints: true, color: "green"});
line2.properties.data = [[0.5,0], [0.5,1]];

document.body.append(chart.canvas);