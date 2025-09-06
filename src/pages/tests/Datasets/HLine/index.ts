// TODO: "import @XXX"
import ChartJS   from "../../../../";

const chart = new ChartJS()
    .addHLine(1, {color: "blue"})
    .addHLine(0);

const line1 = chart.createHLine(0.2);
line1.properties.color = "red";

const line2 = chart.createHLine({color: "green"});
line2.properties.value = 0.4;

document.body.append(chart.canvas);