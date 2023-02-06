import HtmlLegendPlugin from './pluginHtmlLegend.js';
import PieAutocolorPlugin from './pluginPieColors.js';
import VolumeSubchartPlugin from './pluginVolume.js';

import { Chart, Tooltip, Legend, _adapters,
    BarController, DoughnutController, LineController,
    BarElement, ArcElement, PointElement, LineElement,
    CategoryScale, LinearScale, TimeScale, Filler as FillerPlugin,
} from 'chart.js';

import 'chartjs-adapter-date-fns';

Chart.register(Tooltip, Legend,
    BarController, DoughnutController, LineController,
    BarElement, ArcElement, PointElement, LineElement,
    CategoryScale, LinearScale, TimeScale,
    HtmlLegendPlugin, PieAutocolorPlugin, FillerPlugin, VolumeSubchartPlugin);

const style = window.getComputedStyle(document.body);

Chart.defaults.font.family = 'Rubik, Roboto, sans-serif';
Chart.defaults.plugins.tooltip.enabled = false;
Chart.defaults.plugins.pie_autocolors.enabled = true;
Chart.defaults.plugins.legend.display = false;
Chart.defaults.plugins.filler.propagate = false;

Chart.defaults.scale.border.dash = [8, 6];
Chart.defaults.scale.border.display = false;
Chart.defaults.scale.ticks.maxRotation = 0;
Chart.defaults.scale.ticks.backdropPadding = 0;
Chart.defaults.scale.grid.color = style.getPropertyValue('--chart-grid-color');

Chart.defaults.elements.point.radius = 0;
Chart.defaults.elements.point.hitRadius = 16;
Chart.defaults.elements.point.borderWidth = 0;
Chart.defaults.elements.arc.borderColor = style.getPropertyValue('--chart-pie-border-color');
Chart.defaults.elements.arc.backgroundColor = style.getPropertyValue('--chart-skeleton-background-color');
Chart.defaults.elements.bar.backgroundColor = style.getPropertyValue('--chart-skeleton-background-color');
Chart.defaults.elements.line.backgroundColor = style.getPropertyValue('--chart-skeleton-background-color');
Chart.defaults.elements.line.borderColor = style.getPropertyValue('--chart-skeleton-background-color');
Chart.defaults.elements.line.borderWidth = 1;
Chart.defaults.elements.line.cubicInterpolationMode = 'monotone';

export default Chart;
