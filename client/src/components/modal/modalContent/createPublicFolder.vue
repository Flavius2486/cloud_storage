<template>
  <div>
    <p class="modal-subtitle">Name</p>
    <input
      type="text"
      class="public-folder-name-input input-field"
      @change="hideError()"
    />
  </div>
  <div>
    <p class="modal-subtitle">Location</p>
    <v-select
      :options="$store.state.folders"
      class="folder-path-selector selector"
      label="frontend_path"
      value="unique_path"
      v-model="selectedPublicFolderPath"
    >
    </v-select>
  </div>
  <div class="create-folder-btn modal-btn" @click="createFolder()">Create</div>
</template>

<script>
import axios from "axios";
import config from "@/config.json";

import "@/components/modal/modalContent/style.css";

export default {
  name: "create-spublic-folder",
  emits: ["hide-modal", "update-data"],
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
      const folderPathInput = document.querySelector(".folder-path-selector");
      let folderName = folderNameInput.value;

      if (
        folderName.length === 0 ||
        this.selectedPublicFolderPath.length === 0
      ) {
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
          .then((response) => {
            this.$emit("update-data");
            this.$emit("hide-modal", response.data);
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
