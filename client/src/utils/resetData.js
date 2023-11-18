import axios from "axios";
import config from "@/config.json";

const resetData = () => {
  axios
    .post(`${config.BASE_URL}/reset-data`, {}, { withCredentials: true })
    .then(() => {})
    .catch((err) => {
      throw err;
    });
};

export default resetData;
