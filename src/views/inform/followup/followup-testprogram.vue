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
import TextArea from "../../../components/form/TextAreaComponent.vue";
import { ref, onMounted } from "vue";
import { api, errAlert, okAlert } from "@/helper";
import { useRoute, useRouter } from "vue-router";

import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useFollowup } from "./followup";

const {auth}=useFollowup()
const route = useRoute();
const router = useRouter();
const empid = auth.emp_id;
const detail = ref(null);

const rules = {
  detail: { required: helpers.withMessage("ห้ามเป็นค่าว่าง", required) },
};
const v = useVuelidate(rules, { detail });
const submit = async () => {
  v.value.$touch();
  if (v.value.$error) return;

  try {
    let rs = await api.post(`/inform/v2/testProgram`, {
      detail: detail.value,
      empid,
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
  detail.value=null;
  v.value.$reset();
}
onMounted(async () => {});
</script>
