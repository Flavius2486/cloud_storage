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
        :style="{ marginTop: '38px', marginLeft: '0' }"
      >
        <DropdownOption
          class="upload-file"
          :icon="['fas', 'file']"
          :type="'file'"
          @click="uploadFilesBtn($event)"
          @change="
            input = 'file';
            uploadFiles($event);
          "
          >File</DropdownOption
        >
        <DropdownOption
          class="upload-folder"
          :icon="['fas', 'folder']"
          :type="'folder'"
          @click="uploadFoldersBtn($event)"
          @change="
            input = 'folder';
            uploadFiles($event);
          "
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
        :style="{ marginTop: '38px', marginLeft: '140px' }"
      >
        <DropdownOption
          :icon="['fas', 'folder-plus']"
          :customClass="'modal-create-folder'"
          @click="showModal($event)"
          >Folder</DropdownOption
        >
        <!-- <DropdownOption
          :icon="['fas', 'folder-open']"
          :customClass="'modal-create-public-folder'"
          @click="showModal($event)"
          >Public Folder</DropdownOption
        > -->
      </Dropdown>
    </div>
  </header>
  <DataWrapper
    :data="data"
    :page="'dashboard'"
    ref="dataWrapper"
    @update-data="updateData()"
  ></DataWrapper>
  <FilesActionStatus
    :status="filesStatus"
    :numberOfFilesToUpload="filesToUpload"
    :numberOfUploadedFiles="uploadedFiles"
  ></FilesActionStatus>
  <MessageBox
    ref="MessageBox"
    :style="{ marginLeft: '15px', bottom: '20px' }"
  ></MessageBox>
  <Modal
    :title="'Create folder'"
    :customClass="'modal-create-folder'"
    ref="Modal"
  >
    <CreatePrivateFolder
      @hide-modal="hideModalTrigger"
      @update-data="updateData()"
    ></CreatePrivateFolder>
  </Modal>
  <!-- <Modal
    :title="'Create public folder'"
    :customClass="'modal-create-public-folder'"
    ref="Modal"
  >
    <CreatePublicFolder @hide-modal="hideModalTrigger"  @update-data="updateData()"></CreatePublicFolder>
  </Modal> -->
</template>

<script>
import Resumable from "resumablejs";

import Dropdown from "@/components/dropdown/dropdown.vue";
import DropdownOption from "@/components/dropdown/dropdownOption";
import DataWrapper from "@/components/dataWrapper";
import FilesActionStatus from "@/components/notifications/filesActionStatus.vue";
import Modal from "@/components/modal/modal.vue";
import CreatePrivateFolder from "@/components/modal/modalContent/createPrivateFolder.vue";
// import CreatePublicFolder from "@/components/modal/modalContent/createPublicFolder.vue";
import MessageBox from "@/components/notifications/messageBox.vue";

import fetchData from "@/utils/fetchData";
import resetData from "@/utils/resetData";

