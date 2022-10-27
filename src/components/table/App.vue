<template>
	<vtable
		ref="table"
		mode="server"
		:url="url"
		:headers="columns"
		:checkRow="false"
		:ceckAll="false"
		:rowNumber="true"
		:vsearch="true"
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
				v-if="actionProps.field == 'job_add_user'"
				class="text-success"
			>
				$ {{ actionProps.row[actionProps.field] }}
			</div>
			<div v-if="actionProps.field == 'action'" class="text-success">
				<button
					class="btn btn-outline-primary btn-sm"
					@click="edit(actionProps.row)"
				>
					edit
				</button>
			</div>
		</template>
	</vtable>
	<div class="text-center">
		<button class="btn btn-outline-primary btn-sm" @click="getSelect">
			<span class="material-icons-outlined"> pan_tool </span>
			getSelect
		</button>
	</div>
	<!-- <div class="alert alert-info"><input type="text" v-model="txtSearch" @input="debounce" /></div> -->
</template>

<script>
import { ref } from "vue";
import Vtable from "@/components/table/table.vue";
import { useStore } from "vuex";
export default {
	name: "App",
	components: {
		Vtable,
	},
	setup() {
		const table = ref();
		const store = useStore();
		const auth = store.getters["auth/getAuthData"].user[0];
		let section = "";
		section = auth.place_type == "R" ? auth.sect_id.substring(1, 2) : "0";
		const url = ref(`/inform/v1/getData/${section}`);
		/* watch(user, (n, o) => {
			table.value.setFilter("job_add_user", "=", user.value);
			table.value.changePage(1);
			table.value.getData();
			// console.log(table.value.filters);
		}); */

		const columns = ref([
			{
				label: "ID",
				name: "job_id",
				sortable: true,
				order: "",
			},
			{
				label: "หน่วยงาน",
				name: "cust_pdesc",
				sortable: true,
				order: "",
			},
			{
				label: "ผู้แจ้ง",
				name: "job_add_user",
				sortable: true,
				order: "",
				formatter: true,
			},
			{
				label: "ระบบงาน",
				name: "app_gdesc",
				sortable: true,
				order: "",
			},
			{
				label: "ระบบงานย่อย 1",
				name: "app_sub1_desc",
				sortable: true,
				order: "",
			},
			{
				label: "ระบบงานย่อย 2",
				name: "app_sub2_desc",
				sortable: true,
				order: "",
			},
			{
				label: "ระบบงานย่อย 3",
				name: "app_sub3_desc",
				sortable: true,
				order: "",
			},

			{
				label: "รายละเอียด",
				name: "job_desc",
				sortable: true,
				order: "",
			},
			{
				label: "วันเวลา",
				name: "job_add_datetime",
				sortable: true,
				order: "",
			},
			{
				label: "#",
				name: "action",
				formatter: true,
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
		const loadSuccess = (row) => {
			console.log("load successed");
			console.log(row);
		};
		// let timeoutRef = null;
		// const debounce = (e) => {
		//   if (timeoutRef !== null) {
		//     clearTimeout(timeoutRef);
		//   }
		//   timeoutRef = setTimeout(() => {
		//     table.value.txtSearch = txtSearch.value;
		//     table.value.getData();
		//     console.log(`send request with keyword '${txtSearch.value}'`);
		//   }, 300);
		// };
		// const txtSearch = ref('');

		return {
			table,
			columns,
			edit,
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

<style>
/*@import url('https://fonts.googleapis.com/css2?family=Kodchasan:wght@300&display=swap');*/
@import url("https://fonts.googleapis.com/css2?family=Sarabun:wght@100&display=swap");
@import url("https://fonts.googleapis.com/icon?family=Material+Icons");
@import url("https://fonts.googleapis.com/css2?family=Material+Icons+Outlined");
h2 {
	color: teal;
}
@media screen and (max-width: 767px) {
	table thead {
		display: none;
	}
	table tr > * {
		display: block;
	}
	table tbody tr > *:first-child {
		/* margin-top: 4%; */
		background-color: #212529;
		color: red;
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
