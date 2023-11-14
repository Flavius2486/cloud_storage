import axios from "axios";
import config from "@/config.json";

const resetData = () => {
  axios
    .post(
      `${config.BASE_URL}/reset-data`,
      {
        accessToken: window.$cookies.get("accessToken"),
        refreshToken: window.$cookies.get("refreshToken"),
      },
      { withCredentials: true }
    )
    .then(() => {})
    .catch((err) => {
      throw err;
    });
};

export default resetData;
