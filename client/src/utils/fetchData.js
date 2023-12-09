import axios from "axios";
import store from "@/store";

const fetchData = async (dataCategory) => {
  store.commit("setDataStatus", { state: false });
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/fetch-data`,
      {
        dataCategory: dataCategory,
      },
      { withCredentials: true }
    );
    store.commit("setDataStatus", { state: true });
    store.commit("setMemoryStatus", {
      data: {
        totalMemory: response.data.totalMemory,
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
