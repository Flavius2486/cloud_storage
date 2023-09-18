import axios from "axios";
import config from "@/config.json";

const autoDeleteData = () => {
  axios
    .post(`${config.BASE_URL}/auto-delete-data`, {}, { withCredentials: true })
    .then(() => {})
    .catch((err) => {
      console.log(err);
    });
};

export default autoDeleteData;
