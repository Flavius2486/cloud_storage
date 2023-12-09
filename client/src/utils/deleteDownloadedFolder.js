import axios from "axios";

const deleteDownloadedFolder = async (folderName) => {
  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/delete-downloaded-folder`,
      {
        folderName: folderName,
      },
      { withCredentials: true }
    );
  } catch (error) {
    console.error("Error deleting remaining folder:", error);
  }
};

export default deleteDownloadedFolder;
