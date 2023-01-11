import { api, errAlert } from "@/helper";
export const useLogbook = () => {
  const getSubject = async () => {
    try {
      let rs = await api.get(`/inform/v3/getSubject`);
      return rs.data.data;
    } catch (err) {
      errAlert(err);
    }
  };
  const getEmpCenterResp=async (jobid)=>{
    try{
      let rs=await api.get(`/inform/v3/getEmpCenterResp/${jobid}`)
      return rs.data.empid
    }catch(err){
      errAlert(err);
    }
  }
  return {
    getSubject,
    getEmpCenterResp,

  };
};
