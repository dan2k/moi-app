<template>
  <div class="jumbotron mx-2 py-2">
    <div class="container">
      <div class="row justify-content-center" style="font-size: 12px">
        <div
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
        </div>
        <button
          class="btn btn-primary mx-2 my-2 float-right"
          @click="
            table.changePage(1);
            table.getData();
            getDataAll();
          "
        >
          <i class="fas fa-sync-alt"></i>
        </button>
        <button
          class="btn btn-primary mx-2 my-2 float-right"
          @click="$router.replace({ path: `/inform/followup/newjob` })"
        >
          <i class="fas fa-plus-circle"></i>
        </button>
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
          style="font-family: 'Sarabun', sans-serif; font-size: 14px"
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
              v-if="actionProps.field !== 'action'"
              :style="{
                color: state.status.filter(
                  (it, i) => Number(it.status) === Number(actionProps.row['job_status'])
                )[0]['color'],
              }"
            >
              {{ actionProps.row[actionProps.field] }}
            </div>
          </template>
        </v-table>
      </div>
    </div>
  </div>
  <!-- </div> -->
</template>

<script>
import { reactive, onMounted, ref } from "vue";
import VTable from "@/components/table/table.vue";
import { useStore } from "vuex";
import { api, errAlert, okAlert } from "@/helper";
import { useRouter } from "vue-router";
export default {
  components: {
    VTable,
  },
  setup() {
    const router = useRouter();
    const state = reactive({
      status: [
        {
          id: 0,
          title: "ทั้งหมด",
          color: "black",
          state: true,
          count: 0,
          status: -1,
        },
        {
          id: 1,
          title: "งานใหม่",
          color: "red",
          state: false,
          count: 0,
          status: 99,
        },
        {
          id: 2,
          title: "กำลังตรวจสอบ",
          color: "orange",
          state: false,
          count: 0,
          status: 0,
        },
        // { id: 1, title: "ดำเนินการเรียบร้อยแล้ว" },

        {
          id: 3,
          title: "ส่งกลับเพื่อตรวจสอบ",
          color: "#5900b3",
          state: false,
          count: 0,
          status: 4,
        },
        {
          id: 4,
          title: "ปรึกษาส่วนกลาง",
          color: "#fccfe7",
          state: false,
          count: 0,
          status: 5,
        },
        {
          id: 5,
          title: "รอส่วนกลางตรวจสอบ",
          color: "#ff0000",
          state: false,
          count: 0,
          status: 3,
        },
        {
          id: 6,
          title: "ส่งกลับส่วนกลาง",
          color: "#fccff7",
          state: false,
          count: 0,
          status: 6,
        },
        {
          id: 7,
          title: "สรุปผล",
          color: "lightblue",
          state: false,
          count: 0,
          status: 7,
        },
        {
          id: 8,
          title: "กำลังแก้ไขโปรแกรม",
          color: "orange",
          state: false,
          count: 0,
          status: 2,
        },
        {
          id: 9,
          title: "แก้ไขข้อมูล",
          color: "green",
          state: false,
          count: 0,
          status: 8,
        },
        {
          id: 10,
          title: "ทดสอบโปรแกรม",
          color: "yellow",
          state: false,
          count: 0,
          status: 9,
        },
      ],
      data: [],
    });
    onMounted(() => {
      // เอาไว้โชว์เมนูรับแจ้งเข้าเข้าเงื่อนไข
      if (document.getElementById("ainform").getAttribute("aria-expanded") == "false") {
        document.getElementById("ainform").click();
      }
    });
    const setActive = async (status) => {
      state.status.map((it, i) => {
        it.state = it.status == status;
        return it;
      });
      table.value.setFilter("job_status", "=", status);
      table.value.changePage(1);
      await table.value.getData();
      await getDataAll();
    };

    const table = ref();
    const store = useStore();
    const auth = store.getters["auth/getAuthData"].user[0];
    let section = "";
    section = auth.place_type == "R" ? auth.sect_id.substring(1, 2) : "0";
    const url = ref(`/inform/v2/getData/${section}`);
    const columns = ref([
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
        let res = await api.post(`/inform/v2/getDataAll/${section}`, {
          filters: table.value.getFilter(),
        });
        state.status.forEach((ob, i) => {
          if (ob.status == -1) {
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
          }
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
    const view = (row) => {
      // window.open(url);
      //console.log(row)
      if (Number(row.job_status) === 99) {
        router.replace({ path: `/inform/followup/${row.job_id}/receive` });
      } else {
        router.replace({ path: `/inform/followup/${row.job_id}/detail` });
      }
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
      url,
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
</style>
