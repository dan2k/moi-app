<template>
  <div class="jumbotron mx-2 py-2">
    <div class="container">
      <!-- <div class="row justify-content-center" style="font-size: 12px"> -->
      <div class="row" style="font-size: 12px">
        <div class="col-md-5">
          สถานะ: <vue-select
							v-model="vstatus"
							:options="state.status"
							label-by="desc"
							value-by="status"
							:searchable="true"
							:close-on-select="true"
							:clear-on-close="true"
							:clear-on-select="true"
							placeholder="เลือก"
							search-placeholder="ค้นหา"
              @update:modelValue="setActive2"
						>
              <template #dropdown-item="{ option }">
                <div :style="{color:option.color}">{{ option.title }} ({{ option.count }})</div>
              </template>
            </vue-select>
        </div>
        <div class="col-md-5">
          ระบบงาน:
          <vue-select
							v-model="app_gid"
							:options="optionGroup"
							label-by="label"
							value-by="id"
							:searchable="true"
							:close-on-select="true"
							:clear-on-close="true"
							:clear-on-select="true"
							placeholder="เลือก"
							search-placeholder="ค้นหา"
							@update:modelValue="getSub1"
						></vue-select>
        </div>
        <div class="col-md-5">
          โปรแกรม:
          <vue-select
							v-model="app_sub1_id"
							:options="optionSub1"
							label-by="label"
							value-by="id"
							:searchable="true"
							:close-on-select="true"
							:clear-on-close="true"
							:clear-on-select="true"
							placeholder="เลือก"
							search-placeholder="ค้นหา"
							@update:modelValue="getSub2"
						></vue-select>
        </div>
        <div class="col-md-5">
          เมนู:
          <vue-select
							v-model="app_sub2_id"
							:options="optionSub2"
							label-by="label"
							value-by="id"
							:searchable="true"
							:close-on-select="true"
							:clear-on-close="true"
							:clear-on-select="true"
							placeholder="เลือก"
							search-placeholder="ค้นหา"
							@update:modelValue="getSub3"
						></vue-select>
        </div>
        <div class="col-md-5">
          เมนูย่อย:
          <vue-select
							v-model="app_sub3_id"
							:options="optionSub3"
							label-by="label"
							value-by="id"
							:searchable="true"
							:close-on-select="true"
							:clear-on-close="true"
							:clear-on-select="true"
							placeholder="เลือก"
							search-placeholder="ค้นหา"
							@update:modelValue="setActive2"
						></vue-select>
        </div>
        <!-- <div
          class="card mr-1 mb-1"
          style="width: 180px; cursor: pointer"
          v-for="(s, i) in state.status"
          :key="i"
          :class="{
            'bg-warning': s.state,
          }"
          @click="setActive(s.status)"
        >
          <div class="card-body">
            <span
              style="position: absolute; top: 5px"
              class="card-title"
              :style="{ color: s.color }"
              ><i class="fas fa-circle-notch"></i>&nbsp; {{ s.title }}</span
            >
            <br />

            <span
              class="card-subtitle text-muted float-left"
              style="font-size: 24px; position: absolute; bottom: 2px"
            >
              <b :style="{ color: s.color }">{{ s.count }}</b
              >&nbsp;
              <span style="font-size: 16px">รายการ</span>
            </span>
          </div>
        </div> -->
        <div class="col-12">
          <button
            class="btn btn-primary mr-1 my-2 float-right"
            @click="
              store.dispatch('auth/toggleIsAll');
              u=store.getters['auth/getIsAll']?`/inform/v5/getData/${deptid}`:`/inform/v4/getData/${deptid}/${section}`;
              table.setUrl(u)
              table.getData();
              table.changePage(1);
              "
          >
            {{ store.getters['auth/getIsAll']?'งานที่รับผิดชอบ':'งานทั้งหมด' }}
          </button>
          <button
            class="btn btn-primary mr-1 my-2 float-right"
            @click="
              table.changePage(1);
              table.getData();
              getDataAll();
            "
          >
            <i class="fas fa-sync-alt"></i>
          </button>
          <button
            v-if="deptid!='DIB'"
            class="btn btn-primary mr-1 my-2 float-right"
            @click="$router.replace({ path: `/inform/followup/newjob` })"
          >
            <i class="fas fa-plus-circle"></i>
          </button>
        </div>
      </div>
      <div>
        <v-table
          ref="table"
          mode="server"
          :url="url"
          :headers="columns"
          :checkRow="false"
          :ceckAll="false"
          :rowNumber="true"
          :vtoolbar="false"
          :vwidth="'auto'"
          :vheight="'100%'"
          @on-get-select="getSelect2"
          @on-click-row="clickRow"
          @on-select-all="selectAll"
          @on-un-select-all="unSelectAll"
          @on-select="select"
          @on-un-select="unSelect"
          @on-load-success="loadSuccess"
          style="font-family: Sarabun, sans-serif; font-size: 14px;"
        >
          <template v-slot:action="actionProps">
            <div v-if="actionProps.field == 'action'" class="text-success">
              <button
                class="btn btn-outline-primary btn-sm"
                @click="view(actionProps.row)"
              >
                <i class="fas fa-book-open"></i>
              </button>
            </div>
            <div
              :class="{ desc: actionProps.field == 'job_desc' }"
              v-if="actionProps.field !== 'action' && actionProps.field !== 'important_flag'"
              :style="{
                color: state.status.filter(
                  (it, i) => Number(it.status) === Number(actionProps.row['job_status'])
                )[0]['color'],
              }"
            >
              {{ actionProps.row[actionProps.field] }}
            </div>
            <div
              :class="{ desc: actionProps.field == 'job_desc' }"
              v-if="actionProps.field === 'important_flag'"
              
            >
              <div class="containerx" v-if="actionProps.row[actionProps.field]==1">
                <div class="red flame"></div>
                <div class="orange flame"></div>
                <div class="yellow flame"></div>
                <div class="white flame"></div>
              </div>
              <div  v-if="actionProps.row[actionProps.field]==0">-</div>
            </div>
          </template>
        </v-table>
      </div>
    </div>
  </div>
  
  <audio controls autoplay ref="vedio" style="display:none;" muted>
    <source :src="audioUrl" type="audio/mpeg">
    <!-- <source src="horse.mp3" type="audio/mpeg"> -->
    Your browser does not support the audio element.
  </audio>
