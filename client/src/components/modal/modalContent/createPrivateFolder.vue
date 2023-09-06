<template>
  <p class="modal-error">Fill all the fields</p>
  <div>
    <p class="modal-subtitle">Name</p>
    <input
      type="text"
      class="private-folder-name-input"
      @change="hideError()"
    />
  </div>
  <div>
    <p class="modal-subtitle">Location</p>
    <v-select
      :options="$store.state.folders"
      class="private-folder-path-selector"
      label="frontend_path"
      value="unique_path"
      v-model="selectedPrivateFolderPath"
    >
    </v-select>
  </div>
  <div class="create-private-folder-btn" @click="createFolder()">Create</div>
</template>

<script>
import axios from "axios";
import fetchData from "@/utils/fetchData";
import config from "@/config.json";

export default {
  name: "create-private-folder",
  emits: ["hide-modal"],
  data() {
    return {
      selectedPrivateFolderPath: "",
    };
  },
  methods: {
    hideError() {
      const folderNameInput = document.querySelector(
        ".private-folder-name-input"
      );
      folderNameInput.style.borderColor = "#CDCDD6";
    },
    createFolder() {
      const folderNameInput = document.querySelector(
        ".private-folder-name-input"
      );
      const modalError = document.querySelector(".modal-error");
      const folderPathInput = document.querySelector(
        ".private-folder-path-selector"
      );
      let folderName = folderNameInput.value;

      if (
        folderName.length === 0 ||
        this.selectedPrivateFolderPath.length === 0
      ) {
        modalError.style.color = "red";
        if (folderName.length === 0) {
          folderNameInput.style.borderColor = "red";
        }
        if (this.selectedPrivateFolderPath.length === 0) {
          folderPathInput.style.borderColor = "red";
        }
      } else {
        axios
          .post(`${config.BASE_URL}/create-folder`, {
            accessToken: window.$cookies.get("accessToken"),
            isPublic: false,
            name: folderName,
            uniquePath: this.selectedPrivateFolderPath.unique_path,
            frontendPath: this.selectedPrivateFolderPath.frontend_path.slice(
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

<style>
.private-folder-path-selector {
  min-width: 200px;
  width: 100%;
  border: 1px solid transparent;
  border-radius: 5px;
}

.private-folder-name-input {
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

.private-folder-name-input:focus {
  outline-width: 0;
}

.create-private-folder-btn {
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

.create-private-folder-btn:hover {
  background-color: #3878e0;
}

.modal-error {
  font-size: 15px;
  color: transparent;
  margin: 0;
  padding: 0;
}
</style>
