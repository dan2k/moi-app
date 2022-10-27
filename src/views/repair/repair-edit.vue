<template>
  <div class="jumbotron py-2 col-12 col-md-10 mx-auto">
    <div class="card">
      <div class="card-body">
        <form @submit.prevent="submit" class="needs-validation" novalidate>
          <div class="form-row">
            <div class="col-12 col-md-6">
              <span class="title">หมายเลขใบรับซ่อม:</span
              ><span class="detail">{{ repair.doc_no }}</span>
            </div>
            <div class="col-12 col-md-6">
              <span class="title">วันที่ส่งซ่อม:</span
              ><span class="detail">{{ `${repair.send_datetime}` }}</span>
            </div>
          </div>
          <div class="form-row">
            <div class="col-12 col-md-6">
              <span class="title">ระบบงาน:</span
              ><span class="detail">{{ `${repair.app_gdesc}` }}</span>
            </div>
            <div class="col-12 col-md-6">
              <span class="title">โปรแกรม:</span
              ><span class="detail">{{ repair.app_sub1_desc }}</span>
            </div>
          </div>
          <div class="form-row">
            <div class="col-12 col-md-6">
              <span class="title">เมนูการทำงาน:</span
              ><span class="detail">{{ `${repair.app_sub2_desc}` }}</span>
            </div>
          </div>
          <div class="form-row">
            <div class="col-12 col-md-12">
              <span class="title">รายละเอียด:</span
              ><span class="detail">{{ repair.problem_detail }}</span>
            </div>
          </div>
          <div class="form-row">
            <div class="col-12 col-md-12">
              <span class="title">บันทึกเพิ่มเติม:</span
              ><span class="detail">{{ repair.problem_detail2 }}</span>
            </div>
          </div>
          <div class="form-row">
            <div class="col-12 col-md-8">
              <TextArea
                label="รายละเอียดการแก้ไขโปรแกรม:"
                rows="5"
                :v="v.detail"
              ></TextArea>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <span class="title">สถานะ:</span
            ><span class="detail">{{ repair.rp_status_desc }}</span>
          </div>
          <div class="form-row">
            <div class="col-12 col-md-6">
              <date-time label="วันเวลาซ่อมเสร็จ" :v="v.repairdate"> </date-time>
            </div>
            <div class="col-12 col-md-6">
              <date-time label="วันเวลาส่งลงติดตั้ง" :v="v.installdate"> </date-time>
            </div>
          </div>
          <div class="form-row" >
            <div class="col-12 text-center">
              <button v-if="sectid==='0'" type="submit" class="btn btn-primary my-1 mx-1">บันทึก</button>
              <button v-if="sectid==='0'" type="button" class="btn btn-secondary my-1 mx-1" @click="reset">
                ยกเลิก
              </button>
              <button
                type="button"
                @click="
                  $router.replace({
                    path: `/repair`,
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
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import TextArea from "@/components/form/TextAreaComponent.vue";
import DateTime from "@/components/form/DateComponent3.vue";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useFollowup } from "../inform/followup/followup";

const { padL } = useFollowup();
const store = useStore();
const route = useRoute();
const router = useRouter();
const auth = store.getters["auth/getAuthData"].user[0];
const sectid = auth.place_type == "R" ? auth.sect_id.substring(1, 2) : "0";
const empid = auth.emp_id;
const placetype = auth.place_type;
const repair = ref({});
const detail = ref(null);
const repairdate = ref(new Date());
const installdate = ref(new Date());
const rules = {
  detail: { required: helpers.withMessage("ห้ามเป็นค่าว่าง", required) },
  repairdate: { required: helpers.withMessage("ห้ามเป็นค่าว่าง", required) },
  installdate: { required: helpers.withMessage("ห้ามเป็นค่าว่าง", required) },
};
const v = useVuelidate(rules, {
  detail,
  repairdate,
  installdate,
});

const getRepairDetail = async (docno) => {
  try {
    let rs = await api.get(`/inform/v2/getRepairDetail/${docno}`);
    repair.value = rs.data.data[0];
    detail.value = repair.value.repair_detail;
    repairdate.value = new Date(
      repair.value.due_datetime ? repair.value.due_datetime : "00-00-00 00:00:00"
    );
    installdate.value = new Date(
      repair.value.finish_datetime ? repair.value.finish_datetime : "00-00-00 00:00:00"
    );
    // repairdate.value=repair.value.
  } catch (err) {
    errAlert(err);
  }
};

const submit = async () => {
  v.value.$touch();
  if (v.value.$error) return;

  try {
    let dt = repairdate.value;
    let rd = `${dt.getFullYear()}-${padL(dt.getMonth() + 1)}-${padL(dt.getDate())} ${padL(
      dt.getHours()
    )}:${padL(dt.getMinutes())}:${padL(dt.getSeconds())}`;
    dt = installdate.value;
    let id = `${dt.getFullYear()}-${padL(dt.getMonth() + 1)}-${padL(dt.getDate())} ${padL(
      dt.getHours()
    )}:${padL(dt.getMinutes())}:${padL(dt.getSeconds())}`;

    let rs = await api.post(`/inform/v2/repairUpdate`, {
      repair_detail: detail.value,
      due_datetime: rd,
      finish_datetime: id,
      docno: route.params.docno,
    });

    okAlert(rs.data.msg, () => {
      router.replace({ path: `/repair` });
    });
  } catch (err) {
    errAlert(err);
  }
};
const reset = () => {
  v.value.$reset();
  detail.value = repair.value.repair_detail;
    repairdate.value = new Date(
      repair.value.due_datetime ? repair.value.due_datetime : "00-00-00 00:00:00"
    );
    installdate.value = new Date(
      repair.value.finish_datetime ? repair.value.finish_datetime : "00-00-00 00:00:00"
    );
  
};
onMounted(async () => {
  await getRepairDetail(route.params.docno);
});
</script>
