import { reactive } from "vue";
import { region, region1 } from "./region.js";
export const barData = reactive({
	series: [
		{
			name: "แก้ปัญหาเองได้",
			data: [],
		},
		{
			name: "ส่งปรึกษาส่วนกลางไม่เปิด csv",
			data: [],
		},
		{
			name: "ส่งปรึกษาส่วนกลางเปิด csv",
			data: [],
		},
	],
	chartOptions: {
		colors: ["#847ffa","#fcad74", "#c96865"],
		chart: {
			type: "bar",
			height: 350,
			stacked: true,
			stackType: "100%",
		},
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
		xaxis: {
			labels: {
				rotate: -45,
			},
			categories: region,
		},
		fill: {
			opacity: 1,
		},
		legend: {
			position: "top",
			offsetX: 0,
			offsetY: 0,
		},
		/* title: {
			text: "แสดงข้อมูลการแก้ปัญหาของแต่ละภาค",
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
export const genBar = (data, year) => {
	let data1 = [];
	let data2 = [];
	let data3 = [];
	region1.forEach((it, i) => {
		data1.push(
			data.value
				.filter(
					(it1, i) =>
						it1.center == "n" &&
						it1.region == it &&
						it1.yearTH == year
				)
				.map((it1) => it1.center)
				.reduce((p, c) => Number(p) + 1, 0)
		);
		data2.push(
			data.value
				.filter(
					(it1, i) =>
						it1.center == "y" &&
						it1.csv == "n" &&
						it1.region == it &&
						it1.yearTH == year
				)
				.map((it1) => it1.center)
				.reduce((p, c) => Number(p) + 1, 0)
		);
		data3.push(
			data.value
				.filter(
					(it1, i) =>
						it1.center == "y" &&
						it1.csv == "y" &&
						it1.region == it &&
						it1.yearTH == year
				)
				.map((it1) => it1.center)
				.reduce((p, c) => Number(p) + 1, 0)
		);
	});

	barData.series[0].data = data1;
	barData.series[1].data = data2;
	barData.series[2].data = data3;
	barData.chartOptions = {
		...barData.chartOptions,
		title: {
			text: "แสดงข้อมูลการแก้ปัญหาของแต่ละภาค ปี " + year,
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
