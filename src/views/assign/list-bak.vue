<template>
	<div class="jumbotron mx-2">
		<div class="container">
			<button class="btn btn-primary float-right" @click="add()">
				+ เพิ่ม
			</button>
			<div class="table-responsive" style="height: 480px">
				<table class="table table-bordered">
					<slot name="header" :data="columns">
						<thead class=".bg-gradient-primary text-white">
							<th
								v-for="(it, k) of columns"
								:key="k"
								class="text-center"
							>
								{{ it.label }}
								<div
									class="float-right"
									v-if="it.sortable"
								>
									<a
										v-if="!it.order"
										@click="setOrder(it, 'asc')"
										><i
											class="fas fa-angle-up"
											style="cursor: pointer"
										></i
										><i
											class="fas fa-angle-down"
											style="cursor: pointer"
										></i
									></a>
									<a
										v-if="it.order == 'asc'"
										@click="setOrder(it, 'asc')"
										><i
											class="fas fa-angle-down"
											style="cursor: pointer"
										></i>
										></a
									>
									<a
										v-if="it.order == 'desc'"
										@click="setOrder(it, 'desc')"
										><i
											class="fas fa-angle-up"
											style="cursor: pointer"
										></i>
										></a
									>
								</div>
							</th>
						</thead>
					</slot>
					<tbody v-if="isLoading">
						<tr>
							<td
								:colspan="columns.length"
								class="text-center"
								style="height: 100%"
								valign="middle"
							>
								กำลังประมวลผลข้อมูล...
							</td>
						</tr>
					</tbody>
					<tbody v-if="!isLoading">
						<tr v-for="(a, i) of rows" :key="i">
							<td v-for="(it, k) of columns" :key="k">
								<div v-if="it.formatter">
									<span
										v-for="(
											obj, index
										) of it.formatter(
											i,
											a[it.name],
											a
										)"
										:key="index"
									>
										<button
											v-if="
												obj.type == 'button'
											"
											@[obj.event]="obj.func"
											:class="obj.class"
										>
											{{ obj.text }}
										</button>

										<span
											v-else-if="
												obj.type == 'text'
											"
											v-html="obj.text"
											:class="obj.class"
										></span>
									</span>
								</div>
								<div v-else>{{ a[it.name] }}</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<nav
				aria-label="Page navigation example "
				v-if="totals_page > 0"
			>
				<ul class="pagination mx-auto">
					<li class="page-item">
						<span class="page-link">แถว</span>
					</li>
					<li class="page-item">
						<select
							v-model="p_page_size"
							class="form-control page-link"
						>
							<option value="5">5</option>
							<option value="10">10</option>
							<option value="20">20</option>
							<option value="30">30</option>
						</select>
					</li>
					<li class="page-item">
						<button
							:disabled="p_page == 1"
							class="page-link"
							:class="{ 'text-secondary': p_page == 1 }"
							@click="first"
						>
							&lt;&lt;
						</button>
					</li>
					<li class="page-item">
						<button
							class="page-link"
							:class="{ 'text-secondary': p_page == 1 }"
							:disabled="p_page == 1"
							@click="prev()"
						>
							&lt;
						</button>
					</li>

					<li class="page-item" v-for="p in pageArr" :key="p">
						<button
							class="page-link"
							:class="{
								'bg-primary text-white': p_page == p,
							}"
							@click="setPage(p)"
						>
							{{ p }}
						</button>
					</li>

					<li class="page-item">
						<button
							class="page-link"
							:class="{
								'text-secondary': p_page == totals_page,
							}"
							:disabled="p_page == totals_page"
							@click="next()"
						>
							&gt;
						</button>
					</li>
					<li class="page-item">
						<button
							class="page-link"
							@click="last"
							:class="{
								'text-secondary': p_page == totals_page,
							}"
							:disabled="p_page == totals_page"
						>
							&gt;&gt;
						</button>
					</li>
					<li class="page-item">
						<span class="page-link">ไปที่-></span>
					</li>
					<li class="page-item">
						<select
							class="form-control page-link"
							v-model="p_page"
						>
							<option
								v-for="(p, i) of totals_page"
								:key="i"
								:value="p"
							>
								{{ p }}
							</option>
						</select>
					</li>
					<li class="page-item">
						<span class="page-link">
							---> {{ `${p_page}/${totals_page}` }}</span
						>
					</li>
				</ul>
			</nav>
		</div>
	</div>
</template>

<script>
import { useRouter } from "vue-router";
import { toRefs } from "vue";
import useTable from "./t1";
export default {
	props: {
		page: {
			type: Number,
			default: 1,
			required: false,
		},
		page_size: {
			type: Number,
			default: 5,
			required: false,
		},
		pagination_size: {
			type: Number,
			default: 5,
			required: false,
		},
		url: {
			type: String,
			default: "/assign/v1/all",
			required: true,
		},
		method: {
			type: String,
			default: "post",
			required: false,
		},
		queryParams: {
			type: Object,
			default: {
				x: 1,
			},
			required: false,
		},
		columns: {
			type: Object,
			default: [
				{
					label: "job_id",
					name: "job_id",
					sortable: true,
					order: "",
				},
				{
					label: "หัวข้อ",
					name: "title",
					
				},
				{
					label: "รายละเอียด",
					name: "detail",
				},
				{
					label: "#",
					name: "action",
					formatter: (i, v, row) => {
						return [
							{
								type: "button",
								class: "btn btn-danger mr-2",
								text: "ลบ",
								event: "click",
								func: () => {
									talk(row.job_id);
								},
							},
							{
								type: "button",
								class: "btn btn-danger mr-2",
								text: "ลบ",
								event: "click",
								func: () => {
									talk(row.job_id);
								},
							},
						];
					},
				},
			],
			required: true,
		},
	},
	setup(props) {
		const router = useRouter();
		let dbTable = useTable(
			props.page,
			props.page_size,
			props.pagination_size,
			props.method,
			props.url,
			props.queryParams,
			props.columns
		);
		function add() {
			router.push({ name: "assign-add" });
		}
		const talk = (x) => {
			alert(`${x}--->${props.page}`);
		};

		return {
			add,
			talk,
			...toRefs(dbTable),
		};
	},
};
</script>

<style>
table {
	position: relative;
	background-color: white;
}
table thead th {
	background-color: #007bff;
	position: sticky;
	top: 0; /* Don't forget this, required for the stickiness */
}
table tbody tr {
	position: relative;
	z-index: 0;
	top: 1; /* Don't forget this, required for the stickiness */
}
</style>