</template>

<script allowjs:true>
import { reactive, onMounted, ref ,nextTick,onUnmounted,computed} from "vue";
import VTable from "@/components/table/table.vue";
import { useStore } from "vuex";
import { api, errAlert, okAlert } from "@/helper";
import { useRouter } from "vue-router";
import { useFollowup } from "./followup";
import audioUrl from "@/assets/beep-06.mp3"
import VueSelect from "vue-next-select";
import "vue-next-select/dist/index.min.css";
export default {
  components: {
    VTable,
    "vue-select": VueSelect,
  },
  setup() {
    const vedio=ref(null)
    const store = useStore();
    const router = useRouter();
   let {status}=useFollowup();
    status=status.map((ob,i)=>{
      if(ob.status==store.state['auth'].followStatus){
        ob.state=true
      }else{
        ob.state=false
      }
      return ob
    })
    const state = reactive({
      status:status,
      data: [],
    });
    const auth = store.getters["auth/getAuthData"].user[0];
    let section = "";
    section = auth.place_type == "R" ? auth.sect_id.substring(1, 2) : "0";
    let deptid=auth.dept_id;
    let myInterval=null;
    onMounted(async () => {
      // เอาไว้โชว์เมนูรับแจ้งเข้าเข้าเงื่อนไข
      nextTick(()=>{
        try{

          if (document.getElementById("ainform").getAttribute("aria-expanded") == "false") {
            document.getElementById("ainform").click();
          }
        }catch(err){
          //
        }
      });
      table.value.setFilter("job_status", "=", store.state['auth'].followStatus);
      table.value.setFilter("app_gid", "=", app_gid.value);
      table.value.setFilter("app_sub1_id", "=", app_sub1_id.value);
      table.value.setFilter("app_sub2_id", "=", app_sub2_id.value);
      table.value.setFilter("app_sub3_id", "=", app_sub3_id.value);
      table.value.changePage(1);
      await table.value.getData();
      //await table.value.getData();
      await getAppGroup();
      
      setTimeout(()=>{
        if(store.state['auth'].followStatus==3&&section==0){
          location.reload();
        }
      },30000)
      
    });
    myInterval = setInterval(async ()=>{
        let rs=state.status.filter((ob,i)=>ob.status==3)
        if(store.state['auth'].followStatus==3 && section==0&&rs[0].count>0){
          console.log('yes')
          try{
            vedio.value.muted=false;
            vedio.value.play()  
          }catch(err){
            console.log(err)
          }
        }
    }, 2000);
    onUnmounted(()=>{
      clearInterval(myInterval);
    })
    const setActive = async (status) => {
      state.status.map((it, i) => {
        it.state = it.status == status;
        return it;
      });
      store.dispatch("auth/followStatus",status)
      table.value.setFilter("job_status", "=", status);
      table.value.changePage(1);
      await table.value.getData();
      await getDataAll();
      //console.log(store.state['auth'].followStatus)
      setTimeout(()=>{
        if(store.state['auth'].followStatus==3 && section==0){
          //alert(store.state['auth'].followStatus)
          location.reload();
        }
      },30000)
      
    };
    const setActive2 = async () => {
      state.status.map((it, i) => {
        it.state = it.status == vstatus.value;
        return it;
      });
      store.dispatch("auth/followStatus",vstatus.value)
      table.value.setFilter("job_status", "=", vstatus.value);
      table.value.setFilter("app_gid", "=", app_gid.value);
      table.value.setFilter("app_sub1_id", "=", app_sub1_id.value);
      table.value.setFilter("app_sub2_id", "=", app_sub2_id.value);
      table.value.setFilter("app_sub3_id", "=", app_sub3_id.value);
      table.value.changePage(1);
      await table.value.getData();
      await getDataAll();
      //console.log(store.state['auth'].followStatus)
      setTimeout(()=>{
        if(store.state['auth'].followStatus==3 && section==0){
          //alert(store.state['auth'].followStatus)
          location.reload();
        }
      },30000)
      
    };

    const table = ref();
    
    
    let u=store.getters["auth/getIsAll"]?`/inform/v5/getData/${deptid}`:`/inform/v4/getData/${deptid}/${section}`;
    const url = ref(u);
    const columns = ref([
      {
        label: "เร่งด่วน",
        name: "important_flag",
        formatter: true,
        balign: "center",
        halign: "center",
        bvalign: "left",
        hvalign: "middle",
        width: "5%",
      },
      {
        label: "วันเวลา",
        name: "job_add_datetime",
        sortable: true,
        order: "",
        balign: "center",
        halign: "center",
        bvalign: "left",
        hvalign: "middle",
        width: "5%",
        formatter: true,
      },
      {
        label: "หมายเลขปัญหา",
        name: "job_id",
        sortable: true,
        order: "",
        balign: "center",
        halign: "center",
        bvalign: "left",
        hvalign: "middle",
        width: "5%",
        formatter: true,
      },
      {
        label: "หน่วยงาน",
        name: "cust_pdesc",
        sortable: true,
        order: "",
        balign: "center",
        halign: "center",
        bvalign: "left",
        hvalign: "middle",
        width: "20%",
        formatter: true,
      },
      {
        label: "ผู้แจ้ง",
        name: "job_add_user",
        sortable: true,
        order: "",
        formatter: true,
        balign: "center",
        halign: "center",
        bvalign: "left",
        hvalign: "middle",
        width: "5%",
        formatter: true,
      },
      {
        label: "ระบบงาน",
        name: "app_gdesc",
        sortable: true,
        order: "",
        balign: "center",
        halign: "center",
        bvalign: "left",
        hvalign: "middle",
        width: "20%",
        formatter: true,
      },

      {
        label: "รายละเอียด",
        name: "job_desc",
        sortable: true,
        order: "",
        balign: "center",
        halign: "center",
        bvalign: "left",
        hvalign: "middle",
        width: "40%",
        formatter: true,
      },

      {
        label: "#",
        name: "action",
        formatter: true,
        balign: "center",
        halign: "center",
        bvalign: "left",
        hvalign: "middle",
        width: "5%",
      },
      
    ]);

    const edit = (r) => {
      alert(JSON.stringify(r));
    };
    const getSelect = () => {
      console.log(table.value.getSelect());
    };
    const getSelect2 = (a) => {
      console.log(a);
      console.log("getSelect");
      // console.log(a);
    };
    const clickRow = ({ row, i }) => {
      // console.log(table.value.rows);
      console.log("clickRow");
    };
    const selectAll = () => {
      console.log("selectAll");
    };
    const unSelectAll = () => {
      console.log("unSelectAll");
    };
    const select = ({ row, i }) => {
      console.log("Select");
    };
    const unSelect = ({ row, i }) => {
      console.log("unSelect");
    };
    const getDataAll = async () => {
      try {
        let u=store.getters["auth/getIsAll"]?`/inform/v5/getDataAll/${deptid}/${app_gid.value}/${app_sub1_id.value}/${app_sub2_id.value}/${app_sub3_id.value}`:`/inform/v4/getDataAll/${deptid}/${section}/${app_gid.value}/${app_sub1_id.value}/${app_sub2_id.value}/${app_sub3_id.value}`;
        // let res = await api.post(`/inform/v2/getDataAll/${section}`, {
        let res = await api.post(u, {
          filters: table.value.getFilter(),
        });
        state.status.forEach((ob, i) => {
          /* if (ob.status == -1) {
            return (ob.count = res.data.gstatus.reduce(
              (p, it) => Number(p) + Number(it.co),
              0
            ));
          } else {
            return (ob.count = res.data.gstatus.reduce(
              (p, it) =>
                it.job_status == ob.status ? Number(p) + Number(it.co) : Number(p),
              0
            ));
          } */
          if (ob.status == -1) {
            ob.count = res.data.gstatus.reduce(
              (p, it) => Number(p) + Number(it.co),
              0
            )

            
          } else {
            ob.count = res.data.gstatus.reduce(
              (p, it) =>
                it.job_status == ob.status ? Number(p) + Number(it.co) : Number(p),
              0
            )
          }
          ob.desc=`${ob.title} (${ob.count})`
        });
      } catch (err) {
        errAlert(err);
      }
    };
    const loadSuccess = async (data) => {
      //console.log("load successed",table.value);
      // console.log(data);
      await getDataAll();
    };
    const baseUrl=import.meta.env.VITE_PRIVATE_BASE_URL;
    const view = (row) => {
      // window.open(url);
      //console.log(row)
      if (Number(row.job_status) === 99) {

        // router.replace({ path: `/inform/followup/${row.job_id}/receive` });
        window.open(`${baseUrl}inform/followup/${row.job_id}/receive`)
      } else {
        // router.replace({ path: `/inform/followup/${row.job_id}/detail` });
        window.open(`${baseUrl}inform/followup/${row.job_id}/detail`)
      }
    };
    const vstatus = ref(store.state['auth'].followStatus??-1);
    const app_gid = ref(null);
		const app_sub1_id = ref(null);
		const app_sub2_id = ref(null);
		const app_sub3_id = ref(null);
		const optionGroup = ref([]);
		const optionSub1 = ref([]);
		const optionSub2 = ref([]);
		const optionSub3 = ref([]);
    const getAppGroup = async () => {
			await api.get(`/inform/v3/getAppGroup/${deptid}`).then((res) => {
				optionGroup.value = res.data.rows;
			});
		};
    const getSub1 = async () => {
			app_sub1_id.value = null;
			app_sub2_id.value = null;
			app_sub3_id.value = null;
			optionSub1.value = [];
			optionSub2.value = [];
			optionSub3.value = [];
			if (app_gid.value != "xxx") {
				await api
					.get(`/inform/v1/getSub1/${app_gid.value}`)
					.then((res) => {
						optionSub1.value = res.data.rows;
					});
			}
			//loadData
			console.log("by groups");
			// await getLogBook();
      await setActive2()
		};

		const getSub2 = async () => {
			app_sub2_id.value = null;
			app_sub3_id.value = null;
			optionSub2.value = [];
			optionSub3.value = [];
			if (app_sub1_id.value != "xxx") {
				await api
					.get(
						`/inform/v1/getSub2/${app_gid.value}/${app_sub1_id.value}`
					)
					.then((res) => {
						optionSub2.value = res.data.rows;
					});
			}
			console.log("by sub1");
			// await getLogBook();
      await setActive2()
		};
		const getSub3 = async () => {
			app_sub3_id.value = null;
			optionSub3.value = [];
			if ((app_sub2_id.value1 = "xxx")) {
				await api
					.get(
						`/inform/v1/getSub3/${app_gid.value}/${app_sub1_id.value}/${app_sub2_id.value}`
					)
					.then((res) => {
						optionSub3.value = res.data.rows;
					});
			}
			// await getLogBook();
      await setActive2()
		};

    return {
      state,
      setActive,
      table,
      columns,
      edit,
      view,
      getSelect,
      getSelect2,
      clickRow,
      selectAll,
      unSelectAll,
      select,
      unSelect,
      loadSuccess,
      setActive2,
      url,
      section,
      deptid,
      store,
      audioUrl,
      vedio,
      vstatus,
      app_gid,
      app_sub1_id,
      app_sub2_id,
      app_sub3_id,
      optionGroup,
      optionSub1,
      optionSub2,
      optionSub3,
      getSub1,
      getSub2,
      getSub3,
    };
  },
};
</script>

