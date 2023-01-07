<template>
  <div class="jumbotron py-2 col-12 col-md-10 mx-auto">
    <div class="card">
      <div class="card-body">
        <div class="form-row">
          <table id="satify" class="table table-bordered">
            <thead>
              <tr>
                <td rowspan="2">หัวข้อ</td>
                <td rowspan="2">รายละเอียดการประเมิน</td>
                <td colspan="5">ระดับความพึงพอใจ</td>
              </tr>
              <tr>
                <td>มากที่สุด</td>
                <td>มาก</td>
                <td>ปานกลาง</td>
                <td>น้อย</td>
                <td>น้อยที่สุด</td>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
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
import { useFollowupDetail } from "../followup/followup-detail";
const { comments, job, pics, open } = useFollowupDetail();
</script>
