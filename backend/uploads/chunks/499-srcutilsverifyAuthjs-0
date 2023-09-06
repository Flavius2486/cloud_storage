/* eslint-disable */
import axios from "axios";
import config from "@/config.json";

const isAuthenticated = async () => {
  try {
    const response = await axios.get(
      `${config.BASE_URL}/verify-auth`,
      {
        headers: {
          authorization: window.$cookies.get("accessToken"),
        },
      },
      {
        withCredentials: true,
      }
    );
    return response.data.auth;
  } catch (err) {
    throw err;
  }
};

export default isAuthenticated;
