/* eslint-disable */
import axios from "axios";

const isAuthenticated = async () => {
  try {
    const response = await axios.post(
      `/api/verify-auth`,
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
