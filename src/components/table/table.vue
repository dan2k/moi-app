<template>
	<div class="table-responsive px-2" v-bind="$attrs" :style="objWrapper">
		<slot name="toolbar" v-if="vtoolbar">
			<div class="px-2 pb-0">
				<div class="row justify-content-between">
					<div class="col"></div>
					<div class="col pr-2">
						<div class="row justify-content-end">
							<div class="col" v-if="vsearch">
								<input
									type="text"
									v-model="txtSearch"
									@input="debounce"
									class="
										form-control form-control-sm
									"
									placeholder="search"
								/>
							</div>
							<div
								class="col align-self-end"
								v-if="vrefresh"
							>
								<button
									class="
										btn btn-outline-primary btn-sm
									"
									@click="getData()"
								>
									<i class="fas fa-sync-alt"></i>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</slot>

		<table class="table table-bordered table-hover" :style="objStyle">
			<slot
				name="header"
				:headers="headers"
				:checkAll="checkAll"
				:checkRow="checkRow"
				:rowNumber="rowNumber"
				:isAll="isAll"
			>
				<thead class="thead-dark">
					<tr>
						<th
							class="text-center"
							v-if="checkAll && checkRow"
						>
							<input
								type="checkbox"
								@click="selectAll"
								:checked="isAll"
							/>
						</th>
						<th v-if="rowNumber" width="60px">ลำดับที่</th>
						<th
							v-for="(it, k) of headers"
							:key="Number(k)"
							:width="it.width"
							:align="it.halign"
							:valign="it.hvalign"
						>
							<div
								v-if="it.sortable"
								@click="sort(it)"
								style="cursor: pointer"
							>
								{{ it.label }}
								<div class="float-right">
									<span
										v-if="it.order == 'asc'"
										class="
											material-icons-outlined
										"
									>
										arrow_drop_down
									</span>
									<span
										v-if="it.order == 'desc'"
										class="
											material-icons-outlined
										"
									>
										arrow_drop_up
									</span>
								</div>
							</div>
							<div v-else>
								{{ it.label }}
							</div>
						</th>
					</tr>
				</thead>
			</slot>
			<tbody v-if="isLoading">
				<tr>
					<th
						:colspan="headers.length + rowNumber + checkRow"
						class="bg-light text-center text-warning"
					>
						กำลังประมวลผลข้อมูล.....
					</th>
				</tr>
			</tbody>
			<tbody v-if="rows.length < 1">
				<tr>
					<th
						:colspan="headers.length + rowNumber + checkRow"
						class="bg-light text-center text-danger"
					>
						ไม่มีข้อมูล
					</th>
				</tr>
			</tbody>
			<tbody class="bg-light" v-if="rows.length > 0">
				<tr
					v-for="(r, i) in rows"
					:key="i"
					@click="clickRow($event, r, i)"
					:class="{ 'table-secondary': r.state }"
				>
					<td
						data-label="state"
						v-if="checkRow"
						class="text-center"
					>
						<input
							type="checkbox"
							:checked="r.state"
							@click="select(r, i)"
						/>
					</td>
					<td data-label="ลำดับที่" v-if="rowNumber">
						{{ (page - 1) * size + (i + 1) }}
					</td>
					<td
						v-for="(it, k) of headers"
						:key="Number(k)"
						:data-label="it.label"
					>
						<slot
							v-if="it.formatter"
							name="action"
							:row="r"
							:index="i"
							:field="it.name"
							>{{ r[it.name] }}</slot
						>
						<div v-else>{{ r[it.name] }}</div>
					</td>
				</tr>
			</tbody>
		</table>
		<div v-if="totalRows > 0" class="row justify-content-between px-2">
			<div class="col-5">
				<div class="align-middle float-left">
					Showing {{ (page - 1) * size + 1 }} to
					{{ page * size > totalRows ? totalRows : page * size }}
					of {{ totalRows }} rows
				</div>
				<div class="float-right pl-2">
					<div class="row">
						<div class="float-right">
							<select
								class="form-control form-control-sm"
								v-model="size"
							>
								<option
									v-for="(r, i) of rowsList"
									:key="i"
									:value="Number(r)"
								>
									{{ r }}
								</option>
							</select>
						</div>
						<div class="align-baseline float-right pl-2">
							rows per page
						</div>
					</div>
				</div>
			</div>
			<div class="col-4">
				<nav aria-label="Page navigation example">
					<ul class="pagination pagination-sm float-right">
						<li
							class="page-item"
							:class="{ disabled: page == 1 }"
						>
							<button
								class="page-link"
								href="#"
								:disabled="page == 1"
								@click="changePage(page - 1)"
							>
								&lt;
							</button>
						</li>
						<li
							class="page-item"
							:class="{ active: 1 == page }"
							@click="changePage(1)"
						>
							<a class="page-link" href="#">1</a>
						</li>
						<li
							v-if="page != 1 && page > paginationSize + 1"
							class="page-item"
						>
							<a class="page-link" href="#">...</a>
						</li>
						<li
							v-for="p in paginationArray"
							:key="p"
							class="page-item"
							:class="{ active: p == page }"
							@click="changePage(p)"
						>
							<a class="page-link" href="#">{{ p }}</a>
						</li>

						<li
							v-if="
								page != totalPages &&
								currentPagination != totalPaginations
							"
							class="page-item"
						>
							<a class="page-link" href="#">...</a>
						</li>
						<li
							v-if="totalPages != 1 && paginationArray[paginationSize-1]!=totalPages"
							class="page-item"
							:class="{ active: page == totalPages }"
							@click="changePage(totalPages)"
						>
							<a class="page-link" href="#">{{
								totalPages
							}}</a>
						</li>
						<li
							class="page-item"
							:class="{ disabled: page == totalPages }"
						>
							<button
								class="page-link"
								href="#"
								:disabled="page == totalPages"
								@click="changePage(page + 1)"
							>
								&gt;
							</button>
						</li>
					</ul>
				</nav>
			</div>
		</div>
	</div>
