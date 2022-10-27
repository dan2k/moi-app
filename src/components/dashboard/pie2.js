import { reactive } from "vue";
export const pieData2 = reactive({
	series: [],
	chart: {
		height: 350,
		width: 450,
		type: "pie",
	},
	chartOptions: {
		colors: ["#847ff3", "#acddfa"],
		labels: ["ออก csv", "ไม่ออก csv"],
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
		/* title: {
			text: "สรุปปัญหาจากเฉพาะที่ส่งส่วนกลาง",
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
		}, */
	},
});
export const genPie2 = (data, year) => {
	pieData2.series.length = 0;
	pieData2.series.push(
		data.value
			.filter(
				(it1, i) =>
					it1.center == "y" &&
					it1.csv == "y" &&
					it1.yearTH == year
			)
			.reduce((p, c) => Number(p) + 1, 0)
	);
	pieData2.series.push(
		data.value
			.filter(
				(it1, i) =>
					it1.center == "y" &&
					it1.csv == "n" &&
					it1.yearTH == year
			)
			.reduce((p, c) => Number(p) + 1, 0)
	);
	pieData2.chartOptions = {
		...pieData2.chartOptions,
		title: {
			text: "สรุปปัญหาจากเฉพาะที่ส่งส่วนกลาง ปี " + year,
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
