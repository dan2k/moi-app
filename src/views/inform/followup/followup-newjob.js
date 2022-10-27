import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { ref, computed, onMounted } from "vue";
import { api, errAlert, okAlert } from "@/helper";
import { useRouter } from "vue-router";
import { useUpload } from "@/plugins/fileupload";
import { useFollowup } from "./followup";
export const useFollowupNewJob = () => {
  const router = useRouter();

  const {
    auth,
    getCustptype,
    getProvince,
    open,
    padL,
    getCustpcode,
    getAppGroup,
    getSub1,
    getSub2,
    getSub3,
  } = useFollowup();
  const { files } = useUpload();
  files.value.length = 0;
  const sectid = auth.place_type == "R" ? auth.sect_id.substring(1, 2) : "0";
  const empid = auth.emp_id;
  const custpcode = ref([]);
  const custpcodes = ref([]);
  const appgroups = ref([]);
  const appgid = ref(null);
  const appsub1s = ref([]);
  const appsub1id = ref(null);
  const appsub2s = ref([]);
  const appsub2id = ref(null);
  const appsub3s = ref([]);
  const appsub3id = ref(null);
  const piority = ref([]);
  const piorityOpts = ref([{ value: "1", label: "ความสำคัญเร่งด่วน" }]);
  const detail = ref(null);
  const custptype = ref(null);
  const custptypes = ref([]);
  const provinces = ref([]);
  const province = ref(null);
  const username = ref(null);
  const tel = ref(null);
  const rawtel = ref("");
  const datetime = ref(new Date());

  const rules = computed(function () {
    let tmp = {
      custpcode: {},
      appgid: {},
      appsub1id: {},
      appsub2id: {},
      appsub3id: {},
      piority: {},
      detail: {},
      province: {},
      custptype: {},
      username: { required: helpers.withMessage("ห้ามเป็นค่าว่าง", required) },
      tel: { required: helpers.withMessage("ห้ามเป็นค่าว่าง", required) },
      datetime: { required: helpers.withMessage("ห้ามเป็นค่าว่าง", required) },
    };
    tmp.custptype = {
      required: helpers.withMessage("ห้ามเป็นค่าว่าง", required),
    };
    tmp.province = {
      required: helpers.withMessage("ห้ามเป็นค่าว่าง", required),
    };
    tmp.custpcode = {
      required: helpers.withMessage("ห้ามเป็นค่าว่าง", required),
    };
    tmp.appgid = {
      required: helpers.withMessage("ห้ามเป็นค่าว่าง", required),
    };
    tmp.detail = {
      required: helpers.withMessage("ห้ามเป็นค่าว่าง", required),
    };

    if (appsub1s.value.length > 0 && appgroups.value.length > 0) {
      tmp.appsub1id = {
        required: helpers.withMessage("ห้ามเป็นค่าว่าง", required),
      };
    }
    if (appsub2s.value.length > 0 && appsub1s.value.length > 0) {
      tmp.appsub2id = {
        required: helpers.withMessage("ห้ามเป็นค่าว่าง", required),
      };
    }
    if (
      appsub3s.value.length > 0 &&
      appsub2s.value.length > 0 &&
      appsub1s.value.length > 0
    ) {
      tmp.appsub3id = {
        required: helpers.withMessage("ห้ามเป็นค่าว่าง", required),
      };
    }
    return tmp;
  });
  const v = useVuelidate(rules, {
    custpcode,
    appgid,
    appsub1id,
    appsub2id,
    appsub3id,
    piority,
    detail,
    custptype,
    province,
    username,
    tel,
    datetime,
  });

  const changePtype = async (opt) => {
    provinces.value = await getProvince(opt);
    province.value = null;
    custpcode.value = null;
    custpcodes.value.length = 0;
    appgid.value = null;
    appgroups.value.length = 0;
    appsub1id.value = null;
    appsub1s.value.length = 0;
    appsub2id.value = null;
    appsub2s.value.length = 0;
    appsub3id.value = null;
    appsub3s.value.length = 0;
  };
  const changeProvince = async (opt) => {
    custpcodes.value = await getCustpcode(custptype.value, opt);
    custpcode.value = null;
    appgid.value = null;
    appgroups.value.length = 0;
    appsub1id.value = null;
    appsub1s.value.length = 0;
    appsub2id.value = null;
    appsub2s.value.length = 0;
    appsub3id.value = null;
    appsub3s.value.length = 0;
  };
  const changePcode = async () => {
    let user = custpcodes.value.filter((ob) => String(ob.id) === String(custpcode.value));
    appgroups.value = await getAppGroup(user[0].cust_user);
    appgid.value = null;
    appsub1id.value = null;
    appsub1s.value.length = 0;
    appsub2id.value = null;
    appsub2s.value.length = 0;
    appsub3id.value = null;
    appsub3s.value.length = 0;
  };
  const changeGroup = async (opt) => {
   
    appsub1s.value = await getSub1(opt);
    appsub1id.value = null;
    appsub2id.value = null;
    appsub2s.value.length = 0;
    appsub3id.value = null;
    appsub3s.value.length = 0;
  };
  const changeSub1 = async (opt) => {
    appsub2s.value = await getSub2(opt);
    appsub2id.value = null;
    appsub3id.value = null;
    appsub3s.value.length = 0;
  };
  const changeSub2 = async (opt) => {
    appsub3s.value = await getSub3(opt);
    appsub3id.value = null;
  };
  const reset = () => {
    let state = [
      "custpcode",
      "appgid",
      "appsub1id",
      "appsub2id",
      "appsub3id",
      "piority",
      "custptype",
      "province",
      "username",
      "tel",
      "datetime",
    ];

    state.forEach((k) => {
      switch (k) {
        case "custptype":
          custpcode.value = null;
          break;
        case "province":
          province.value = null;
          provinces.value.length = 0;
          break;
        case "custpcode":
          custpcode.value = null;
          custpcodes.value.length = 0;
          break;
        case "appgid":
          appgid.value = null;
          break;
        case "appsub1id":
          appsub1id.value = null;
          appsub1s.value.length = 0;
          break;
        case "appsub2id":
          appsub2id.value = null;
          appsub2s.value.length = 0;
          break;
        case "appsub3id":
          appsub3id.value = null;
          appsub3s.value.length = 0;
          break;
        case "piority":
          piority.value = [];
          break;
        case "username":
          username.value = null;
          break;
        case "tel":
          tel.value = null;
          break;
        case "datetime":
          datetime.value = null;
          break;
        default:
      }
    });
    // custpcode.value = job.value.cust_pcode;
    // detail.value = job.value.job_desc;
    files.value.length = 0;
    v.value.$reset();
  };
  const submit = async () => {
    v.value.$touch();
    if (v.value.$error) return;
    const formData = new FormData();

    //clear null objects
    files.value = files.value.filter((ob, i) => ob.url);
    for (let i = 0; i < files.value.length; i++) {
      formData.append("file_" + i, files.value[i].obj.files[0]);
    }
    // formData.append("jobid", job.value.job_id);
    formData.append("detail", detail.value);
    formData.append("empid", empid);
    formData.append("sectid", sectid);
    formData.append("custptype", custptype.value);
    formData.append("custpcode", custpcode.value);
    formData.append("appgid", appgid.value ? appgid.value : "");
    formData.append("appsub1id", appsub1id.value ? appsub1id.value : "");
    formData.append("appsub2id", appsub2id.value ? appsub2id.value : "");
    formData.append("appsub3id", appsub3id.value ? appsub3id.value : "");
    formData.append("piority", piority.value.lenth > 0 ? 1 : 0);
    formData.append("username", username.value);
    formData.append("tel", rawtel.value);
    let dt = datetime.value;
    dt = `${dt.getFullYear()}-${padL(dt.getMonth() + 1)}-${padL(
      dt.getDate()
    )} ${padL(dt.getHours())}:${padL(dt.getMinutes())}:${padL(
      dt.getSeconds()
    )}`;
    formData.append("datetime", dt);

    try {
      let rs = await api.post(`/inform/v2/newJob`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      okAlert(rs.data.msg, () => {
        router.replace({ path: `/inform/followup/${rs.data.jobid}/detail` });
      });
    } catch (err) {
      errAlert(err);
    }
  };

  onMounted(async () => {
    custptypes.value = await getCustptype();
  });
  return {
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
  }
};
