import axios from "axios";

const refreshToken = () => {
  axios
    .post(
      `/api/refresh-token`,
      {},
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
