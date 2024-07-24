import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { ref, computed, onMounted } from "vue";
import { api, errAlert, okAlert } from "@/helper";
import { useRoute, useRouter } from "vue-router";
import { useUpload } from "@/plugins/fileupload";
import { useFollowup } from "./followup";
export const useFollowupReceive = () => {
  const route = useRoute();
  const router = useRouter();

  const {
    getJobDetail,
    getPic,
    getCustpcode3,
    getAppGroup2,
    getAppGroup,
    getSub1,
    getSub2,
    getSub3,
    open,
    auth,
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
  const job = ref({});
  const pics = ref([]);
  const detail = ref(null);

  const rules = computed(function () {
    let tmp = {
      custpcode: {},
      appgid: {},
      appsub1id: {},
      appsub2id: {},
      appsub3id: {},
      piority: {},
      detail: {},
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
  });
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
    ];

    state.forEach((k) => {
      switch (k) {
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
        default:
      }
    });
    custpcode.value = job.value.cust_pcode;
    detail.value = job.value.job_desc;
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
    formData.append("jobid", job.value.job_id);
    formData.append("detail", detail.value);
    formData.append("empid", empid);
    formData.append("sectid", sectid);
    formData.append("custptype", job.value.cust_ptype);
    formData.append("custpcode", custpcode.value);
    formData.append("appgid", appgid.value ? appgid.value : "");
    formData.append("appsub1id", appsub1id.value ? appsub1id.value : "");
    formData.append("appsub2id", appsub2id.value ? appsub2id.value : "");
    formData.append("appsub3id", appsub3id.value ? appsub3id.value : "");
    formData.append("piority", piority.value=="1" ? 1 : 0);
    try {
      let rs = await api.post(`/inform/v2/receiveJob`, formData, {
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
    job.value = await getJobDetail(route.params.jobid);
    pics.value = await getPic(route.params.jobid);
    custpcodes.value = await getCustpcode3(job.value.cust_ptype);
    custpcode.value = job.value.cust_pcode;
    detail.value = job.value.job_desc;
    appgroups.value = await getAppGroup2(job.value.cust_user);
  });
  return {
    v,
    custpcode,
    custpcodes,
    appgroups,
    appsub1s,
    appsub2s,
    appsub3s,
    piorityOpts,
    job,
    pics,
    changeGroup,
    changeSub1,
    changeSub2,
    open,
    reset,
    submit,
  };
};
