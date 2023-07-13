<template>
  <div class="dashboard-view__header">
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
          @click="uploadFiles($event)"
          >File</DropdownOption
        >
        <DropdownOption
          class="upload-folders"
          :icon="['fas', 'folder-open']"
          :typeInput="true"
          @click="uploadFolders($event)"
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
  </div>
</template>

<script>
import Dropdown from "@/components/dropdown/dropdown.vue";
import DropdownOption from "@/components/dropdown/dropdownOption";

export default {
  components: {
    Dropdown,
    DropdownOption,
  },
  data() {
    return {};
  },
  methods: {
    uploadFiles() {
      const fileInput = document.querySelector(".upload-files input");
      fileInput.click();
    },
    uploadFolders() {
      const foldersInput = document.querySelector(".upload-folders input");
      foldersInput.click();
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
.dashboard-view__header {
  padding: 25px 25px;
  background-color: #f7f8fb;
}

.dashboard-view__header > h1 {
  color: #404254;
  font-size: 30px;
}

.dashboard-view__header--buttons {
  margin-top: 10px;
  display: flex;
}

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
/*
.dashboard-view__upload-asets--dropdown,
.dashboard-view__create-folder--dropdown {
  min-width: 160px;
  position: absolute;
  z-index: 99999;
  margin-top: 45px;
  color: #141323;
  border: 1px solid #e5e4e4;
  border-radius: 10px;
  box-shadow: 0 2px 4px 0px #d2d2d4;
  background-color: #ffffff;
  animation: growDown 300ms ease-in-out;
  user-select: none;
}

.dashboard-view__create-folder--dropdown {
  margin-left: 140px;
}

.dashboard-view__upload-asets--dropdown > :first-child,
.dashboard-view__create-folder--dropdown > :first-child {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.dashboard-view__upload-asets--dropdown > :last-child,
.dashboard-view__create-folder--dropdown > :last-child {
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
*/
/*
.dropdown-option {
  font-size: 17px;
  color: #141323;
  padding: 5px 10px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
}

.dropdown-option p {
  margin-left: 10px;
}

.dropdown-option:hover {
  background-color: #e7e9ef;
}*/
</style>