export default {
  components: {
    Dropdown,
    DropdownOption,
    DataWrapper,
    FilesActionStatus,
    Modal,
    CreatePrivateFolder,
    // CreatePublicFolder,
    MessageBox,
  },
  data() {
    return {
      data: [],
      resumable: null,
      filesStatus: null,
      filesToUpload: 0,
      uploadedFiles: 0,
      lastFileAdedIndex: 0,
      uploadedFilesFromGroup: 0,
      filesGroup: [],
      input: "file",
    };
  },
  created() {
    this.updateData();
  },
  mounted() {
    this.resumable = new Resumable({
      target: `/api/upload`,
      testChunks: false,
      chunkSize: 10 * 1024 * 1024,
      simultaneousUploads: 1,
      maxChunkRetries: 5,
      maxFileSize: Infinity,
      minFileSize: 0,
      withCredentials: true,
    });
    this.resumable.on("fileError", (file) => {
      console.error("Error uploading " + file.file.name);
      this.filesStatus = "error";
    });

    this.resumable.on("fileSuccess", () => {
      this.updateData();
      this.uploadedFiles++;
      if (this.uploadedFiles === this.filesToUpload) {
        this.filesStatus = "success";
        this.resumable.files = [];
        this.filesGroup = [];
        this.lastFileAdedIndex = 0;
        this.uploadedFilesFromGroup = 0;
        resetData();
      }

      if (this.filesStatus !== "error") {
        this.uploadedFilesFromGroup++;

        //verify when a files group was added and reset the variables
        if (this.uploadedFilesFromGroup === this.filesGroup.length) {
          this.uploadedFilesFromGroup = 0;
          this.filesGroup = [];
          this.resumable.files = [];
          //call the function again to create another files group if the file group was uploaded and there are still fikes to upload
          if (this.uploadFiles !== this.filesToUpload) {
            this.uploadFiles();
          }
        }
      }
    });

    this.resumable.on("fileProgress", () => {
      this.filesStatus = "uploading";
    });
  },
  methods: {
    updateData() {
      fetchData("dashboard")
        .then((dataArray) => {
          this.data = dataArray;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
    hideModalTrigger(response) {
      this.$refs.Modal.hideModal();
      this.$refs.MessageBox.showMessage(response.message);
    },
    uploadFilesBtn() {
      if (this.filesStatus !== "uploading") {
        const fileInput = document.querySelector(".upload-file input");
        this.reinitializeVariablesFileStatus();
        fileInput.click();
      } else {
        this.$refs.MessageBox.showMessage(
          "Uploading in progress. Please wait..."
        );
      }
    },

    uploadFoldersBtn() {
      if (this.filesStatus !== "uploading") {
        const foldersInput = document.querySelector(".upload-folder input");
        this.reinitializeVariablesFileStatus();
        foldersInput.click();
      } else {
        this.$refs.MessageBox.showMessage(
          "Uploading in progress. Please wait..."
        );
      }
    },

    reinitializeVariablesFileStatus() {
      this.filesStatus = null;
      this.uploadedFiles = 0;
      this.filesToUpload = 0;
    },

    uploadFiles() {
      let fileGroupSize = 0;
      const files = Array.from(
        document.querySelector(`.upload-${this.input} input`).files
      );
      this.filesToUpload = files.length;
      //create files group to prevent using too much memory
      for (let i = this.lastFileAdedIndex; i < files.length; i++) {
        //calculate the file group size
        fileGroupSize += files[i].size;
        ///add the file to the array
        this.filesGroup.push(files[i]);
        //if the files group memory exeed 100 mb update the last file index that was added
        if (fileGroupSize / 1048576 >= 100 || i + 1 == files.length) {
          this.lastFileAdedIndex = i + 1;
          break;
        }
      }
      //add the files to resumable
      this.resumable.addFiles(this.filesGroup);
      this.resumable.opts.headers = {
        NumberOfFiles: this.filesToUpload,
      };
      //upload the files
      setTimeout(() => {
        this.resumable.upload();
      }, 500);
    },

    showModal(event) {
      const modals = document.querySelectorAll(".modal");
      const overlay = document.querySelector(".overlay");
      modals.forEach((modal) => {
        if (event.target.classList.contains(modal.classList[0])) {
          modal.classList.remove("hidden");
          overlay.classList.remove("hidden");
        }
      });
    },

    showDropdown(event) {
      this.$refs.dataWrapper.cancelfilesSelection();
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

<style scoped>
/*---------------Dashboard header------------------*/

.dashboard-view__header {
  padding: 25px;
  background-color: #f7f8fb;
}

.dashboard-view__header > h1 {
  color: #333343;
  font-size: 35px;
}

@media screen and (max-width: 1150px) {
  .dashboard-view__header {
    padding: 15px;
    background-color: #f7f8fb;
  }
}

@media screen and (max-width: 600px) {
  .upload-folder {
    display: none;
  }
  .upload-file {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
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
