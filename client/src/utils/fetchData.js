import axios from "axios";
import store from "@/store";

const fetchData = async (dataCategory) => {
  store.commit("setDataStatus", { state: false });
  try {
    const response = await axios.post(
      `/api/fetch-data`,
      {
        dataCategory: dataCategory,
      },
      { withCredentials: true }
    );
    store.commit("setDataStatus", { state: true });
    store.commit("setMemoryStatus", {
      data: {
        freeMemory: response.data.freeMemory,
        usedMemory: response.data.usedMemory,
      },
    });

    return response.data.dataArray;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export default fetchData;
