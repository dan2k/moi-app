<template>
  <div>
    <div class="jumbotron mx-2 py-2">
      <div class="container">
		<form ref="form" @submit.prevent="submit" class="needs-validation" novalidate>
			<div class="row my-1">
				<div class="col-md-3">
					<date-time 
						label="วันที่เริ่มต้น" 
						:v="v.start" 
						:showTime="false" 
						:format="format"
						auto-apply> 
					</date-time>
				</div>
				<div class="col-md-3">
					<date-time 
						label="วันที่สิ้นสุด" 
						:v="v.end" 
						:showTime="false" 
						:format="format" 
						auto-apply> </date-time>
				</div>
				<div class="col-md-3">
					<Text label="รหัสพนักงาน:" :v="v.empid"></Text>
				</div>
				<div class="col-3">
					<br/>
					<button :disabled="v.$error" class="btn btn-primary btn-small" type="submit">ค้นหา</button>
				</div>
			</div>
		</form>
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
            style="font-family: Sarabun, sans-serif; font-size: 14px"
          >
            <template v-slot:action="actionProps">
              <div v-if="actionProps.field == 'action'" class="text-success">
                <button
                  v-if="actionProps.row.job_url"
                  class="btn btn-outline-primary btn-sm"
                  @click="view(actionProps.row.job_url)"
                >
                  <i class="fas fa-book-open"></i>
                </button>
                <button
                  v-if="!actionProps.row.job_url"
                  class="btn btn-outline-primary btn-sm"
                  @click="view(`${baseUrl}inform/logbook/${actionProps.row.job_id}`)"
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

<script setup>
import { ref, onMounted, computed } from "vue";
import VTable from "@/components/table/table.vue";
import DateTime from "@/components/form/DateComponent3.vue";
import Text from "@/components/form/InputComponent.vue";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { errAlert} from "@/helper";
import { useFollowup } from "../followup/followup";

const {padL} = useFollowup();
const baseUrl = import.meta.env.VITE_PRIVATE_BASE_URL;

onMounted(async () => {
  if (document.getElementById("ainform").getAttribute("aria-expanded") == "false") {
    document.getElementById("ainform").click();
  }
});

const table = ref();
const url = ref(`/inform/v1/searchLogBook`);
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
const format = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
let start = ref(new Date());
let end = ref(new Date());
let empid = ref(null);
const rules = computed(function () {
  let tmp = {
    start: {},
    end: {},
    empid: {},
  };
  tmp.start = {
    required: helpers.withMessage("ห้ามเป็นค่าว่าง", required),
  };
  tmp.end = {
    required: helpers.withMessage("ห้ามเป็นค่าว่าง", required),
  };
  tmp.empid = {
    required: helpers.withMessage("ห้ามเป็นค่าว่าง", required),
  };
  return tmp
});
const v = useVuelidate(rules, {
  start,
  end,
  empid,
});


const submit=async ()=>{
	v.value.$touch();
    if (v.value.$error) return;
	//console.log(start.value-end.value)
	if((start.value-end.value)>0){
		await errAlert("วันที่เริ่มต้นต้องไม่มากกว่าวันที่สิ้นสุด")
		return;
	}
	let st = start.value;
    st = `${st.getFullYear()}-${padL(st.getMonth() + 1)}-${padL(st.getDate())} 00:00:00`;
	let ed = end.value;
    ed = `${ed.getFullYear()}-${padL(ed.getMonth() + 1)}-${padL(ed.getDate())} 23:59:59`;
	let data={
		start:st,
		end:ed,
		empid:empid.value,
	}
	table.value.setParam(data);
	table.value.changePage(1);
	table.value.getData();

}
</script>

<style>

</style>
