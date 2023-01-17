<template>
  <div class="jumbotron py-2 col-12 col-md-10 mx-auto">
    <div class="card">
      <div class="card-body">
        <div class="form-row">
          <div class="col-3 mx-auto mt-0 mb-3 py-0  alert alert-primary text-center">
            <h5 class="mt-2">{{$route.params.jobid}}</h5>
            
          </div>
        </div>
        <div class="form-row">
          <div class="col-12">
            
          </div>
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
            <span class="title">สถานะ:</span><span class="detail">{{ job.status }}</span>
          </div>
        </div>
        <div class="form-row">
          <div class="col-12 col-md-12">
            <span class="title">รายละเอียด:</span
            ><span class="detail">{{ job.job_desc }}</span>
          </div>
        </div>
        <div class="form-row" v-if="job.job_csvno">
          <div class="col-12 col-md-12">
            <span class="title">CSV NO:</span
            ><span class="detail">{{ job.job_csvno }}</span>
          </div>
        </div>
        <div class="form-row">
          <div v-for="(p, index) in pics"
                  :key="index" class="col-2 text-center my-2 mx-auto">
            <fullscreen
                  v-model="p.fullscreen" :teleport="true" :page-only="false" fullscreen-class="fullscreenx" style="z-index:9999;">
                  <div class="fullscreen-wrapper" >
                    <img v-show="!p.fullscreen" 
                      :src="`${JOBIMAGE}${p.pic_name}`"
                      class="img-thumbnail "
                      alt="..."
                      style="cursor: pointer; width: 80px; height: 80px"    
                      @click="toggle(p)"
                    >
                    <img v-show="p.fullscreen" :src="`${JOBIMAGE}${p.pic_name}`">
                  </div>
            </fullscreen>
            <!-- <img
              v-for="(p, index) in pics"
              :key="index"
              :src="`${JOBIMAGE}${p.pic_name}`"
              class="img-thumbnail mx-1"
              alt="..."
              style="cursor: pointer; width: 150px; height: 150px"
              @click="
                open(
                  `${JOBIMAGE}${p.pic_name}`
                )
              "
            /> -->
          </div>
        </div>
      </div>
    </div>
    <div class="form-row" v-for="(c, index) in comments" :key="index">
      <div class="col-12">
        <div class="card my-2">
          <div class="card-body">
            <div class="float-right" style="font-size: 12px">
              ความคิดเห็นที่ {{ index + 1 }}
            </div>
            <br />
            <div style="font-size: 14px; text-indent: 20px">{{ c.comment_desc }}</div>
            <div class="row">
              <div
                  v-for="(p, index) in c.pics"
                  :key="index" 
                  class="col-2 text-center my-2 mx-auto"
                  
                  >
                  
                <fullscreen
                   
                  v-model="p.fullscreen" 
                  :teleport="true" 
                  :page-only="false" 
                  fullscreen-class="fullscreenx"
                  style="z-index:9999;"
                  >
                  <div class="fullscreen-wrapper">
                    <img v-show="!p.fullscreen" 
                      :src="`${COMMENTIMAGE}${p.pic_name}`"
                      class="img-thumbnail"
                      alt="..."
                      style="cursor: pointer; width: 80px; height: 80px"    
                      @click="toggle(p)"
                    >
                    <img v-show="p.fullscreen" :src="`${COMMENTIMAGE}${p.pic_name}`">
                  </div>
                </fullscreen>
                <!-- <img
                  v-for="(p, index) in c.pics"
                  :key="index"
                  :src="`${COMMENTIMAGE}${p.pic_name}`"
                  class="img-thumbnail mx-1"
                  alt="..."
                  style="cursor: pointer; width: 80px; height: 80px"
                  @click="
                    open(
                      `${COMMENTIMAGE}${p.pic_name}`
                    )
                  "
                /> -->
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
          <div class="col-12 text-center">
            <button 
                    v-if="job.satisfy1<1 && job.job_status==1" 
                    @click="open(`https://www.controldata.co.th/mpsicc/callcenter/client/followup/${$route.params.jobid}/satisfy`)"
                    class="btn btn-primary btn-sm"
                >ประเมินความพึงพอใจ(ลูกค้า)
                </button>
						<button
            v-if="job.center_flag==1 && job.satisfy2<1"
						class="btn btn-primary my-1 mr-1"
						@click="
            $router.replace({ path: `/inform/logbook/${$route.params.jobid}/satisfy` })
            "
						>
							ประเมิณความพึงพอใจ MTS(SUPPORT)

						</button>
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
.fullscreenx{
  z-index:9999 important;
}
.fullscreen-wrapper {
  width: 100%;
  height: 100%;
  background: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
}
</style>
<script setup>
import {useFollowupDetail} from "../followup/followup-detail"
import {nextTick,onMounted } from "vue";
import { component as fullscreen } from 'vue-fullscreen';
const {comments,job,pics,open} =useFollowupDetail()
const JOBIMAGE=import.meta.env.VITE_PRIVATE_JOBIMAGE;
const COMMENTIMAGE=import.meta.env.VITE_PRIVATE_COMMENTIMAGE;
onMounted(()=>{
  nextTick(()=>{
		if (document.getElementById("ainform").getAttribute("aria-expanded") == "false") {
		  document.getElementById("ainform").click();
		}
	})
})
const toggle=(pic)=> {
      console.log(pic)
      pic.fullscreen=!pic.fullscreen
}
</script>
