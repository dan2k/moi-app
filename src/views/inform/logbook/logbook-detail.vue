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
            ><span class="detail" style="text-indent: 0px;white-space:pre-wrap;">{{ job.job_desc }}</span>
          </div>
        </div>
        <div class="form-row" v-if="job.job_csvno">
          <div class="col-12 col-md-12">
            <span class="title">CSV NO:</span
            ><span class="detail" ><pre style="text-indent: 0">{{ job.job_csvno }}</pre></span>
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
        <div class="card my-2">
          <div class="card-body">
            <div class="float-right" style="font-size: 12px">
              ความคิดเห็นที่ {{ index + 1 }}
            </div>
            <br />
            <div style="font-size: 14px; text-indent: 0px;white-space:pre-wrap;">{{ c.comment_desc }}</div>
            <div class="row">
              <div class="col-12 mx-auto">
                <viewer  
                :options="{navbar:c.pics.map((ob,i)=>`${COMMENTIMAGE}${ob.pic_name}`).length>1}"
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
          <div class="col-12 text-center">
            <button 
                    v-if="job.satisfy1<1 && job.job_status==1" 
                    @click="open(`https://www.controldata.co.th/mpsicc/callcenter/client/followup/${$route.params.jobid}/satisfy`)"
                    class="btn btn-primary btn-sm my-1 mx-1"
                >ประเมินความพึงพอใจ(ลูกค้า)
                </button>
						<button
            v-if="job.center_flag==1 && job.satisfy2<1"
						class="btn btn-primary btn-sm my-1 mx-1"
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

.image {
  cursor: pointer;
  margin: 5px;
  display: inline-block;
  width:100px;
  height:100px;
}

</style>
<script setup>

import {useFollowupDetail} from "../followup/followup-detail"
import {nextTick,onMounted } from "vue";

import 'viewerjs/dist/viewer.css'
import Viewer from "ice-vue-viewer/src/component.vue"

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

</script>
