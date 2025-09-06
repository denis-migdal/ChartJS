// TODO: "import @XXX"
import ChartJS   from "../../../../Chart";
import Line      from "../../../../components/Datasets/Line";

const chart = new ChartJS();

const line = new Line(chart, {color: "red"});
line.properties.data = [[0,0], [1,1]];

document.body.append(chart.canvas);