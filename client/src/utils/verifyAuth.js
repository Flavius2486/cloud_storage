/* eslint-disable */
import axios from "axios";
import config from "@/config.json";

const isAuthenticated = async () => {
  try {
    const response = await axios.post(
      `${config.BASE_URL}/verify-auth`,
      {},
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
