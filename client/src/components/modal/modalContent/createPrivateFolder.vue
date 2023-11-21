<template>
  <div>
    <p class="modal-subtitle">Name</p>
    <input
      type="text"
      class="private-folder-name-input input-field"
      @change="hideError()"
    />
  </div>
  <div @click="getAvailablePaths()">
    <p class="modal-subtitle">Location</p>
    <v-select
      :options="availablePaths"
      class="private-folder-path-selector selector"
      label="frontend_path"
      value="unique_path"
      v-model="selectedPrivateFolderPath"
    >
    </v-select>
  </div>
  <div class="create-private-folder-btn modal-btn" @click="createFolder()">
    Create
  </div>
</template>

<script>
import axios from "axios";
import "@/components/modal/modalContent/style.css";

export default {
  name: "create-private-folder",
  emits: ["hide-modal", "update-data"],
  data() {
    return {
      selectedPrivateFolderPath: "",
      availablePaths: [],
    };
  },
  methods: {
    hideError() {
      const folderNameInput = document.querySelector(
        ".private-folder-name-input"
      );
      folderNameInput.style.borderColor = "#CDCDD6";
    },
    getAvailablePaths() {
      axios
        .post(
          `/api/fetch-data`,
          {
            dataCategory: "folders",
          },
          { withCredentials: true }
        )
        .then((response) => {
          this.availablePaths = response.data.dataArray;
        });
    },
    createFolder() {
      const folderNameInput = document.querySelector(
        ".private-folder-name-input"
      );
      const folderPathInput = document.querySelector(
        ".private-folder-path-selector"
      );
      let folderName = folderNameInput.value;

      if (
        folderName.length === 0 ||
        this.selectedPrivateFolderPath.length === 0
      ) {
        if (folderName.length === 0) {
          folderNameInput.style.borderColor = "red";
        }
        if (this.selectedPrivateFolderPath.length === 0) {
          folderPathInput.style.borderColor = "red";
        }
      } else {
        axios
          .post(
            `/api/create-folder`,
            {
              isPublic: false,
              name: folderName,
              uniquePath: this.selectedPrivateFolderPath.unique_path,
              frontendPath: this.selectedPrivateFolderPath.frontend_path.slice(
                1,
                -1
              ),
            },
            { withCredentials: true }
          )
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
    selectedPrivateFolderPath(newVal) {
      if (newVal.length !== 0) {
        document.querySelector(
          ".private-folder-path-selector"
        ).style.borderColor = "transparent";
      }
    },
  },
};
</script>
