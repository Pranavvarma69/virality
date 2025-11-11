import axios from "axios";

export const AnalyticsData=async()=>{
    const res=await axios.get("/api/analytics");
    return res.data;
};
