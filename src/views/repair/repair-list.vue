<template>
  <div class="jumbotron mx-2">
    <div class="container">
      <div>
        <v-table
          ref="table"
          mode="server"
          :url="url"
          :headers="columns"
          :checkRow="false"
          :ceckAll="false"
          :rowNumber="true"
          :vtoolbar="true"
          :vsearch="true"
          :vwidth="'auto'"
          :vheight="'100%'"
          @on-click-row="edit"
          style="font-family: 'Sarabun', sans-serif; font-size: 14px"
        >
        </v-table>
      </div>
    </div>
  </div>
</template>
<style scoped>
tbody td {
  cursor: pointer !important;
}
</style>
<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import VTable from "@/components/table/table.vue";
import { useStore } from "vuex";
const router = useRouter();
const table = ref();
const store = useStore();
const url = ref(`/inform/v2/getRepair`);

const columns = ref([
  {
    label: "เลขที่เอกสาร",
    name: "doc_no",
    width: "8%",
    hclassName: "text-center",
    className: "text-center",
    sortable: true,
    order: "",
  },
  {
    label: "วันที่ส่งซ่อม",
    name: "send_datetime",
    width: "15%",
    hclassName: "text-center",
    className: "text-center",
    sortable: true,
    order: "",
  },
  {
    label: "โปรแกรม",
    name: "app_gdesc",
    width: "20%",
    hclassName: "text-center",
    className: "text-center",
    sortable: true,
    order: "",
  },
  {
    label: "รายละเอียด",
    name: "problem_detail",
    width: "25%",
    hclassName: "text-center",
    className: "text-center",
    sortable: true,
    order: "",
  },
  {
    label: "ผู้ส่งซ่อม",
    name: "sendname",
    width: "15%",
    hclassName: "text-center",
    className: "text-center",
    sortable: true,
    order: "",
  },
  {
    label: "สถานะ",
    name: "rp_status_desc",
    width: "10%",
    hclassName: "text-center",
    className: "text-center",
    sortable: true,
    order: "",
  },
]);
const edit = ({ row, i }) => {
// console.log(row) 
  router.replace({ path: `/repair/${row.doc_no}/edit` });
};
</script>
