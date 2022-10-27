<template>
	<div>
		<div class="col-12 mt-0 pt-0">
			<h3 class="my-0 py-0 text-primary">
				<i class="fas fa-circle-notch"></i> ระบบ งานค้าง
			</h3>
			<div class="line"></div>
		</div>
		<!-- <router-view></router-view> -->
		<div class="jumbotron mx-2 py-2">
			<div class="container">
				<div
					class="row justify-content-center"
					style="font-size: 12px"
				>
					<div
						class="card mr-1 mb-1"
						style="width: 180px; cursor: pointer"
						v-for="(s, i) in state.status"
						:key="i"
						:class="{
							'bg-warning': s.state,
						}"
						@click="setActive(s.status)"
					>
						<div class="card-body">
							<span
								style="position: absolute; top: 5px"
								class="card-title"
								:style="{ color: s.color }"
								><i class="fas fa-circle-notch"></i
								>&nbsp; {{ s.title }}</span
							>
							<br />

							<span
								class="
									card-subtitle
									text-muted
									float-left
								"
								style="
									font-size: 24px;
									position: absolute;
									bottom: 2px;
								"
							>
								<b :style="{ color: s.color }">{{
									s.count
								}}</b
								>&nbsp;
								<span style="font-size: 16px"
									>รายการ</span
								>
							</span>
						</div>
					</div>
					<button
						class="btn btn-primary mx-2 my-2 float-right"
						@click="table.changePage(1);table.getData()"
					>
						<i class="fas fa-sync-alt"></i>
					</button>
				</div>
				<div>
					<v-table
						ref="table"
						mode="server"
						:url="url"
						:headers="columns"
						:checkRow="false"
						:ceckAll="false"
						:rowNumber="true"
						:vtoolbar="false"
						:vwidth="'auto'"
						:vheight="'100%'"
						@on-get-select="getSelect2"
						@on-click-row="clickRow"
						@on-select-all="selectAll"
						@on-un-select-all="unSelectAll"
						@on-select="select"
						@on-un-select="unSelect"
						@on-load-success="loadSuccess"
						style="
							font-family: 'Sarabun', sans-serif;
							font-size: 14px;
						"
					>
						<template v-slot:action="actionProps">
							<div
								v-if="actionProps.field == 'action'"
								class="text-success"
							>
								<button
									class="
										btn btn-outline-primary btn-sm
									"
									@click="
										view(actionProps.row.job_url)
									"
								>
									<i class="fas fa-book-open"></i>
								</button>
							</div>
						</template>
					</v-table>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { reactive, onMounted, ref } from "vue";
