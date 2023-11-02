import axios from "axios";
import store from "@/store";
import config from "@/config.json";

const fetchData = () => {
  axios
    .get(`${config.BASE_URL}/fetch-data`, { withCredentials: true })
    .then((response) => {
      store.commit("setDataStatus", { state: true });
      store.commit("setData", {
        data: {
          dashboardData: response.data.rootData,
          folders: response.data.folders,
          deletedData: response.data.deletedData,
          recentData: response.data.recentData,
          publicData: response.data.publicData,
          starredData: response.data.starredData,
          freeMemory: response.data.freeMemory,
          usedMemory: response.data.usedMemory,
        },
      });
    });
};

export default fetchData;
