<template>
  <header class="dashboard-view__header">
    <h1>Dashboard</h1>
    <div class="dashboard-view__header--buttons">
      <div
        class="dashboard-view__upload-asets--button dropdown-upload"
        @click="showDropdown($event)"
      >
        <fa :icon="['fas', 'upload']" class="dropdown-upload" />
        <p class="dropdown-upload">Upload</p>
        <fa
          :icon="['fas', 'chevron-down']"
          class="dashboard-view__header--buttons__down-arrow--icon dropdown-upload"
        />
      </div>
      <Dropdown
        :customClass="'dropdown-upload'"
        :style="{ marginTop: '45px', marginLeft: '0' }"
      >
        <DropdownOption
          class="upload-files"
          :icon="['fas', 'file']"
          :typeInput="true"
          @click="uploadFilesBtn($event)"
          @change="uploadFiles()"
          >File</DropdownOption
        >
        <DropdownOption
          class="upload-folders"
          :icon="['fas', 'folder']"
          :typeInput="true"
          @click="uploadFoldersBtn($event)"
          >Folder</DropdownOption
        >
      </Dropdown>
      <div
        class="dashboard-view__create-folder--button dropdown-create-folder"
        @click="showDropdown($event)"
      >
        <fa :icon="['fas', 'plus']" class="dropdown-create-folder" />
        <p class="dropdown-create-folder">Create</p>
        <fa
          :icon="['fas', 'chevron-down']"
          class="dashboard-view__header--buttons__down-arrow--icon dropdown-create-folder"
        />
      </div>
      <Dropdown
        :customClass="'dropdown-create-folder'"
        :style="{ marginTop: '45px', marginLeft: '140px' }"
      >
        <DropdownOption :icon="['fas', 'folder-plus']">Folder</DropdownOption>
        <DropdownOption :icon="['fas', 'folder-open']"
          >Public Folder</DropdownOption
        >
      </Dropdown>
    </div>
  </header>
  <AsetsWrapper></AsetsWrapper>
</template>

<script>
import Resumable from "resumablejs";

import config from "@/config.json";
import Dropdown from "@/components/dropdown/dropdown.vue";
import DropdownOption from "@/components/dropdown/dropdownOption";
import AsetsWrapper from "@/components/asetsWrapper";

export default {
  components: {
    Dropdown,
    DropdownOption,
    AsetsWrapper,
  },
  data() {
    return {
      files: [],
      resumable: null,
    };
  },
  mounted() {
    this.resumable = new Resumable({
      target: `${config.BASE_URL}/upload`, // Your server endpoint
      chunkSize: 1 * 1024 * 1024, // 1MB chunk size (adjust as needed)
      simultaneousUploads: 4, // Number of simultaneous uploads (adjust as needed)
      testChunks: false, // Set to true to test/retry broken chunks (optional)
    });

    this.resumable.on("fileAdded", (file) => {
      this.files.push(file);
    });

    this.resumable.on("fileSuccess", (file, message) => {
      console.log(message);
    });

    this.resumable.on("progress", () => {});
  },
  methods: {
    uploadFilesBtn() {
      const fileInput = document.querySelector(".upload-files input");
      fileInput.click();
    },

    uploadFoldersBtn() {
      const foldersInput = document.querySelector(".upload-folders input");
      foldersInput.click();
    },

    uploadFiles() {
      document.querySelectorAll(".upload-files input").forEach((input) => {
        if (input.files.length > 0) {
          this.files.push(...input.files);
        }
      });
      this.files.forEach((file) => {
        this.resumable.addFile(file);
      });
      this.resumable.upload();
      this.files = [];
    },

    showDropdown(event) {
      const dropdowns = document.querySelectorAll(".dropdown");
      dropdowns.forEach((dropdown) => {
        dropdown.classList.add("hidden");
        if (event.target.classList.contains(dropdown.classList[0]))
          setTimeout(() => {
            dropdown.classList.remove("hidden");
          }, 100);
      });
    },
  },
};
</script>

<style>
/*---------------Dashboard header------------------*/

.dashboard-view__header {
  padding: 25px;
  background-color: #f7f8fb;
}

.dashboard-view__header > h1 {
  color: #333343;
  font-size: 30px;
}

.dashboard-view__header--buttons {
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
}

/* header buttons */

.dashboard-view__upload-asets--button,
.dashboard-view__create-folder--button {
  display: flex;
  align-items: center;
  justify-content: space-around;
  font-size: 17px;
  border-radius: 10px;
  border: none;
  padding: 5px 10px;
  background-color: #4b59fb;
  color: #f7f8fb;
  user-select: none;
}

.dashboard-view__upload-asets--button p,
.dashboard-view__create-folder--button p {
  margin: 0 10px;
}

.dashboard-view__header--buttons__down-arrow--icon {
  font-size: 15px;
}

.dashboard-view__create-folder--button {
  margin-left: 10px;
  background-color: #f7f8fb;
  color: #464141;
  border: 2px solid #4b59fb;
}

.dashboard-view__create-folder--button p {
  color: #141323;
}
</style>
