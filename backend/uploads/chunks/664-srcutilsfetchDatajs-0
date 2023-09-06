import axios from "axios";
import store from "@/store";
import config from "@/config.json";

const fetchData = () => {
  axios
    .get(`${config.BASE_URL}/fetch-data`, { withCredentials: true })
    .then((response) => {
      store.commit("setData", {
        data: {
          notNestedFiles: response.data.notNestedFiles,
          // nestedFiles: response.data.nestedFiles,
          deletedFiles: response.data.deletedFiles,
          recentFiles: response.data.recentFiles,
          publicFiles: response.data.publicFiles,
          starredFiles: response.data.starredFiles,
        },
      });
    });
};

export default fetchData;
