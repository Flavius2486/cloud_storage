import axios from "axios";

const resetData = () => {
  axios
    .post(`/api/reset-data`, {}, { withCredentials: true })
    .then(() => {})
    .catch((err) => {
      throw err;
    });
};

export default resetData;
