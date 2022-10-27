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
					<table
						class="table table-bordered rounded table-hover"
					>
						<thead class="bg-info">
							<tr>
								<th>ลำดับที่</th>
								<th>ประเภท</th>
								<th>ตัวชี้วัด</th>
								<th>คะแนน</th>
								<th>เกรด</th>
							</tr>
						</thead>
						<tbody class="bg-light">
							<tr v-for="(k, i) in kpi" :key="i">
								<td data-label="ลำดับที่">
									{{ i + 1 }}
								</td>
								<td data-label="ประเภท">
									{{ k.type_desc }}
								</td>
								<td data-label="ตัวชี้วัด">
									{{ k.kpi_subj || "-" }}
								</td>
								<td data-label="คะแนน">
									{{ Number(k.score).toLocaleString () || "-" }}
								</td>
								<td data-label="เกรด">
									{{ k.grade || "-" }}
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
			getKpi,
			getYear,
			setRound,
			kpi,
			isLoading,
		} = useKpi();
		onMounted(async () => {
			isLoading.value = true;
			await getYear();
			await getKpi();
			isLoading.value = false;
		});

		return {
			years,
			year,
			round,
			rounds,
			kpi,
			setRound,
			isLoading,
		};
	},
};
</script>

<style scoped>
table tbody {
	background-color: aliceblue;
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
