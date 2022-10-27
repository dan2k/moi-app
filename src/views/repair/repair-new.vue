<template>
  <div class="jumbotron py-2 col-12 col-md-10 mx-auto">
    <div class="card">
      <div class="card-body">
        <form @submit.prevent="submit" class="needs-validation" novalidate>
          <div class="form-row">
            <div class="col-12 col-md-6">
              <span class="title">หมายเลขปัญหา:</span
              ><span class="detail">{{ job.job_id }}</span>
            </div>
            <div class="col-12 col-md-6">
              <span class="title">ระบบงาน:</span
              ><span class="detail">{{ `${job.group_desc}` }}</span>
            </div>
          </div>
          <div class="form-row">
            <div class="col-12 col-md-6">
              <span class="title">โปรแกรม:</span
              ><span class="detail">{{ job.sub1_desc }}</span>
            </div>
            <div class="col-12 col-md-6">
              <span class="title">เมนูการทำงาน:</span
              ><span class="detail">{{ `${job.sub2_desc}` }}</span>
            </div>
          </div>
          <div class="form-row">
            <div class="col-12 col-md-10">
              <span class="title">หน่วยงาน:</span
              ><span class="detail">{{ job.cust_pdesc }}</span>
            </div>
          </div>
          <div class="form-row">
            <div class="col-12 col-md-12">
              <span class="title">รายละเอียด:</span
              ><span class="detail">{{ job.job_desc }}</span>
            </div>
          </div>
          <div class="form-row">
            <div class="col-12 col-md-8">
              <TextArea label="บันทึกเพิ่มเติม:" rows="5" :v="v.detail"></TextArea>
            </div>
          </div>
          <div class="form-row">
            <div class="col-12 col-md-3">
              <Text label="ผู้รับซ่อมโปรแกรม:" :v="v.username"></Text>
            </div>
          </div>
          <div class="form-row">
            <div class="col-12 text-center">
              <button type="submit" class="btn btn-primary my-1 mx-1">บันทึก</button>
              <button type="reset" class="btn btn-secondary my-1 mx-1" @click="reset">ยกเลิก</button>
              <button
                @click="
                  $router.replace({
                    path: `/inform/followup/${route.params.jobid}/detail`,
                  })
                "
                class="btn btn-secondary my-1 mx-1"
              >
                ย้อนกลับ
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<style scoped>
.title {
  font-weight: bolder;
}
.detail {
  text-indent: 5px;
  color: rgb(14, 143, 143);
}
.detail::before {
  content: "  ";
}
</style>
<script setup>
import { ref, onMounted } from "vue";
import { api, errAlert, okAlert } from "@/helper";
import { useRoute,useRouter } from "vue-router";
import { useStore } from "vuex";
import TextArea from "@/components/form/TextAreaComponent.vue";
import Text from "@/components/form/InputComponent.vue";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import {useFollowup} from "../inform/followup/followup"

const {getJobDetail}=useFollowup()
const store = useStore();
const route = useRoute();
const router = useRouter();
const auth = store.getters["auth/getAuthData"].user[0];
const sectid = auth.place_type == "R" ? auth.sect_id.substring(1, 2) : "0";
const empid = auth.emp_id;
const placetype = auth.place_type;
const job = ref({});
const detail = ref(null);
const username = ref(null);
const rules = {
  detail: { required: helpers.withMessage("ห้ามเป็นค่าว่าง", required) },
  username: { required: helpers.withMessage("ห้ามเป็นค่าว่าง", required) },
};
const v = useVuelidate(rules, {
  detail,
  username,
});


const submit = async () => {
  v.value.$touch();
  if (v.value.$error) return;

  try {
    let rs = await api.post(`/inform/v2/repairNew`, {
      problem_detail: job.value.job_desc,
      problem_detail2: detail.value,
      send_emp:empid,
      repair_emp:username.value,
      app_gid:job.value.app_gid,
      app_sub1_id:job.value.app_sub1_id,
      app_sub2_id:job.value.app_sub2_id
    });
    let csvno=rs.data.docno;
    let rs2 = await api.post(`/inform/v2/receiverepair`, {
      csvno: csvno,
      empid,
      flag:2,
      jobid: route.params.jobid,

    });
    okAlert(rs2.data.msg, () => {
      router.replace({ path: `/inform/followup/${route.params.jobid}/detail` });
    });
  } catch (err) {
    errAlert(err);
  }
};
const reset=()=>{
    detail.value=null;
    username.value=null;
    v.value.$reset()
}
onMounted(async () => {
  job.value =await getJobDetail(route.params.jobid);
});
</script>
