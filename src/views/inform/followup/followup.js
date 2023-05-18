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
  const getCustpcode2 = async (custptype,pv) => {
    console.log(pv)
    try {
      let rs = await api.get(`/inform/v2/getCustpcode2/${custptype}/${pv}`);
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
  let status= [
    {
      id: 0,
      title: "ทั้งหมด",
      color: "black",
      state: true,
      count: 0,
      status: -1,
      desc:"",
    },
    {
      id: 1,
      title: "งานใหม่",
      color: "red",
      state: false,
      count: 0,
      status: 99,
      desc:"",
    },
    {
      id: 2,
      title: "กำลังตรวจสอบ",
      color: "orange",
      state: false,
      count: 0,
      status: 0,
      desc:"",
    },
    // { id: 1, title: "ดำเนินการเรียบร้อยแล้ว" },

    {
      id: 3,
      title: "ส่งกลับเพื่อตรวจสอบ",
      color: "#5900b3",
      state: false,
      count: 0,
      status: 4,
      desc:"",
    },
    {
      id: 4,
      title: "ปรึกษาส่วนกลาง",
      color: "#fa39d7",
      state: false,
      count: 0,
      status: 5,
      desc:"",
    },
    {
      id: 5,
      title: "รอส่วนกลางตรวจสอบ",
      color: "#704802",
      state: false,
      count: 0,
      status: 3,
      desc:"",
    },
    {
      id: 6,
      title: "ส่งกลับส่วนกลาง",
      color: "#9c0676",
      state: false,
      count: 0,
      status: 6,
      desc:"",
    },
    {
      id: 7,
      title: "สรุปผล",
      color: "#1664e0",
      state: false,
      count: 0,
      status: 7,
      desc:"",
    },
    {
      id: 8,
      title: "กำลังแก้ไขโปรแกรม",
      color: "#2ca108",
      state: false,
      count: 0,
      status: 2,
      desc:"",
    },
    {
      id: 9,
      title: "แก้ไขข้อมูล",
      color: "#1e967c",
      state: false,
      count: 0,
      status: 8,
      desc:"",
    },
    {
      id: 10,
      title: "ทดสอบโปรแกรม",
      color: "#486660",
      state: false,
      count: 0,
      status: 9,
      desc:"",
    },
  ];
  return {
    auth,
    getJobDetail,
    checkSpecialUser,
    getPic,
    getCustptype,
    getProvince,
    getCustpcode,
    getCustpcode2,
    getAppGroup,
    getSub1,
    getSub2,
    getSub3,
    getRemark,
    getComment,
    getCommentPic,
    open,
    padL,
    status,

  };
};
