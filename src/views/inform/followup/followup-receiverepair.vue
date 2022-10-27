<template>
  <div class="jumbotron py-2 col-12 col-md-10 mx-auto">
    <div class="container">
      <form @submit.prevent="submit" class="needs-validation" novalidate>
        <div class="form-row">
          <div class="col-12 col-md-10">
            <Radio :inline="false" label="รูปแบบ:" :v="v.choice" :obj="choices"></Radio>
          </div>
        </div>
        <div class="form-row" v-if="choice==1">
          <div class="col-12 col-md-3">
            <Input label="CSV NO:" :v="v.csvno" rows="5"></Input>
          </div>
        </div>

        <div class="form-row">
          <div class="col-12 text-center">
            <button class="btn btn-primary mr-1" type="submit">บันทึก</button>
            <button class="btn btn-secondary mr-1" type="reset" @click="reset">
              ยกเลิก
            </button>
            <button
              class="btn btn-secondary mr-1"
              @click="
                $router.replace({
                  path: `/inform/followup/${$route.params.jobid}/detail`,
                })
              "
            >
              ย้อนกลับ
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<style scoped></style>
<script setup>
import Input from "../../../components/form/InputComponent.vue";
import Radio from "../../../components/form/RadioComponent.vue";
import { ref, onMounted,watch,computed } from "vue";
import { api, errAlert, okAlert } from "@/helper";
import { useRoute, useRouter } from "vue-router";

import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useFollowup } from "./followup";

const {auth}=useFollowup()
const route = useRoute();
const router = useRouter();
const empid = auth.emp_id;
const csvno=ref(null)
const choice=ref(null)
const choices=ref([
  {label:'ไม่บันทึก CSV NO',value:0},
  {label:'บันทึก CSV NO',value:1},
  {label:'บันทึกระบบส่งซ่อมโปรแกรม',value:2},
])

const rules = computed(function () {
  let tmp={
    choice: { required: helpers.withMessage("ห้ามเป็นค่าว่าง", required) },
    csvno: {  },
  }
  if(choice.value==1){
    tmp.csvno={ required: helpers.withMessage("ห้ามเป็นค่าว่าง", required) };
  }
  return tmp
});
watch(choice,(val)=>{
  if(val==2){
    router.replace({path:`/repair/${route.params.jobid}/new`})
  }
})  
const v = useVuelidate(rules, { choice,csvno });
const submit = async () => {
  v.value.$touch();
  if (v.value.$error) return;

  try {
    let rs = await api.post(`/inform/v2/receiverepair`, {
      csvno: csvno.value?csvno.value:'',
      empid,
      flag:choice.value,
      jobid: route.params.jobid,

    });

    okAlert(rs.data.msg, () => {
      router.replace({ path: `/inform/followup/${route.params.jobid}/detail` });
    });
  } catch (err) {
    errAlert(err);
  }
};
const reset=()=>{
  choice.value=null;
  csvno.value=null;
  v.value.$reset();
}
onMounted(async () => {});
</script>
