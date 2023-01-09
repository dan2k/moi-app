import { ref,onMounted } from "vue";
import { api, okAlert,confAlert } from "@/helper";
import { useRoute } from "vue-router";

import { useFollowup } from "./followup";
export const useFollowupDetail = () => {
  const { auth, getJobDetail,checkSpecialUser, getPic, open, getComment, getCommentPic,status } =    useFollowup();
  const route = useRoute();
  const empid = auth.emp_id;
  const placetype = auth.place_type;
  const sectid = auth.place_type == "R" ? auth.sect_id.substring(1, 2) : "0";
  const comments = ref([]);
  const commentObj = ref([]);
  const job = ref({});
  const pics = ref([]);
  const isSpecial=ref(false);
  const sendCenter = async () => {
    let rs=await confAlert('คุณต้องการส่งปัญหาปรึกษาส่วนกลางหรือไม่')
    if(!rs.isConfirmed){
      return
    }
    try {
      let rs = await api.put(`/inform/v2/sendCenter`, {
        empid,
        jobid: route.params.jobid,
      });
      okAlert(rs.data.msg, () => {
        init();
      });
    } catch (err) {
      errAlert(err);
    }
  };
  const check = async () => {
    //ส่วนกลางกดปุ่มรอตรวจสอบ
    try {
      let rs = await api.put(`/inform/v2/check`, {
        empid,
        jobid: route.params.jobid,
      });
      okAlert(rs.data.msg, () => {
        init();
      });
    } catch (err) {
      errAlert(err);
    }
  };

  const init = async () => {
    job.value = await getJobDetail(route.params.jobid);
    pics.value = await getPic(route.params.jobid);
    commentObj.value = await getCommentPic(route.params.jobid);
    comments.value = await getComment(route.params.jobid);
    comments.value.map((ob, i) => {
      ob["pics"] = commentObj.value.filter(
        (ob2, i) => ob2.comment_id == ob.comment_id
      );
      return ob;
    });
    isSpecial.value=await checkSpecialUser(job.value.cust_user)
    job.value.color=status.filter(
      (it, i) => Number(it.status) === Number(job.value.job_status)
    )[0]['color'];
  };
  onMounted(async () => {
    await init();
  });
  return {
    placetype,
    comments,
    job,
    pics,
    sectid,
    isSpecial,
    init,
    sendCenter,
    check,
    open,
  };
};
