import axios from "axios";

const autoDeleteData = () => {
  axios
    .post(`/api/auto-delete-data`, {}, { withCredentials: true })
    .then(() => {})
    .catch((err) => {
      console.log(err);
    });
};

export default autoDeleteData;
