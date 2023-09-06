import axios from "axios";
import store from "@/store";
import config from "@/config.json";

const fetchData = () => {
  axios
    .get(`${config.BASE_URL}/fetch-data`, { withCredentials: true })
    .then((response) => {
      store.commit("setData", {
        data: {
          rootData: response.data.rootData,
          folders: response.data.folders,
          deletedData: response.data.deletedData,
          recentData: response.data.recentData,
          publicData: response.data.publicData,
          starredData: response.data.starredData,
        },
      });
    });
};

export default fetchData;
