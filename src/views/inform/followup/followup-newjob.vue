<template>
  <div class="jumbotron py-2 col-12 col-md-10 mx-auto">
    <div class="container">
      <form ref="form" @submit.prevent="submit" class="needs-validation" novalidate>
        <div class="form-row">
          <div class="col-12 col-md-6">
            <v-select
              label="ประเภทหน่วยงาน:"
              :v="v.custptype"
              :obj="custptypes"
              style="width: 100%"
              @on-update="changePtype"
            ></v-select>
          </div>
          <div class="col-12 col-md-6">
            <v-select
              label="จังหวัด:"
              :v="v.province"
              :obj="provinces"
              style="width: 100%"
              @on-update="changeProvince"
            ></v-select>
          </div>
        </div>

        <div class="form-row">
          <div class="col-12 col-md-6">
            <v-select
              label="หน่วยงาน:"
              :v="v.custpcode"
              :obj="custpcodes"
              style="width: 100%"
              @on-update="changePcode"
            ></v-select>
          </div>
          <div class="col-12 col-md-6">
            <v-select
              label="ระบบงาน:"
              :v="v.appgid"
              :obj="appgroups"
              style="width: 100%"
              @on-update="changeGroup"
            ></v-select>
          </div>
        </div>

        <div class="form-row">
          <div class="col-12 col-md-6">
            <v-select
              label="โปรแกรม:"
              :v="v.appsub1id"
              :obj="appsub1s"
              style="width: 100%"
              @on-update="changeSub1"
            ></v-select>
          </div>
          <div class="col-12 col-md-6">
            <v-select
              label="เมนูการทำงาน:"
              :v="v.appsub2id"
              :obj="appsub2s"
              style="width: 100%"
              @on-update="changeSub2"
            ></v-select>
          </div>
        </div>

        <div class="form-row">
          <div class="col-12 col-md-6">
            <v-select
              label="เมนูการทำงานย่อย:"
              :v="v.appsub3id"
              :obj="appsub3s"
              style="width: 100%"
            ></v-select>
          </div>
        </div>
        <div class="form-row">
          <div class="col-12 col-md-10">
            <text-area label="รายละเอียด:" :v="v.detail" rows="5"></text-area>
          </div>
        </div>
        <div class="form-row">
          <div class="col-12 col-md-6">
            <Text label="ผู้แจ้ง:" :v="v.username"></Text>
          </div>
          <div class="col-12 col-md-6">
            <Text
              label="เบอร์โทร:"
              :v="v.tel"
              v-maska="'###-###-####'"
              @maska="rawtel = $event.target.dataset.maskRawValue"
            ></Text>
          </div>
        </div>
        <!-- <div class="form-row">
          <div class="col-12 text-center my-2">
            <img
              v-for="(p, index) in pics"
              :key="index"
              :src="`https://www.controldata.co.th/mpsicc/callcenter/server/uploads/images/jobs/${p.pic_name}`"
              class="img-thumbnail mx-1"
              alt="..."
              style="cursor: pointer; width: 150px; height: 150px"
              @click="
                open(
                  `https://www.controldata.co.th/mpsicc/callcenter/server/uploads/images/jobs/${p.pic_name}`
                )
              "
            />
          </div>
        </div> -->
        <div class="form-row">
          <div class="col-12">
            <Upload :size="300" :fileTypes="['image/*']" ref="uf">
              <template #header="{ addImage }">
                <label for="" class="form-label"
                  >รูปภาพ<span style="color: lightgray; font-size: 10px"
                    >(ขนาดไม่เกิน 300 kb)</span
                  >
                  <span class="text-primary" @click="addImage()" style="cursor: pointer"
                    ><i class="fas fa-camera"></i></span
                ></label>
              </template>
            </Upload>
          </div>
        </div>
        <div class="form-row">
          <div class="col-12">
            <check-box
              label="ความสำคัญของปัญหา"
              class="detail"
              :obj="piorityOpts"
              :v="v.piority"
            ></check-box>
          </div>
        </div>
        <div class="form-row">
          <div class="col-12 col-md-4">
            <date-time label="วันเวลารับแจ้ง" :v="v.datetime"> </date-time>
          </div>
          <Text
              label="เลขที่ปัญหาอ้างอิง:"
              :v="v.ref_jobid"
            ></Text>
        </div>
        <div class="form-row">
          <div class="col-12 text-center">
            <button class="btn btn-outline-primary mr-2 w-25" type="submit">
              บันทึก<i class="fas fa-save float-right"></i>
            </button>
            <button class="btn btn-outline-danger mr-2 w-25" type="reset" @click="reset()">
              ยกเลิก<i class="fas fa-redo-alt float-right"></i>
            </button>
            <button class="btn btn-outline-secondary w-25"  @click="$router.replace({path:`/inform/followup`})">
              หน้าหลัก<i class="fas fa-arrow-left float-left"></i>
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
.detail label {
  text-indent: 5px !important;
  color: rgb(14, 143, 143) !important;
}
.detail::before {
  content: "  ";
}
</style>
<script setup>
import VSelect from "../../../components/form/SelectComponent2.vue";
import CheckBox from "../../../components/form/CheckboxComponent.vue";
import TextArea from "../../../components/form/TextAreaComponent.vue";
import Text from "../../../components/form/InputComponent.vue";
import DateTime from "../../../components/form/DateComponent3.vue";
import {useFollowupNewJob} from "./followup-newjob"

const{
    v,
    rawtel,
    custptypes,
    provinces,
    custpcodes,
    appgroups,
    appsub1s,
    appsub2s,
    appsub3s,
    piorityOpts,
    changePtype,
    changeProvince,
    changePcode,
    changeGroup,
    changeSub1,
    changeSub2,
    open,
    reset,
    submit,
  }=useFollowupNewJob()
</script>
