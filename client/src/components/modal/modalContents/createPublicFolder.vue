<template>
  <p class="modal-error">Fill all the fields</p>
  <div>
    <p class="modal-subtitle">Name</p>
    <input type="text" class="public-folder-name-input" @change="hideError" />
  </div>
  <div>
    <p class="modal-subtitle">Location</p>
    <v-select
      :options="$store.state.folders"
      class="folder-path-selector"
      label="frontend_path"
      value="unique_path"
      v-model="selectedPublicFolderPath"
    >
    </v-select>
  </div>
  <div class="create-folder-btn" @click="createFolder()">Create</div>
</template>

<script>
import axios from "axios";
import fetchData from "@/utils/fetchData";
import config from "@/config.json";

export default {
  name: "create-spublic-folder",
  emits: ["hide-modal"],
  data() {
    return {
      selectedPublicFolderPath: "",
    };
  },
  methods: {
    hideError() {
      const folderNameInput = document.querySelector(
        ".public-folder-name-input"
      );
      folderNameInput.style.borderColor = "#CDCDD6";
    },
    createFolder() {
      const folderNameInput = document.querySelector(
        ".public-folder-name-input"
      );
      const modalError = document.querySelector(".modal-error");
      const folderPathInput = document.querySelector(".folder-path-selector");
      let folderName = folderNameInput.value;

      if (
        folderName.length === 0 ||
        this.selectedPublicFolderPath.length === 0
      ) {
        modalError.style.color = "red";
        if (folderName.length === 0) {
          folderNameInput.style.borderColor = "red";
        }
        if (this.selectedPublicFolderPath.length === 0) {
          folderPathInput.style.borderColor = "red";
        }
      } else {
        axios
          .post(`${config.BASE_URL}/create-folder`, {
            accessToken: window.$cookies.get("accessToken"),
            isPublic: true,
            name: folderName,
            uniquePath: this.selectedPublicFolderPath.unique_path,
            frontendPath: this.selectedPublicFolderPath.frontend_path.slice(
              1,
              -1
            ),
          })
          .then(() => {
            modalError.style.color = "transparent";
            fetchData();
            this.$emit("hide-modal");
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
  watch: {
    selectedPublicFolderPath(newVal) {
      if (newVal.length !== 0) {
        document.querySelector(".folder-path-selector").style.borderColor =
          "transparent";
      }
    },
  },
};
</script>

<style scoped>
.folder-path-selector {
  min-width: 200px;
  width: 100%;
  border: 1px solid transparent;
  border-radius: 5px;
}

.folder-name-input,
.public-folder-name-input {
  height: 32px;
  min-width: 200px;
  width: 100%;
  border-radius: 5px;
  border: 1px solid rgb(205, 205, 214);
  margin-bottom: 5px;
  padding: 7px;
  font-size: 16px;
}

.modal-subtitle {
  font-size: 15px;
}

.folder-name-input:focus {
  outline-width: 0;
}

.create-folder-btn {
  width: 100%;
  height: 30px;
  background-color: #5a93ed;
  color: white;
  margin-top: 10px;
  border-radius: 4px;
  display: grid;
  place-items: center;
  user-select: none;
}

.create-folder-btn:hover {
  background-color: #3878e0;
}

.modal-error {
  font-size: 15px;
  color: transparent;
  margin: 0;
  padding: 0;
}
</style>
