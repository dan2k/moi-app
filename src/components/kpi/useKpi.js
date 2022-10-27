import { ref, watch } from "vue";
import { api } from "@/helper/api";
import { useStore } from "vuex";
export default function useKpi() {
	const years = ref([]);
	const date = new Date();
	const month = date.getMonth(); //0-11;
	const year = ref(date.getFullYear());
	const rounds = ref(month <= 6 ? [1] : [1, 2]);
	const round = ref(month <= 6 ? 1 : 2);
	const store = useStore();
	const empid = ref(
		store.getters["auth/getAuthData"].user[0].emp_id || null
	);
	const level = ref(store.getters["auth/getAuthData"].user[0].level || null);
	const kpi = ref([]);
	const kpis = ref([]);
	const object = ref([]);
     const isLoading=ref(false);
	const getKpi = async () => {
		let tmp = await api.post("/kpi/v1/getKpi", {
			empid: empid.value,
			level: level.value,
			year: year.value,
			round: round.value,
		});
		kpi.value = tmp.data.data;
		console.log(`kpi=>`, kpi.value);
	};
	const getKpiAll = async () => {
		let tmp = await api.post("kpi/v1/getKpiAll", {
			year: year.value,
			round: round.value,
		});
		kpis.value = tmp.data.data;
		object.value = tmp.data.object;
		console.log(kpis.value);
	};
	const getYear = async () => {
		let tmp = await api.get("/kpi/v1/getYear");
		years.value = tmp.data.data;
	};
	const setRound = () => {
		if (year.value == date.getFullYear()) {
			rounds.value = month <= 6 ? [1] : [1, 2];
			round.value = month <= 6 ? 1 : 2;
		} else {
			rounds.value = [1, 2];
			round.value = 1;
		}
		//console.log({year,round,rounds});
	};
	watch(year, async (value, old) => {
          isLoading.value=true;
		if (level.value == 1) {
			await getKpiAll();
		} else {
			await getKpi();
		}
          isLoading.value=false;
	});
	watch(round, async (value, old) => {
          isLoading.value=true;
		if (level.value == 1) {
			await getKpiAll();
		} else {
			await getKpi();
		}
          isLoading.value=false;
	});
	return {
		years,
		year,
		round,
		rounds,
		empid,
		level,
		getKpi,
		getKpiAll,
		getYear,
		setRound,
		kpi,
		kpis,
		object,
          isLoading,
	};
}
