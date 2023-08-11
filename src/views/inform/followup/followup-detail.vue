<template>
  <div class="jumbotron py-2 col-12 col-md-10 mx-auto">
    <div class="card">
      <div class="card-body">
        <div class="form-row">
          <div class="col-3 mx-auto mt-0 mb-3 py-0 alert alert-primary text-center">
            <h5 class="mt-2">{{ $route.params.jobid }}</h5>
          </div>
          <span
            class="float-right"
            style="cursor: pointer"
            @click="$router.replace({ path: `/inform/followup` })"
            ><i class="fas fa-arrow-left"></i
          ></span>
        </div>
        <div class="form-row">
          <div class="col-12"></div>
        </div>
        <div class="form-row">
          <div class="col-12 col-md-6">
            <span class="title">ประเภทหน่วยงาน:</span
            ><span class="detail">{{ job.cust_desc }}</span>
          </div>
          <div class="col-12 col-md-6">
            <span class="title">หน่วยงาน:</span
            ><span class="detail">{{ `${job.cust_pcode}:${job.cust_pdesc}` }}</span>
          </div>
        </div>
        <div class="form-row">
          <div class="col-12 col-md-6" v-if="job.group_desc">
            <span class="title">ระบบงาน:</span
            ><span class="detail">{{ job.group_desc }}</span>
          </div>
          <div class="col-12 col-md-6" v-if="job.sub1_desc">
            <span class="title">โปรแกรม:</span
            ><span class="detail">{{ `${job.sub1_desc}` }}</span>
          </div>
        </div>
        <div class="form-row">
          <div class="col-12 col-md-6" v-if="job.sub2_desc">
            <span class="title">เมนู:</span
            ><span class="detail">{{ job.sub2_desc }}</span>
          </div>
          <div class="col-12 col-md-6" v-if="job.sub3_desc">
            <span class="title">เมนูย่อย:</span
            ><span class="detail">{{ `${job.sub3_desc}` }}</span>
          </div>
        </div>
        <div class="form-row">
          <div class="col-12 col-md-6" v-if="job.job_add_user">
            <span class="title">ผู้แจ้ง:</span
            ><span class="detail">{{ job.job_add_user }}</span>
          </div>
          <div class="col-12 col-md-6" v-if="job.job_phone">
            <span class="title">เบอร์โทร:</span
            ><span class="detail">{{ job.job_phone }}</span>
          </div>
        </div>
        <div class="form-row">
          <div class="col-12 col-md-6">
            <span class="title">วันที่แจ้งปัญหา:</span
            ><span class="detail">{{ job.sdate }} {{ job.stime }}</span>
          </div>
          <div class="col-12 col-md-6">
            <span class="title">สถานะ:</span
            ><span :style="{ color: job.color }" class="detail">{{ job.status }}</span>
          </div>
        </div>
        <div class="form-row" v-if="job.ref_jobid">
          <div class="col-12 col-md-6">
            <a class="title" >หมายเลขปัญหาอ้างอิง:</a
            ><a class="detail" style="cursor:pointer;" @click="open(`/inform/followup/${job.ref_jobid}/detail`)">{{ job.ref_jobid }}</a>
          </div>
         
        </div>
        <div class="form-row">
          <div class="col-12 col-md-12">
            <span class="title">รายละเอียด:</span
            ><span class="detail" style="text-indent: 0px;white-space:pre-wrap;">{{ job.job_desc }}</span>
          </div>
        </div>
        <div class="form-row" v-if="job.job_csvno">
          <div class="col-12 col-md-12">
            <span class="title">CSV NO:</span
            ><span class="detail"><pre style="text-indent: 0">{{ job.job_csvno }}</pre></span>
          </div>
        </div>
        <div class="form-row">
          <div class="col-12 mx-auto">
            <viewer  
            :options="{navbar:pics.map((ob,i)=>`${JOBIMAGE}${ob.pic_name}`).length>1}"
              :images="pics.map((ob,i)=>`${JOBIMAGE}${ob.pic_name}`)"
              class="viewer text-center" 
            >
            <template #default="scope">
              <img v-for="src in scope.images" :src="src" :key="src" class="image">
            </template>
            </viewer>
          </div>
        </div>
      </div>
    </div>
    <div class="form-row" v-for="(c, index) in comments" :key="index">
      <div class="col-12">
        <div class="card my-2" style="z-index:1;">
          <div class="card-body">
            <div class="float-right" style="font-size: 12px">
              ความคิดเห็นที่ {{ index + 1 }} 
              <span v-if="empid==c.comment_add_user" @click="del(c.comment_id)" style="color:red;cursor:pointer;" class="material-icons-outlined">delete</span>
            </div>
            <br />
            <div style="font-size: 14px; text-indent: 0px;white-space:pre-wrap;">{{ c.comment_desc }}</div>
            <div class="row">
              <div class="col-12 mx-auto">
                <viewer  
                :options="{
                    navbar:c.pics.map((ob,i)=>`${COMMENTIMAGE}${ob.pic_name}`).length>1,
                  }"
                  :images="c.pics.map((ob,i)=>`${COMMENTIMAGE}${ob.pic_name}`)"
                  class="viewer text-center" 
                >
                <template #default="scope">
                  <img v-for="src in scope.images" :src="src" :key="src" class="image">
                </template>
                </viewer>
              </div>
            </div> 
            <p class="float-right card-text" style="font-size: 10px">
              โดย {{ c.thiname }} {{ c.comment_datetime }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="form-row">
      <div class="col-12 text-center" style="z-index:2;">
        <button
          v-if="job.job_status != 1"
          class="btn btn-primary my-1 mr-1"
          @click="
            $router.replace({ path: `/inform/followup/${$route.params.jobid}/comment` })
          "
        >
          comment
        </button>
        <button
          v-if="
            job.job_status != 1 &&
            (job.job_receive_region == sectid ||
              (job.section_id == sectid && isSpecial) ||
              sectid == 0)
          "
          class="btn btn-secondary my-1 mr-1"
          @click="
            $router.replace({ path: `/inform/followup/${$route.params.jobid}/close` })
          "
        >
          ปิดงาน
        </button>

        <button
          v-if="
            placetype == 'R' && job.job_status == 0 && job.job_receive_region == sectid
          "
          class="btn btn-warning my-1 mr-1"
          @click="sendCenter"
        >
          ปรึกษาส่วนกลาง
        </button>
        <button
          v-if="
            placetype == 'R' && job.job_status == 4 && job.job_receive_region == sectid
          "
          class="btn btn-warning my-1 mr-1"
          @click="
            $router.replace({
              path: `/inform/followup/${$route.params.jobid}/feedbackmts`,
            })
          "
        >
          ตอบกลับ mts
        </button>

        <button
          v-if="
            (placetype != 'R' || (isSpecial && sectid == job.section_id)) &&
            job.job_status == 5
          "
          class="btn btn-primary my-1 mr-1"
          @click="check"
        >
          รอตรวจสอบ
        </button>
        <button
          v-if="
            (placetype != 'R' || (isSpecial && sectid == job.section_id)) &&
            job.job_status == 3
          "
          class="btn btn-primary my-1 mr-1"
          @click="
            $router.replace({ path: `/inform/followup/${$route.params.jobid}/summarize` })
          "
        >
          สรุปผล
        </button>
        <button
          v-if="
            (placetype != 'R' && ![4, 0, 99].includes(Number(job.job_status))) ||
            (isSpecial &&
              sectid == job.section_id &&
              ![4, 0, 99].includes(Number(job.job_status)))
          "
          class="btn btn-warning my-1 mr-1"
          @click="
            $router.replace({ path: `/inform/followup/${$route.params.jobid}/sendback` })
          "
        >
          ส่งกลับตรวจสอบเพิ่มเติม
        </button>
        <button
          v-if="
            (placetype != 'R' || (isSpecial && sectid == job.section_id)) &&
            Number(job.isRepair) == 0 &&
            [6, 7].includes(Number(job.job_status))
          "
          class="btn btn-info my-1 mr-1"
          @click="
            $router.replace({
              path: `/inform/followup/${$route.params.jobid}/receiverepair`,
            })
          "
        >
          รับซ่อม
        </button>
        <!-- <button
          v-if="placetype != 'R' && Number(job.isRepair)>0"
          class="btn btn-info my-1 mr-1"
          @click="
            $router.replace({ path: `/inform/followup/${route.params.jobid}/receiverepair` })
          "
        >
          แจ้งซ่อมซ้ำ
        </button> -->
        <button
          v-if="
            (placetype != 'R' || (isSpecial && sectid == job.section_id)) &&
            [6, 7].includes(Number(job.job_status))
          "
          class="btn btn-success my-1 mr-1"
          @click="
            $router.replace({ path: `/inform/followup/${$route.params.jobid}/editdata` })
          "
        >
          แก้ไขข้อมูล
        </button>
        <button
          v-if="
            (placetype != 'R' || (isSpecial && sectid == job.section_id)) &&
            [2].includes(Number(job.job_status))
          "
          class="btn btn-success my-1 mr-1"
          @click="
            $router.replace({
              path: `/inform/followup/${$route.params.jobid}/testprogram`,
            })
          "
        >
          ทดสอบโปรแกรม
        </button>
        <button
          v-if="![1,99].includes(Number(job.job_status))"
          class="btn btn-danger my-1 mr-1"
          @click="
            $router.replace({
              path: `/inform/followup/${$route.params.jobid}/reportdev`,
            })
          "
        >
          แจ้ง DEV
        </button>
        <!-- {{`${placetype} ${job.job_status}`}} -->
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

.image {
  cursor: pointer;
  margin: 5px;
  display: inline-block;
  width:100px;
  height:100px;
}
</style>
<script setup>
import {  onMounted,nextTick} from "vue";
import { useFollowupDetail } from "./followup-detail";
import 'viewerjs/dist/viewer.css'
import Viewer from "ice-vue-viewer/src/component.vue"

const {
  placetype,
  comments,
  job,
  pics,
  sectid,
  isSpecial,
  empid,
  del,
  sendCenter,
  check,
  open,
} = useFollowupDetail();
const JOBIMAGE=import.meta.env.VITE_PRIVATE_JOBIMAGE;
const COMMENTIMAGE=import.meta.env.VITE_PRIVATE_COMMENTIMAGE;
onMounted(() => {
  // เอาไว้โชว์เมนูรับแจ้งเข้าเข้าเงื่อนไข
  nextTick(() => {
    if (document.getElementById("ainform").getAttribute("aria-expanded") == "false") {
      document.getElementById("ainform").click();
    }
  });
});

const toggle=(pic)=> {
      console.log(pic)
      pic.fullscreen=!pic.fullscreen
}
</script>

