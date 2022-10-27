import { reactive } from "vue";
export const tableData = reactive([]);
export const sub1Data = reactive([]);
/* const round = (num) => {
	var m = Number((Math.abs(num) * 100).toPrecision(15));
	return (Math.round(m) / 100) * Math.sign(num);
}; */
export const numberFormatter = (num) => {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};
export const genTable = (group, data, year) => {
	tableData.length = 0;
	group.value.forEach((it, ix) => {
		let total = data.value
			.filter((it1, i) => {
				if (it.app_gid == 33)
					return (
						it.app_gid == it1.app_gid &&
						it.app_sub1_id == it1.app_sub1_id &&
						it1.yearTH == year
					);
				return it.app_gid == it1.app_gid && it1.yearTH == year;
			})
			.reduce((p, c) => {
				return Number(p) + 1;
			}, 0);
		let self = data.value
			.filter((it1, i) => {
				if (it.app_gid == 33)
					return (
						it.app_gid == it1.app_gid &&
						it.app_sub1_id == it1.app_sub1_id &&
						it1.center == "n" &&
						it1.yearTH == year
					);
				return (
					it1.app_gid == it.app_gid &&
					it1.center == "n" &&
					it1.yearTH == year
				);
			})
			.reduce((p, c) => {
				return Number(p) + 1;
			}, 0);
		let center = data.value
			.filter((it1, i) => {
				if (it.app_gid == 33)
					return (
						it.app_gid == it1.app_gid &&
						it.app_sub1_id == it1.app_sub1_id &&
						it1.center == "y" &&
						it1.yearTH == year
					);
				return (
					it.app_gid == it1.app_gid &&
					it1.center == "y" &&
					it1.yearTH == year
				);
			})
			.reduce((p, c) => {
				return Number(p) + 1;
			}, 0);
		let csv = data.value
			.filter((it1, i) => {
				if (it.app_gid == 33)
					return (it.app_gid =
						it1.app_gid &&
						it.app_sub1_id == it1.app_sub1_id &&
						it1.csv == "y" &&
						it1.yearTH == year);
				return (
					it.app_gid == it1.app_gid &&
					it1.csv == "y" &&
					it1.yearTH == year
				);
			})
			.reduce((p, c) => {
				return Number(p) + 1;
			}, 0);
		let self_percent = (self / total) * 100 || 0;
		let center_percent = (center / total) * 100 || 0;
		let csv_percent = (csv / total) * 100 || 0;
		tableData.push({
			title: it.title,
			total,
			self,
			self_percent,
			center,
			center_percent,
			csv,
			csv_percent,
			app_gid: it.app_gid,
			app_sub1_id: it.app_sub1_id,
		});
	});
	let total = tableData
		.map((it, i) => it.total)
		.reduce((p, c) => {
			return Number(p) + Number(c);
		}, 0);
	// console.log('total=>',total);
	let self = tableData
		.map((it, i) => it.self)
		.reduce((p, c) => {
			return Number(p) + Number(c);
		}, 0);
	let center = tableData
		.map((it, i) => it.center)
		.reduce((p, c) => {
			return Number(p) + Number(c);
		}, 0);
	let csv = tableData
		.map((it, i) => it.csv)
		.reduce((p, c) => {
			return Number(p) + Number(c);
		}, 0);

	let self_percent = (self / total) * 100 || 0;
	let center_percent = (center / total) * 100 || 0;
	let csv_percent = (csv / total) * 100 || 0;
	tableData.push({
		title: "รวม",
		total,
		self,
		self_percent,
		center,
		center_percent,
		csv,
		csv_percent,
	});
};
export const genSub1 = (gid,sub1, data, year) => {
	let tdata=data.value.filter((it,i)=>{
		return it.app_gid==gid;
	});
	//console.log("sub1=>", sub1.value);
	sub1Data.length = 0;
	sub1.value.forEach((it, ix) => {
		let total = tdata
			.filter((it1, i) => {
				if (it.app_sub1_id == 18) {
					return (
						it.app_sub1_id == it1.app_sub1_id &&
						it.app_sub2_id == it1.app_sub2_id &&
						it1.yearTH == year
					);
				}

				return (
					it.app_sub1_id == it1.app_sub1_id && it1.yearTH == year
				);
			})
			.reduce((p, c) => {
				return Number(p) + 1;
			}, 0);
		let self = tdata
			.filter((it1, i) => {
				if (it.app_sub1_id == 18)
					return (
						it.app_sub1_id == it1.app_sub1_id &&
						it.app_sub2_id == it1.app_sub2_id &&
						it1.center == "n" &&
						it1.yearTH == year
					);
				return (
					it1.app_sub1_id == it.app_sub1_id &&
					it1.center == "n" &&
					it1.yearTH == year
				);
			})
			.reduce((p, c) => {
				return Number(p) + 1;
			}, 0);
		let center = tdata
			.filter((it1, i) => {
				if (it.app_sub1_id == 18)
					return (
						it.app_sub1_id == it1.app_sub1_id &&
						it.app_sub2_id == it1.app_sub2_id &&
						it1.center == "y" &&
						it1.yearTH == year
					);
				return (
					it.app_sub1_id == it1.app_sub1_id &&
					it1.center == "y" &&
					it1.yearTH == year
				);
			})
			.reduce((p, c) => {
				return Number(p) + 1;
			}, 0);
		let csv = tdata
			.filter((it1, i) => {
				if (it.app_sub1_id == 18)
					return (
						it.app_sub1_id == it1.app_sub1_id &&
						it.app_sub2_id == it1.app_sub2_id &&
						it1.csv == "y" &&
						it1.yearTH == year
					);
				return (
					it.app_sub1_id == it1.app_sub1_id &&
					it1.csv == "y" &&
					it1.yearTH == year
				);
			})
			.reduce((p, c) => {
				return Number(p) + 1;
			}, 0);
		let self_percent = (self / total) * 100 || 0;
		let center_percent = (center / total) * 100 || 0;
		let csv_percent = (csv / total) * 100 || 0;
		sub1Data.push({
			title: it.title,
			total,
			self,
			self_percent,
			center,
			center_percent,
			csv,
			csv_percent,
		});
	});
	let total = sub1Data
		.map((it, i) => it.total)
		.reduce((p, c) => {
			return Number(p) + Number(c);
		}, 0);
	// console.log('total=>',total);
	let self = sub1Data
		.map((it, i) => it.self)
		.reduce((p, c) => {
			return Number(p) + Number(c);
		}, 0);
	let center = sub1Data
		.map((it, i) => it.center)
		.reduce((p, c) => {
			return Number(p) + Number(c);
		}, 0);
	let csv = sub1Data
		.map((it, i) => it.csv)
		.reduce((p, c) => {
			return Number(p) + Number(c);
		}, 0);

	let self_percent = (self / total) * 100 || 0;
	let center_percent = (center / total) * 100 || 0;
	let csv_percent = (csv / total) * 100 || 0;
	sub1Data.push({
		title: "รวม",
		total,
		self,
		self_percent,
		center,
		center_percent,
		csv,
		csv_percent,
	});
};