import VTable from "@/components/table/table.vue";
import { useStore } from "vuex";
import { api } from "@/helper/api";
export default {
	components: {
		VTable,
	},
	setup() {
		const state = reactive({
			status: [
				{
					id: 0,
					title: "ทั้งหมด",
					color: "black",
					state: true,
					count: 0,
					status: -1,
				},
				{
					id: 1,
					title: "งานใหม่",
					color: "blue",
					state: false,
					count: 0,
					status: 0,
				},
				// { id: 1, title: "ดำเนินการเรียบร้อยแล้ว" },
				{
					id: 2,
					title: "กำลังแก้ไขโปรแกรม",
					color: "#8f4f00",
					state: false,
					count: 0,
					status: 2,
				},
				{
					id: 3,
					title: "รอตรวจสอบ",
					color: "#ff0000",
					state: false,
					count: 0,
					status: 3,
				},
				{
					id: 4,
					title: "ส่งกลับเพื่อตรวจสอบ",
					color: "#5900b3",
					state: false,
					count: 0,
					status: 4,
				},
				{
					id: 5,
					title: "ปรึกษาส่วนกลาง",
					color: "#fccfe7",
					state: false,
					count: 0,
					status: 5,
				},
				{
					id: 6,
					title: "รอสรุปการแก้ไขโปรแกรม",
					color: "#fccff7",
					state: false,
					count: 0,
					status: 6,
				},
			],
			data: [],
		});
		onMounted(() => {
			// เอาไว้โชว์เมนูรับแจ้งเข้าเข้าเงื่อนไข
			if (
				document
					.getElementById("ainform")
					.getAttribute("aria-expanded") == "false"
			) {
				document.getElementById("ainform").click();
			}
		});
		const setActive = (status) => {
			state.status.map((it, i) => {
				it.state = it.status == status;
				return it;
			});
			table.value.setFilter("job_status", "=", status);
			table.value.changePage(1);
			table.value.getData();
		};

		const table = ref();
		const store = useStore();
		const auth = store.getters["auth/getAuthData"].user[0];
		let section = "";
		section = auth.place_type == "R" ? auth.sect_id.substring(1, 2) : "0";
		const url = ref(`/inform/v1/getData/${section}`);
		const columns = ref([
			{
				label: "ID",
				name: "job_id",
				sortable: true,
				order: "",
				balign: "center",
				halign: "center",
				bvalign: "left",
				hvalign: "middle",
				width: "20px",
			},
			{
				label: "หน่วยงาน",
				name: "cust_pdesc",
				sortable: true,
				order: "",
				balign: "center",
				halign: "center",
				bvalign: "left",
				hvalign: "middle",
				width: "120px",
			},
			{
				label: "ผู้แจ้ง",
				name: "job_add_user",
				sortable: true,
				order: "",
				formatter: true,
				balign: "center",
				halign: "center",
				bvalign: "left",
				hvalign: "middle",
				width: "120px",
			},
			{
				label: "ระบบงาน",
				name: "app_gdesc",
				sortable: true,
				order: "",
				balign: "center",
				halign: "center",
				bvalign: "left",
				hvalign: "middle",
				width: "120px",
			},
			{
				label: "ระบบงานย่อย 1",
				name: "app_sub1_desc",
				sortable: true,
				order: "",
				balign: "center",
				halign: "center",
				bvalign: "left",
				hvalign: "middle",
				width: "120px",
			},
			{
				label: "ระบบงานย่อย 2",
				name: "app_sub2_desc",
				sortable: true,
				order: "",
				balign: "center",
				halign: "center",
				bvalign: "left",
				hvalign: "middle",
				width: "120px",
			},
			{
				label: "ระบบงานย่อย 3",
				name: "app_sub3_desc",
				sortable: true,
				order: "",
				balign: "center",
				halign: "center",
				bvalign: "left",
				hvalign: "middle",
				width: "125px",
			},

			{
				label: "รายละเอียด",
				name: "job_desc",
				sortable: true,
				order: "",
				balign: "center",
				halign: "center",
				bvalign: "left",
				hvalign: "middle",
				width: "150px",
			},
			{
				label: "วันเวลา",
				name: "job_add_datetime",
				sortable: true,
				order: "",
				balign: "center",
				halign: "center",
				bvalign: "left",
				hvalign: "middle",
				width: "120px",
			},
			{
				label: "#",
				name: "action",
				formatter: true,
				balign: "center",
				halign: "center",
				bvalign: "left",
				hvalign: "middle",
				width: "100px",
			},
		]);

		const edit = (r) => {
			alert(JSON.stringify(r));
		};
		const getSelect = () => {
			console.log(table.value.getSelect());
		};
		const getSelect2 = (a) => {
			console.log(a);
			console.log("getSelect");
			// console.log(a);
		};
		const clickRow = ({ row, i }) => {
			// console.log(table.value.rows);
			console.log("clickRow");
		};
		const selectAll = () => {
			console.log("selectAll");
		};
		const unSelectAll = () => {
			console.log("unSelectAll");
		};
		const select = ({ row, i }) => {
			console.log("Select");
		};
		const unSelect = ({ row, i }) => {
			console.log("unSelect");
		};
		const loadSuccess = async (data) => {
			console.log("load successed");
			// console.log(data);

			await api
				.post(`/inform/v1/getDataAll/${section}`, {
					filters: table.value.getFilter(),
				})
				.then((res) => {
					console.log(res.data.rows);
					state.status[0].count = res.data.rows.reduce(
						(p, it) => Number(p) + 1,
						0
					);
					state.status[1].count = res.data.rows.reduce(
						(p, it) =>
							it.job_status == "0"
								? Number(p) + 1
								: Number(p),
						0
					);
					state.status[2].count = res.data.rows.reduce(
						(p, it) =>
							it.job_status == "2"
								? Number(p) + 1
								: Number(p),
						0
					);
					state.status[3].count = res.data.rows.reduce(
						(p, it) =>
							it.job_status == "3"
								? Number(p) + 1
								: Number(p),
						0
					);
					state.status[4].count = res.data.rows.reduce(
						(p, it) =>
							it.job_status == "4"
								? Number(p) + 1
								: Number(p),
						0
					);
					state.status[5].count = res.data.rows.reduce(
						(p, it) =>
							it.job_status == "5"
								? Number(p) + 1
								: Number(p),
						0
					);
					state.status[6].count = res.data.rows.reduce(
						(p, it) =>
							it.job_status == "6"
								? Number(p) + 1
								: Number(p),
						0
					);
				});
		};
		const view = (url) => {
			window.open(url);
		};

		return {
			state,
			setActive,
			table,
			columns,
			edit,
			view,
			getSelect,
			getSelect2,
			clickRow,
			selectAll,
			unSelectAll,
			select,
			unSelect,
			loadSuccess,
			url,
		};
	},
};
</script>

<style scoped>
.card:hover {
	background-color: lightgrey;
}
</style>
