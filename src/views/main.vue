<template>
	<div class="container h-50">
		<!-- <div class="loading" v-if="isloading">Loading&#8230;</div> -->
		<!-- <loading v-if="isloading"></loading> -->
		<div class="row text-info justify-content-center align-items-center">
			<h3 class="text-center">DASHBOARD</h3>
		</div>
		<div class="row text-info justify-content-center align-items-center">
			<chart></chart>
		</div>
	</div>
</template>

<script>
import { onMounted } from "vue";
import Chart from "@/components/dashboard/chart.vue";
export default {
	components: {
		Chart,
	},

	setup() {
		onMounted(async () => {
			// setTimeout(() => {
			// 	router.push({ path: "/main/", replace: true });
			// }, 500);
		});
		return {
			// isloading
			// data,
		};
	},
};
</script>

<style scoped></style>
