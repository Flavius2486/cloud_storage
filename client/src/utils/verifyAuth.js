/* eslint-disable */
import axios from "axios";
import config from "@/config.json";

const isAuthenticated = async () => {
  try {
    const response = await axios.get(`${config.BASE_URL}/login`, {
      headers: {
        Authorization: `Bearer ${window.$cookies.get("jwt")}`,
      },
    });
    return response.data.auth;
  } catch (err) {
    throw err;
  }
};

export default isAuthenticated;
