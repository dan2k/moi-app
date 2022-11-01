import { api, errAlert, okAlert } from "@/helper";
import { useStore } from "vuex";
export const useFollowup = () => {
  const store = useStore();
  const auth = store.getters["auth/getAuthData"].user[0];
  const getJobDetail = async (jobid) => {
    try {
      let rs = await api.get(`/inform/v2/getJobDetail/${jobid}`);
      return rs.data.data[0];
    } catch (err) {
      errAlert(err);
    }
  };
  const checkSpecialUser= async (custuser)=>{
    try{
      let rs = await api.get(`/inform/v2/checkSpecialUser/${custuser}`);
      return rs.data.isSpecial;
    }catch(err){
      errAlert(err);
    }
  }
  const getPic = async (jobid) => {
    try {
      let rs = await api.get(`/inform/v2/getJobPic/${jobid}`);
      return rs.data.data;
      // console.log(custpcodes.value);
    } catch (err) {
      errAlert(err);
    }
  };
  const getCustptype = async () => {
    // alert(1)
    try {
      let rs = await api.get(`/inform/v2/getCustptype`);
      return rs.data.data;
      // console.log(custpcodes.value);
    } catch (err) {
      errAlert(err);
    }
  };
  const getProvince = async (custptype) => {
    try {
      let rs = await api.get(`/inform/v2/getProvince/${custptype}`);
      return rs.data.data;
      // console.log(custpcodes.value);
    } catch (err) {
      errAlert(err);
    }
  };
  const getCustpcode = async (custptype) => {
    try {
      let rs = await api.get(`/inform/v2/getCustpcode/${custptype}`);
      return rs.data.data;
      // console.log(custpcodes.value);
    } catch (err) {
      errAlert(err);
    }
  };
  const getAppGroup = async (user) => {
    try {
      let rs = await api.get(`/inform/v2/getAppGroup/${user}`);
      return rs.data.data;
      // console.log(custpcodes.value);
    } catch (err) {
      errAlert(err);
    }
  };
  const getSub1 = async (gid) => {
    try {
      let rs = await api.get(`/inform/v2/getSub1/${gid}`);
      return rs.data.data;
      // console.log(custpcodes.value);
    } catch (err) {
      errAlert(err);
    }
  };
  const getSub2 = async (sub1id) => {
    try {
      let rs = await api.get(`/inform/v2/getSub2/${sub1id}`);
      return rs.data.data;
      // console.log(custpcodes.value);
    } catch (err) {
      errAlert(err);
    }
  };
  const getSub3 = async (sub2id) => {
    try {
      let rs = await api.get(`/inform/v2/getSub3/${sub2id}`);
      return rs.data.data;
      // console.log(custpcodes.value);
    } catch (err) {
      errAlert(err);
    }
  };
  const getRemark = async () => {
    try {
      let rs = await api.get(`/inform/v2/getRemark`);
      return rs.data.data;
    } catch (err) {
      errAlert(err);
    }
  };
  const getComment = async (jobid) => {
    try {
      let rs = await api.get(`/inform/v2/getComment/${jobid}`);
      return  rs.data.data;
      // console.table(comments.value);
    } catch (err) {
      errAlert(err);
    }
  };
  const getCommentPic = async (jobid) => {
    try {
      let rs = await api.get(`/inform/v2/getCommentPic/${jobid}`);
      return rs.data.data;
    } catch (err) {
      errAlert(err);
    }
  };
  const open = (url) => {
    window.open(url);
  };
  const padL = (nr, len = 2, chr = `0`) => `${nr}`.padStart(2, chr);
  return {
    auth,
    getJobDetail,
    checkSpecialUser,
    getPic,
    getCustptype,
    getProvince,
    getCustpcode,
    getAppGroup,
    getSub1,
    getSub2,
    getSub3,
    getRemark,
    getComment,
    getCommentPic,
    open,
    padL

  };
};
