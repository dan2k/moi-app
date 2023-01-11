<template>
  <div class="jumbotron py-2 col-12 col-md-10 mx-auto">
    <div class="card">
      <div class="card-body">
        <div class="form-row">
          <table id="satify" class="table table-bordered">
            <thead>
              <tr>
                <th rowspan="2">หัวข้อ</th>
                <th rowspan="2">รายละเอียดการประเมิน</th>
                <th colspan="5">ระดับความพึงพอใจ</th>
              </tr>
              <tr>
                <th>มากที่สุด</th>
                <th>มาก</th>
                <th>ปานกลาง</th>
                <th>น้อย</th>
                <th>น้อยที่สุด</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in subject" :key="s.seq">
                <td align="center">{{ s.seq }}.</td>
                <td>{{ s.subject_desc }}</td>
                <td  class="score"><input type="radio" :name="s.subject_id" v-model="s.value" value="5"/></td>
                <td  class="score"><input type="radio" :name="s.subject_id" v-model="s.value" value="4"/></td>
                <td  class="score"><input type="radio" :name="s.subject_id" v-model="s.value" value="3"/></td>
                <td  class="score"><input type="radio" :name="s.subject_id" v-model="s.value" value="2"/></td>
                <td  class="score"><input type="radio" :name="s.subject_id" v-model="s.value" value="1"/></td>
              </tr>
            </tbody>
          </table>
          
        </div>
        <div class="form-row">
          <div class="col-12 text-center">
            <button class="btn btn-primary btn-small" @click="submit()">บันทึก</button>
          </div>
        </div>
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
import { onMounted,ref } from "vue";
import { useLogbook } from "./logbook";
import { useRoute,useRouter} from "vue-router";
import { api,errAlert,okAlert } from "@/helper";
const { getSubject,getEmpCenterResp } = useLogbook();
let subject=ref([])
let empid=ref(null)

const route=useRoute()
const router=useRouter()
onMounted(async () => {
  subject.value=await getSubject();
  empid.value=await getEmpCenterResp(route.params.jobid);
  subject.value=subject.value.map((it,i)=>{
    it['value']=null;
    return it
  })
})
const submit=async ()=>{
  let check=true 
  subject.value.forEach((it,i)=>{
     if(!it.value){
      check=false 
      return 
     }  
  })
  if(!check){
    errAlert("กรุณาเลือกให้ครบทุกข้อ")
    return 
  }
  try {
    let rs = await api.post(`/inform/v3/saveSatisfy`, {
      subject: subject.value,
      empid:empid.value,
      jobid: route.params.jobid,
    });
    okAlert(rs.data.msg, () => {
      router.replace({ path: `/inform/logbook` });
    });
  } catch (err) {
    errAlert(err);
  }
}
</script>
<style scoped>
  table thead th{
    text-align:center;
    vertical-align: middle;
  }
  table td.score{
    text-align:center;
    vertical-align: middle;
  }
</style>
