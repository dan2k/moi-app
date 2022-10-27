<template>
	<div class="jumbotron mx-2">
		<div class="container">
			<div class="form-inline float-left ml-3">
				<label for="status" class="pb-0">สถานะ:&nbsp;</label>
				<select
					class="form-control form-control-sm"
					v-model="filter_status"
					@change="changeStatus($event)"
				>
					<option
						v-for="(s, i) of status"
						:key="i"
						:value="s.id"
					>
						{{ s.text }}
					</option>
				</select>
			</div>
			<div class="form-inline float-left ml-3">
				<label for="emps" class="pb-0">พนักงาน:&nbsp;</label>
				<select
					name="emps"
					id="emps"
					class="form-control form-control-sm"
					v-model="filter_emp"
					@change="changeEmp($event)"
				>
					<option v-for="(e, i) of emps" :key="i" :value="e.id">
						{{ e.text }}
					</option>
				</select>
			</div>

			<button
				class="btn btn-primary btn-sm mr-3 float-right"
				@click="add()"
			>
				+ เพิ่ม
			</button>
			<db-table
				ref="table"
				url="/assign/v1/all"
				:columns="columns"
				@on-row-click="onRowClick"
				height="480px"
			>
				<template v-slot:action="props">
					<div class="form-group">
						<button
							class="btn btn-warning btn-sm mr-1"
							@click="
								edit(
									props.row,
									props.index,
									props.field
								)
							"
						>
							<i
								v-if="props.row.status < 3"
								class="fas fa-edit"
							></i>
							<i v-else class="far fa-list-alt"></i>
						</button>
						<button
							v-if="
								props.row.status < 3 &&
								props.row.emp_id == emp_id
							"
							class="btn btn-danger btn-sm"
							@click="del(props.row)"
						>
							<i class="fas fa-trash-alt"></i>
						</button>
					</div>
				</template>
			</db-table>
		</div>
	</div>
</template>

<script>
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import DbTable from "./table.vue";
import { api } from "@/helper/api";
import Swal from "sweetalert2";
import { useStore } from "vuex";

export default {
	components: { DbTable },
	setup() {
		const router = useRouter();
		const table = ref();
		let status = ref([]);
		let emps = ref([]);
		let filter_status = ref(0);
		let filter_emp = ref(0);
		const store = useStore();
		const level = ref(
			store.getters["auth/getAuthData"].user[0].level || null
		);
		const emp_id = ref(
			store.getters["auth/getAuthData"].user[0].emp_id || null
		);
		const columns = ref([
			{
				label: "NO",
				name: "job_id",
				width: "8%",
				hclassName: "text-center",
				// hstyle: {},
				// style: {},
				className: "text-center",
				sortable: true,
				order: "",
			},
			{
				label: "หัวข้อ",
				name: "title",
			},
			/* {
				label: "รายละเอียด",
				name: "detail",
			}, */
			{
				label: "กำหนดเสร็จ",
				name: "end_date2",
				width: "12%",
			},
			{
				label: "ผู้รับผิดชอบ",
				name: "thiname",
				width: "15%",
			},
			{
				label: "วันที่แล้วเสร็จ",
				name: "solve_date2",
				width: "12%",
			},
			{
				label: "สถานะ",
				name: "status_desc",
				width: "12%",
			},
			{
				label: "#",
				name: "action",
				width: "13%",
				hclassName: "text-center",
				className: "text-center",
				/* formatter: (i, v, row) => {
					return [
						{
							type: "button",
							class: "btn btn-info btn-sm mr-1 mb-1",
							text: "แก้ไข",
							event: "click",
							func: () => {
								edit(row);
							},
							// disabled: row.emp_solve != emp_id.value,
						},
						{
							type: "button",
							class: "btn btn-danger btn-sm mr-1 mb-1",
							text: "ลบ",
							event: "click",
							func: () => {
								del(row);
							},
							disabled: row.emp_solve != emp_id.value,
						},
					];
				}, */
				formatter: true,
			},
		]);
		onMounted(async () => {
			try {
				const res = await api.get("/assign/v1/status");
				if (res && res.data) {
					if (res.data.status) {
						status.value = res.data.data;
						status.value.unshift({
							id: "",
							text: "-- ทั้งหมด --",
						});
						filter_status.value = "";
					} else {
						Swal.fire({
							icon: "error",
							title: '<span style="color:red">แจ้งข้อผิดพลาด</span>',
							text: res.data.error,
						});
						//return;
					}
				}
			} catch (err) {
				console.log(err);
			}
			try {
				const res2 = await api.get("/assign/v1/emps");
				if (res2 && res2.data) {
					if (res2.data.status) {
						emps.value = res2.data.data;
						emps.value.unshift({
							id: "",
							text: "-- ทั้งหมด --",
						});
						filter_emp.value = "";
					} else {
						Swal.fire({
							icon: "error",
							title: '<span style="color:red">แจ้งข้อผิดพลาด</span>',
							text: res2.data.error,
						});
						//return;
					}
				}
			} catch (err) {
				console.log(err);
			}
		});
		function onRowClick(e, index, row) {
			//console.log($e);
			// console.log("row=", row);
			// console.log("index=" + index);
			// console.log(import.meta.env.VITE_PRIVATE_TOKEN_KEY);
		}
		function add() {
			router.push({ name: "assign-add" });
		}
		const edit = (row, index, field) => {
			// console.log(`index=${index}---field=${field}`);
			router.push({
				name: "assign-edit",
				params: { id: row.job_id },
			});
		};
		const del = async (row) => {
			let result = await Swal.fire({
				title: "<span style='color:red'>แจ้งเตือน</span>",
				text: "คุณต้องการลบข้อมูลหรือไม่",
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: "#3085d6",
				cancelButtonColor: "#d33",
				confirmButtonText: "ใช่",
				cancelButtonText: "ไม่ใช่",
			});
			if (!result.isConfirmed) return;

			try {
				let res = await api.delete("/assign/v1/del/2");
				if (res && res.data) {
					if (res.data.status) {
						table.value.changePage();
					} else {
						Swal.fire({
							icon: "error",
							title: '<span style="color:red">แจ้งข้อผิดพลาด</span>',
							text: res.data.error,
						});
						//return;
					}
				}
			} catch (err) {
				console.log(err);
			}
		};
		const changeStatus = ($e) => {
			let v = $e.target.value;
			table.value.setParams("status", v);
			table.value.setPage(1);
			table.value.changePage();
			// console.log("p_queryParams=>", table.value.p_queryParams);
		};
		const changeEmp = ($e) => {
			let v = $e.target.value;
			table.value.setParams("empid", v);
			table.value.setPage(1);
			table.value.changePage();
			// console.log("p_queryParams=>", table.value.p_queryParams);
		};
		return {
			add,
			columns,
			table,
			onRowClick,
			edit,
			del,
			status,
			emps,
			filter_status,
			filter_emp,
			changeStatus,
			changeEmp,
			level,
			emp_id,
		};
	},
};
</script>

<style></style>
