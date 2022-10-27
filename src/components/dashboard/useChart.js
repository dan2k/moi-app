import { reactive, toRefs } from "vue";
import { api } from "@/helper/api";
import { barData, genBar } from "./bar.js";
import { barData2, genBar2 } from "./bar2.js";
import { pieData, genPie } from "./pie.js";
import { pieData2, genPie2 } from "./pie2.js";
import { lineData, genLine } from "./line.js";
import { tableData, genTable,sub1Data,genSub1, numberFormatter } from "./table.js";
import { region, region1 } from "./region.js";

export default function useChart() {
	const state = reactive({
		data: [],
		year: [],
		group: [],
		sub1:[],
	});
	const loadData = async () => {
		let tmp = await api.post("/dashboard/v1/getData");
		state.data = tmp.data.data;
		state.year = tmp.data.year;
		state.group = tmp.data.group;
	};
	const loadSub1 = async(gid)=>{
		let tmp =await api.get('/dashboard/v1/getSub1/'+gid);
		state.sub1=tmp.data.data;
	}
	return {
		...toRefs(state),
		region,
		region1,
		barData,
		barData2,
		pieData,
		pieData2,
		lineData,
		tableData,
		sub1Data,
		loadData,
		loadSub1,
		genBar,
		genBar2,
		genPie,
		genPie2,
		genLine,
		genTable,
		genSub1,
		numberFormatter,
	};
}
