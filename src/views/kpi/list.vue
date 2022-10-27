<template>
	<kpi v-if="level!=1"></kpi>
	<kpi-all v-else></kpi-all>

</template>
<script>
import useKpi from "@/components/kpi/useKpi.js"
import Kpi from "@/components/kpi/kpi.vue";
import KpiAll from "@/components/kpi/kpiall.vue";
export default {
	components:{
		Kpi,
		KpiAll,
	},
	setup() {
		const {level}=useKpi();
		return {
			level,
		};
	},
};
</script>

<style scoped></style>