</template>

<script>
import { useTable } from "@/components/table/table.js";
import { onMounted, watch } from "vue";
export default {
	props: {
		data: {
			type: Array,
			default: [],
		},
		url: {
			type: String,
			default: "",
		},
		mode: {
			type: String,
			default: "server",
		},
		activePage: {
			type: Number,
			default: 1,
		},
		rowsSize: {
			type: Number,
			default: 5,
		},
		headers: {
			type: Array,
			required: true,
		},
		rowNumber: {
			type: Boolean,
			default: true,
		},
		checkAll: {
			type: Boolean,
			default: true,
		},
		checkRow: {
			type: Boolean,
			default: true,
		},
		vtoolbar: {
			type: Boolean,
			default: true,
		},
		vsearch: {
			type: Boolean,
			default: true,
		},
		vrefresh: {
			type: Boolean,
			default: false,
		},
		widthPagination: {
			type: Number,
			default: 3,
		},
		rowsList: {
			type: Array,
			default: [5, 10, 20, 30, 50],
		},
		vwidth: {
			type: String,
			default: "100%",
		},
		vheight: {
			type: String,
			default: "450px",
		},
	},

	setup(props, { emit }) {
		const {
			rows,
			headers,
			page,
			size,
			totalPages,
			totalRows,
			paginationSize,
			paginationArray,
			currentPagination,
			totalPaginations,
			isAll,
			filters,
			sort,
			getData,
			setFilter,
			getFilter,
			setParam,
			selectAll,
			select,
			getSelect,
			clickRow,
			changePage,
			search,
			txtSearch,
			isLoading,
		} = useTable(props, emit);

		onMounted(async () => {
			await getData();
		});
		watch(page, async (n, o) => {
			await getData();
		});
		watch(size, async (n, o) => {
			if (page.value == 1) {
				await getData();
			} else {
				page.value = 1;
			}
		});
		let timeoutRef = null;
		const debounce = (e) => {
			if (timeoutRef !== null) {
				clearTimeout(timeoutRef);
			}
			timeoutRef = setTimeout(() => {
				// table.value.txtSearch = txtSearch.value;
				getData();
				console.log(
					`send request with keyword '${txtSearch.value}'`
				);
			}, 300);
		};
		const objStyle = {
			width: props.vwidth == "auto" ? "none" : props.vwidth,
		};
		const objWrapper = {
			height: props.vheight,
		};
		return {
			rows,
			headers,
			page,
			size,
			totalPages,
			totalRows,
			paginationSize,
			paginationArray,
			currentPagination,
			totalPaginations,
			isAll,
			filters,
			setFilter,
			getFilter,
			setParam,
			getData,
			sort,
			selectAll,
			select,
			getSelect,
			clickRow,
			changePage,
			search,
			txtSearch,
			debounce,
			objStyle,
			objWrapper,
			isLoading,
		};
	},
};
</script>

<style scoped>
table {
	color: gray;
	font-weight: bold;
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
