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
          <div class="col-12">
            <Upload :size="300" :fileTypes="['image/*']" ref="uf">
              <template #header="{ addImage }">
                <label for="" class="form-label"
                  >รูปภาพ<span style="color: lightgray; font-size: 10px"
                    >(ขนาดไม่เกิน 300 kb)</span
                  >
                  <span class="text-primary" @click="addImage()" style="cursor: pointer"
                    ><i class="fas fa-camera"></i></span
                ></label>
              </template>
            </Upload>
          </div>
        </div>
        <div class="form-row">
          <div class="col-12 text-center">
            <button class="btn btn-primary mr-1" type="submit">บันทึก</button>
            <button class="btn btn-secondary mr-1" type="reset" @click="reset">ยกเลิก</button>
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
import { api, errAlert,okAlert } from "@/helper";
import { useRoute,useRouter } from "vue-router";
import { useUpload } from "@/plugins/fileupload";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useFollowup } from "./followup";

const {auth}=useFollowup()
const route = useRoute();
const router=useRouter();
const empid = auth.emp_id;
const { files } = useUpload();
const detail = ref(null);
const rules = {
  detail: { required: helpers.withMessage("ห้ามเป็นค่าว่าง", required) },
};
const v = useVuelidate(rules, { detail });
const submit =async () => {
  v.value.$touch();
  if (v.value.$error) return;
  const formData = new FormData();

  //clear null objects
  files.value = files.value.filter((ob, i) => ob.url);
  for (let i = 0; i < files.value.length; i++) {
    formData.append("file_" + i, files.value[i].obj.files[0]);
  }
  // formData.append("jobid", job.value.job_id);
  formData.append("detail", detail.value);
  formData.append("empid", empid);
  formData.append("jobid", route.params.jobid);
  try {
    let rs = await api.post(`/inform/v2/sendback`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
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
  files.value.length = 0;
  v.value.$reset();
}
onMounted(async () => {});
</script>
