<template>
  <div class="jumbotron py-2 col-12 col-md-10 mx-auto">
    <div class="container">
      <form @submit.prevent="submit" class="needs-validation" novalidate>
        <div class="form-row">
          <div class="col-12 col-md-10">
            <text-area label="รายละเอียด:" :v="v.detail" rows="5"></text-area>
          </div>
        </div>
        <div class="form-row">
          <div class="col-12 col-md-10">
            <date-time label="วันเวลาปิดงาน" :v="v.datetime"> </date-time>
          </div>
        </div>
        <div class="form-row">
          <div class="col-12 col-md-10">
            <v-select
              label="หมายเหตุ:"
              :v="v.remark"
              :obj="remarks"
              style="width: 100%"
            ></v-select>
          </div>
        </div>
        <div class="form-row">
          <div class="col-12 text-center">
            <button class="btn btn-primary mr-1" type="submit">ปิดงาน</button>
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
import TextArea from "../../../components/form/TextAreaComponent.vue";
import VSelect from "../../../components/form/SelectComponent2.vue";
import DateTime from "../../../components/form/DateComponent3.vue";
import { ref, onMounted } from "vue";
import { api, errAlert, okAlert } from "@/helper";
import { useRoute, useRouter } from "vue-router";

import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useFollowup} from "./followup"

const {padL,getRemark,auth} = useFollowup()
const route = useRoute();
const router = useRouter();
const sectid = auth.place_type == "R" ? auth.sect_id.substring(1, 2) : "0";
const empid = auth.emp_id;
const detail = ref(null);
const datetime = ref(new Date());
const remark = ref(null);
const remarks = ref([]);
const rules = {
  detail: { required: helpers.withMessage("ห้ามเป็นค่าว่าง", required) },
  datetime: { required: helpers.withMessage("ห้ามเป็นค่าว่าง", required) },
  remark: { required: helpers.withMessage("ห้ามเป็นค่าว่าง", required) },
};
const v = useVuelidate(rules, { detail, datetime, remark });
const reset = () => {
  detail.value = null;
  v.value.$reset();
};

const submit = async () => {
  v.value.$touch();
  if (v.value.$error) return;
  let dt = datetime.value;
  dt = `${dt.getFullYear()}-${padL(dt.getMonth() + 1)}-${padL(dt.getDate())} ${padL(
    dt.getHours()
  )}:${padL(dt.getMinutes())}:${padL(dt.getSeconds())}`;
  try {
    let rs = await api.post(`/inform/v2/closeJob`, {
      detail: detail.value,
      datetime: dt,
      empid,
      sectid,
      jobid: route.params.jobid,
      remark:remark.value,
    });
    okAlert(rs.data.msg, () => {
      router.replace({ path: `/inform/followup` });
    });
  } catch (err) {
    errAlert(err);
  }
};
onMounted(async () => {
  remarks.value =await getRemark();
});
</script>
