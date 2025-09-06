import ChartJS   from "../../Chart";
import Line from "../../components/Datasets/Line";

const chart = new ChartJS(); // or new ChartJS(canvas);

const compo = new Line(chart, {color: "red"});
chart.append( new Line({color: "red", data: [[0,0], [1,1]] as const}) );

compo.properties.color = "red";

let i = 0;
/*
setInterval(() => {
    
    const v = (i/10)%1;
    ++i;
    compo.properties.setValue("data", [[v,v]]);

}, 200);*/

// chart.update(); // do not need if becoming visible...
document.body.append(chart.canvas);