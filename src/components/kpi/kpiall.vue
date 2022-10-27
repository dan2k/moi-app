<template>
	<div>
		<div class="jumbotron mx-2">
			<div class="container">
				<form>
					<div class="form-row">
						<div class="form-group col-md-5">
							<label for="inputEmail4">ปี</label>
							<select 
								class="form-control" 
								v-model="year"
								@change="setRound()"
							>
								<option
									v-for="y in years"
									:key="y.yearTH"
									:value="y.yearTH"
								>
									{{
										Number(y.yearTH) + Number(543)
									}}
								</option>
							</select>
						</div>
						<div class="form-group col-md-5">
							<label for="">รอบ</label>
							<select v-model="round" class="form-control">
								<option
									v-for="r in rounds"
									:key="r"
									:value="r"
								>
									{{ r }}
								</option>
							</select>
						</div>
					</div>
				</form>
				<div class="table-responsive px-2">
					<table class="table table-bordered table-hover">
						<thead class="bg-info">
							<tr>
								<th>ลำดับ</th>
								<th>idcode</th>
								<th width="200px">ชื่อ-สกุล</th>
								<th>ภาค</th>
								<th v-for="(ob, i) in object" :key="i">
									{{ ob.kpi_subj }}
								</th>
							</tr>
						</thead>
						<tbody class="bg-light">
							<tr v-for="(k, i) in kpis" :key="i">
								<td data-label="ลำดับที่">
									{{ i + 1 }}
								</td>
								<td data-label="idcode">
									{{ k.emp_id }}
								</td>
								<td data-label="ชื่อ-สกุล">
									{{ k.thiname }}
								</td>
								<td data-label="ภาค">{{ k.region }}</td>
								<td
									v-for="(ob, j) in object"
									:key="j"
									:data-label="ob.kpi_subj"
									align="center"
								>
									{{
										k[
											`kpi_id_${ob.kpi_id}_grade`
										] || "-"
									}}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
	<loading v-if="isLoading"></loading>
</template>

<script>
import { onMounted } from "vue";
import useKpi from "@/components/kpi/useKpi.js";
export default {
	setup() {
		const {
			years,
			year,
			round,
			rounds,
			getKpiAll,
			getYear,
			kpis,
			object,
			isLoading,
			setRound,
		} = useKpi();
		onMounted(async () => {
			isLoading.value = true;
			await getYear();
			await getKpiAll();
			isLoading.value = false;
		});
		return {
			years,
			year,
			round,
			rounds,
			kpis,
			object,
			isLoading,
			setRound,
		};
	},
};
</script>

<style scoped>
table {
	font-size: 12px;
}
@media screen and (max-width: 767px) {
	/* table th,
	table td {
		max-width: 767;
		width: 100%;
	} */
	table thead {
		display: none;
	}
	table tr > * {
		display: block;
		text-align: left;
	}
	table tbody tr > *:first-child {
		/* margin-top: 4%; */
		background-color: #212529;
		color: white;
		text-align: left;
	}
	table tbody tr > *:before {
		content: attr(data-label) "\003A\00a0\00a0";
		float: left;
		text-transform: uppercase;
		font-weight: bold;
		font-size: 1em;
	}
}
</style>
