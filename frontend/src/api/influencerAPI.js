import axios from "axios";
const getAuthConfig = () => {
  const userInfo = localStorage.getItem("userInfo");
  if (!userInfo) return {};
  const token = JSON.parse(userInfo).token;
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getInfluencers=async()=>{
    const res=await axios.get("/api/influencers",getAuthConfig());
    return res.data
}
export const gettopinfluencers = async () => {
  const res = await axios.get("/api/influencers/top");
  return res.data;
};