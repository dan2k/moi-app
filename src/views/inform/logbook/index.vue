<template>
	<div>
		<div class="col-12 mt-0 pt-0">
			<h3 class="my-0 py-0 text-primary">
				<i class="fas fa-bold"></i> ระบบ LOGBOOK
			</h3>
			<div class="line"></div>
		</div>
		<!-- <router-view></router-view> -->
		<div class="jumbotron mx-2 py-2">
			<div class="container">
				<div class="row my-1">
					<div class="col-md-2 text-left">ระบบงาน:</div>
					<div class="col-md-8 group"> 
						<vue-select
							v-model="app_gid"
							:options="optionGroup"
							label-by="label"
							value-by="id"
							:searchable="true"
							:close-on-select="true"
							:clear-on-close="true"
							:clear-on-select="true"
							placeholder="เลือก"
							search-placeholder="ค้นหา"
							@update:modelValue="getSub1"
						></vue-select>
					</div>
				</div>
				<div class="row my-1">
					<div class="col-md-2 text-left">
						ระบบงานย่อย 1:
					</div>
					<div class="col-md-8 group">
						<vue-select
							v-model="app_sub1_id"
							:options="optionSub1"
							label-by="label"
							value-by="id"
							:searchable="true"
							:close-on-select="true"
							:clear-on-close="true"
							:clear-on-select="true"
							placeholder="เลือก"
							search-placeholder="ค้นหา"
							@update:modelValue="getSub2"
						></vue-select>
					</div>
				</div>
				<div class="row my-1">
					<div class="col-md-2 text-left">
						ระบบงานย่อย 2:
					</div>
					<div class="col-md-8 group">
						<vue-select
							v-model="app_sub2_id"
							:options="optionSub2"
							label-by="label"
							value-by="id"
							:searchable="true"
							:close-on-select="true"
							:clear-on-close="true"
							:clear-on-select="true"
							placeholder="เลือก"
							search-placeholder="ค้นหา"
							@update:modelValue="getSub3"
						></vue-select>
					</div>
				</div>
				<div class="row my-1">
					<div class="col-md-2 text-left">
						ระบบงานย่อย 3:
					</div>
					<div class="col-md-8 group">
						<vue-select
							v-model="app_sub3_id"
							:options="optionSub3"
							label-by="label"
							value-by="id"
							:searchable="true"
							:close-on-select="true"
							:clear-on-close="true"
							:clear-on-select="true"
							placeholder="เลือก"
							search-placeholder="ค้นหา"
							@update:modelValue="getLogBook"
						></vue-select>
					</div>
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
						:vtoolbar="true"
						:vsearch="true"
						:vwidth="'auto'"
						:vheight="'100%'"
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
import { ref, onMounted } from "vue";
import VueNextSelect from "vue-next-select";
import "vue-next-select/dist/index.min.css";
import VTable from "@/components/table/table.vue";
import { api } from "@/helper/api";
export default {
	components: {
		"vue-select": VueNextSelect,
		VTable,
	},
	setup() {
		const app_gid = ref(null);
		const app_sub1_id = ref(null);
		const app_sub2_id = ref(null);
		const app_sub3_id = ref(null);
		const optionGroup = ref([]);
		const optionSub1 = ref([]);
		const optionSub2 = ref([]);
		const optionSub3 = ref([]);

		const getAppGroup = async () => {
			await api.get("/inform/v1/getAppGroup").then((res) => {
				optionGroup.value = res.data.rows;
			});
		};
		const getSub1 = async () => {
			app_sub1_id.value = null;
			app_sub2_id.value = null;
			app_sub3_id.value = null;
			optionSub1.value = [];
			optionSub2.value = [];
			optionSub3.value = [];
			if (app_gid.value != "xxx") {
				await api
					.get(`/inform/v1/getSub1/${app_gid.value}`)
					.then((res) => {
						optionSub1.value = res.data.rows;
					});
			}
			//loadData
			console.log("by groups");
			await getLogBook();
		};

		const getSub2 = async () => {
			app_sub2_id.value = null;
			app_sub3_id.value = null;
			optionSub2.value = [];
			optionSub3.value = [];
			if (app_sub1_id.value != "xxx") {
				await api
					.get(
						`/inform/v1/getSub2/${app_gid.value}/${app_sub1_id.value}`
					)
					.then((res) => {
						optionSub2.value = res.data.rows;
					});
			}
			console.log("by sub1");
			await getLogBook();
		};
		const getSub3 = async () => {
			app_sub3_id.value = null;
			optionSub3.value = [];
			if ((app_sub2_id.value1 = "xxx")) {
				await api
					.get(
						`/inform/v1/getSub3/${app_gid.value}/${app_sub1_id.value}/${app_sub2_id.value}`
					)
					.then((res) => {
						optionSub3.value = res.data.rows;
					});
			}
			await getLogBook();
		};
		const getLogBook = () => {
			let data = {
				app_gid: app_gid.value,
				app_sub1_id: app_sub1_id.value,
				app_sub2_id: app_sub2_id.value,
				app_sub3_id: app_sub3_id.value,
			};
			table.value.setParam(data);
			table.value.changePage(1);
			table.value.getData();
		};
		onMounted(async () => {
			if (
				document
					.getElementById("ainform")
					.getAttribute("aria-expanded") == "false"
			) {
				document.getElementById("ainform").click();
			}
			await getAppGroup();
		});

		const table = ref();
		const url = ref(`/inform/v1/getLogBook`);
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
		const view = (url) => {
			window.open(url);
		};
		return {
			app_gid,
			app_sub1_id,
			app_sub2_id,
			app_sub3_id,
			optionGroup,
			optionSub1,
			optionSub2,
			optionSub3,
			getSub1,
			getSub2,
			getSub3,
			getLogBook,
			url,
			table,
			columns,
			view,
		};
	},
};
</script>

<style>
.vue-select {
	width: auto;
}
</style>
