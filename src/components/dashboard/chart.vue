<template>
	<div class="col-12 text-center">
		ข้อมูลระหว่างปี {{ year[2] }} - {{ year[0] }}
	</div>
	<div class="col-md-6 col-sm-12">
		<apexchart
			id="pie"
			width="450"
			type="pie"
			:options="pieData.chartOptions"
			:series="pieData.series"
			style="width: 450px"
		></apexchart>
	</div>
	<div class="col-md-6 col-sm-12">
		<apexchart
			width="450"
			type="bar"
			:options="barData.chartOptions"
			:series="barData.series"
			style="width: 450px"
		></apexchart>
	</div>
	

	<div class="col-md-6 col-sm-12">
		<apexchart
			width="450"
			type="line"
			:options="lineData.chartOptions"
			:series="lineData.series"
			style="width: 450px"
		></apexchart>
	</div>
	<div class="col-md-6 col-sm-12">
		<apexchart
			width="450"
			type="pie"
			:options="pieData2.chartOptions"
			:series="pieData2.series"
			style="width: 450px"
		></apexchart>
	</div>
	<div class="col-md-6 col-sm-12">
		<apexchart
			width="450"
			type="bar"
			:options='barData2.chartOptions'
			:series='barData2.series'
			style="width: 450px"
		></apexchart>
	</div>
	<h3>สรุปข้อมูลการรับแจ้งปัญหาแยกตามระบบงาน ปี {{ year[0] }}</h3>
	<div class="table-responsive">
		<table class="table table-bordered">
			<thead>
				<tr>
					<th>ลำดับ</th>
					<th>ระบบงาน</th>
					<th>จำนวนจ๊อบทั้งหมด</th>
					<th>แก้ปัญหาเองได้</th>
					<th>คิดเป็น</th>
					<th>ส่งปรึกษาส่วนกลาง</th>
					<th>คิดเป็น</th>
					<th>ออก csv</th>
					<th>คิดเป็น</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="(tb, i) in tableData"
					:key="i"
					@click="genSub(tb)"
					:class="{ isClick: !tb.app_sub1_id }"
				>
					<td>{{ i + 1 }}</td>
					<td>{{ tb.title }}</td>
					<td>{{ numberFormatter(tb.total) }}</td>
					<td>{{ numberFormatter(tb.self) }}</td>
					<td>{{ tb.self_percent.toFixed(2) }} %</td>
					<td>{{ numberFormatter(tb.center) }}</td>
					<td>{{ tb.center_percent.toFixed(2) }} %</td>
					<td>{{ numberFormatter(tb.csv) }}</td>
					<td>{{ tb.csv_percent.toFixed(2) }} %</td>
				</tr>
			</tbody>
		</table>
	</div>
	<loading v-if="isLoading"></loading>
	<div>
		<modal v-if="showModal" @close="close">
			<template #header>
				<h5 class="modal-title">{{ title }}</h5>
			</template>
			<template #body>
				<div class="table-responsive">
					<table class="table table-bordered">
						<thead>
							<tr>
								<th>ลำดับ</th>
								<th>ระบบงาน</th>
								<th>จำนวนจ๊อบทั้งหมด</th>
								<th>แก้ปัญหาเองได้</th>
								<th>คิดเป็น</th>
								<th>ส่งปรึกษาส่วนกลาง</th>
								<th>คิดเป็น</th>
								<th>ออก csv</th>
								<th>คิดเป็น</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(tb, i) in sub1Data" :key="i">
								<td>{{ i + 1 }}</td>
								<td>{{ tb.title }}</td>
								<td>{{ numberFormatter(tb.total) }}</td>
								<td>{{ numberFormatter(tb.self) }}</td>
								<td>
									{{ tb.self_percent.toFixed(2) }} %
								</td>
								<td>
									{{ numberFormatter(tb.center) }}
								</td>
								<td>
									{{ tb.center_percent.toFixed(2) }}
									%
								</td>
								<td>{{ numberFormatter(tb.csv) }}</td>
								<td>
									{{ tb.csv_percent.toFixed(2) }} %
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</template>
		</modal>
	</div>
</template>

<script>
import { onMounted, ref } from "vue";
import useChart from "./useChart.js";
import Modal from "./modal.vue";
export default {
	components: { Modal },
	setup() {
		const isLoading = ref(false);
		const showModal = ref(false);
		const title = ref("");
		const close = () => {
			showModal.value = false;
		};

		let {
			data,
			year,
			group,
			sub1,
			loadData,
			loadSub1,
			numberFormatter,
			genBar,
			genBar2,
			genPie,
			genPie2,
			genLine,
			genTable,
			genSub1,
			barData,
			barData2,
			pieData,
			pieData2,
			lineData,
			tableData,
			sub1Data,
		} = useChart();
		const genSub = async (tb) => {
			if (tb.app_sub1_id) return;
			isLoading.value = true;
			await loadSub1(tb.app_gid);
			genSub1(tb.app_gid, sub1, data, year.value[0]);
			// tdata.value = tb;
			isLoading.value = false;
			if (sub1Data.length < 1) return;
			title.value = tb.title;
			showModal.value = true;
		};
		onMounted(async () => {
			isLoading.value = true;
			await loadData();
			genPie(data, year.value[0]);
			genBar(data, year.value[0]);
			genBar2(data, year.value[0]);
			genLine(year, data);
			genPie2(data, year.value[0]);
			genTable(group, data, year.value[0]);
			isLoading.value = false;
		});
		return {
			barData,
			barData2,
			pieData,
			lineData,
			pieData2,
			year,
			tableData,
			numberFormatter,
			isLoading,
			showModal,
			close,

			genSub,
			sub1Data,
			title,
		};
	},
	// mounted() {
	// 	console.log(this.$refs.pie);
	// },
};
</script>
<style scoped>
table {
	font-size: 12px;
}
.isClick {
	cursor: pointer;
	color:darkcyan;
}
.isClick :hover{
	color:chocolate;
}
</style>
