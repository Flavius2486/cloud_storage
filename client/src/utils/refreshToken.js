import axios from "axios";
import config from "@/config.json";

const refreshToken = () => {
  axios
    .post(
      `${config.BASE_URL}/refresh-token`,
      {
        accessToken: window.$cookies.get("accessToken"),
        refreshToken: window.$cookies.get("refreshToken"),
      },
      {
        withCredentials: true,
      }
    )
    .then(() => {})
    .catch((err) => {
      console.log(err);
    });
};

export default refreshToken;
