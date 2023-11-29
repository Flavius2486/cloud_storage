import axios from "axios";

const refreshToken = () => {
  axios
    .post(
      `${import.meta.env.VITE_API_URL}/refresh-token`,
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
