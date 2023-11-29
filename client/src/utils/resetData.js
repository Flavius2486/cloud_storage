import axios from "axios";

const resetData = () => {
  axios
    .post(`${import.meta.env.VITE_API_URL}/reset-data`, {}, { withCredentials: true })
    .then(() => {})
    .catch((err) => {
      throw err;
    });
};

export default resetData;
