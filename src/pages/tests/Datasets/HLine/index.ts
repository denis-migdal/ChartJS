// TODO: "import @XXX"
import ChartJS   from "../../../../";

const chart = new ChartJS()
    .addHLine(1, {color: "blue"})
    .addHLine(0);

const line1 = chart.createHLine(0.2);
line1.properties.color = "red";

const line2 = chart.createHLine({color: "green"});
line2.properties.data = 0.4;
line2.properties.dddd = 2;
line2.properties.showPoints = true;

document.body.append(chart.canvas);