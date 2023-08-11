<template>
  <div class="jumbotron py-2 col-12 col-md-10 mx-auto">
    <div class="container" ref="reference">
      <form @submit.prevent="submit" class="needs-validation" novalidate>
        <div class="form-row" ref="content">
          <div class="col-12 col-md-12">
            <span class="title">โปรแกรม:</span>
            <span class="detail">{{ job.group_desc }}</span>
            <span class="detail" v-if="job.sub1_desc">->{{ job.sub1_desc }}</span>
            <span class="detail" v-if="job.sub2_desc">->{{ job.sub2_desc }}</span>
            <span class="detail" v-if="job.sub3_desc">->{{ job.sub3_desc }}</span>

          </div>
          <div class="col-12 col-md-12">
            <span class="title">เรื่อง:</span
            ><span class="detail">{{ job.job_desc }} </span>
          </div>
          <div class="col-12 col-md-12" v-if="job.msdate">
            <span class="title">วันเวลาที่ MTS รับงาน:</span
            ><span class="detail">{{ job.msdate }} {{ job.mstime }}</span>
          </div>
          <div class="col-12 col-md-12" v-else>
            <span class="title">วันเวลาที่ รับงาน:</span
            ><span class="detail">{{ job.rdate }} {{ job.rtime }}</span>
          </div>
          <div class="col-12 col-md-12">
            <span class="title">วันเวลาที่ส่ง DEV:</span
            ><span class="detail">{{ job.nsdate }} {{ job.nstime }} </span>
          </div>
          <div class="col-12 col-md-12">
            <span class="title">Job URL:</span
            ><span class="detail">http://www.controldata.co.th/mpsicc/moi-app/client/inform/followup/{{job.job_id}}/detail</span>
          </div>
          
        </div>

        <div class="form-row">
          <div class="col-12 text-center">
            <button
              class="btn btn-secondary mr-1"
              @click="copy()"
            >
              คัดลอก
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
import {ref} from "vue"
import { useFollowupDetail } from "./followup-detail";

const {
  job,
  
} = useFollowupDetail();

const content=ref(null)
const reference=ref(null)
const copy=()=>{
  const storage = document.createElement('textarea');
  storage.value = content.value.innerText;
  reference.value.appendChild(storage);
  storage.select();
  storage.setSelectionRange(0, 99999);
  document.execCommand('copy');
  reference.value.removeChild(storage);
}

</script>
