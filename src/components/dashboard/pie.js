import { reactive } from "vue";
import { region, region1 } from "./region.js";
export const pieData = reactive({
	series: [],
	chart: {
		height: 350,
		width: 450,
		type: "pie",
	},
	chartOptions: {
		colors: [
			"#c96862",
			"#17c28c",
			"#847ff3",
			"#14dbf5",
			"#fcad74",
			"#acddfa",
			"#fca2c7",
			"#bef7de",
			"#7edffc",
			"#7edf00",
		],
		labels: region,
		responsive: [
			{
				breakpoint: 480,
				options: {
					legend: {
						position: "bottom",
						offsetX: -10,
						offsetY: 0,
					},
				},
			},
		],
		legend: {
			position: "right",
			offsetX: 0,
			offsetY: 0,
		},
		dataLabels: {
			enabled: true,
		},
		// title: {
		// 	text: "แสดงข้อมูลรับแจ้งทั้งหมด แยกรายภาค",
		// 	align: "center",
		// 	margin: 10,
		// 	offsetX: 0,
		// 	offsetY: 0,
		// 	floating: false,
		// 	style: {
		// 		fontSize: "14px",
		// 		fontWeight: "bold",
		// 		fontFamily: undefined,
		// 		color: "#1ae8a0",
		// 	},
		// },
	},
});
export const genPie = (data, year) => {
	pieData.series.length = 0;
	region1.forEach((it, i) => {
		pieData.series.push(
			data.value
				.filter((it1, i) => it1.region == it && it1.yearTH == year)
				.reduce((p, c) => Number(p) + 1, 0)
		);
	});
	pieData.chartOptions = {
		...pieData.chartOptions,
		title: {
			text: "แสดงข้อมูลรับแจ้งทั้งหมด แยกรายภาค ปี " + year,
			align: "center",
			margin: 10,
			offsetX: 0,
			offsetY: 0,
			floating: false,
			style: {
				fontSize: "14px",
				fontWeight: "bold",
				fontFamily: undefined,
				color: "#1ae8a0",
			},
		},
	};
};
