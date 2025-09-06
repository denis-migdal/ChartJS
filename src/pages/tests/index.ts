import ChartJS   from "../../";
import Line from "../../components/Datasets/Line";

const chart = new ChartJS(); // or new ChartJS(canvas);

//TODO...
chart.addLine({color: "red", data: [[0,0], [1,1]] as const});
const line = chart.createLine({color: "red", data: [[1,0], [0,1]] as const});

line.properties.color = "blue";

let i = 0;
/*
setInterval(() => {
    
    const v = (i/10)%1;
    ++i;
    compo.properties.setValue("data", [[v,v]]);

}, 200);*/

// chart.update(); // do not need if becoming visible...
document.body.append(chart.canvas);