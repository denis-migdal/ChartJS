//TODO: @ChartJS++
import ChartJS from "../../Chart";

const chart = new ChartJS(); // or new ChartJS(canvas);

// chart.update(); // do not need if becoming visible...

document.body.append(chart.canvas);