<style scoped>
.card:hover {
  background-color: lightgrey;
}
.desc {
  max-width: 150px;
  /*overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    */
}
.containerx{
  margin:20px auto;
  width: 30px;
  height: 10px;
  position:relative;
  transform-origin:center bottom;
  animation-name: flicker;
  animation-duration:3ms;
  animation-delay:200ms;
  animation-timing-function: ease-in;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}

.flame{
  bottom:0;
  position:absolute;
  border-bottom-right-radius: 50%;
  border-bottom-left-radius: 50%;
  border-top-left-radius: 50%;
  transform:rotate(-45deg) scale(1.5,1.5);
}

.yellow{
  left:7px; 
  width: 1px;
  height: 1px;
  background:gold;
  box-shadow: 0px 0px 2px 1px gold;
}

.orange{
  left:7px; 
  width: 5px;
  height: 5px;
  background:orange;
  box-shadow: 0px 0px 2px 1px orange;
}

.red{
  left:5px;
  width: 10px;
  height: 10px;
  background:OrangeRed;
  box-shadow: 0px 0px 2px 1px OrangeRed;
}

.white{
  left:9px; 
  bottom:-2px;
  width: 1px;
  height: 3px;
  background:white;
  box-shadow: 0px 0px 2px 1px white;
}

/* .circle{
  border-radius: 50%;
  position:absolute;  
} */

/* .blue{
  width: 10px;
  height: 10px;
  left:25px;
  bottom:-25px; 
  background: SlateBlue;
  box-shadow: 0px 0px 15px 10px SlateBlue;
} */

/* .black{
  width: 40px;
  height: 40px;
  left:10px;
  bottom:-60px;  
  background: black;
  box-shadow: 0px 0px 15px 10px black;
} */

@keyframes flicker{
  0%   {transform: rotate(-1deg);}
  20%  {transform: rotate(1deg);}
  40%  {transform: rotate(-1deg);}
  60%  {transform: rotate(1deg) scaleY(1.04);}
  80%  {transform: rotate(-2deg) scaleY(0.92);}
  100% {transform: rotate(1deg);}
}
.vue-select {
	width: auto;
}
</style>
