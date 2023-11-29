import axios from "axios";

const autoDeleteData = () => {
  axios
    .post(`${import.meta.env.VITE_API_URL}/auto-delete-data`, {}, { withCredentials: true })
    .then(() => {})
    .catch((err) => {
      console.log(err);
    });
};

export default autoDeleteData;
