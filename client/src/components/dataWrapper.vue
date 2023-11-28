<template>
  <main class="content">
    <header class="content--header">
      <div class="left-side--header">
        <div
          class="file-type-dropdown-btn file-type--dropdown"
          @click="showDropdown($event)"
        >
          <fa
            :icon="selectedDataType.icon"
            class="file-type--dropdown file-type-dropdown-btn-icon"
          />
          <h1 class="file-type--dropdown">{{ selectedDataType.text }}</h1>
          <fa
            :icon="['fas', 'chevron-down']"
            class="file-type--dropdown file-type-dropdown-btn-icon"
          />
        </div>
        <Dropdown
          :customClass="'file-type--dropdown'"
          :style="{ marginTop: '0px', marginLeft: '0px' }"
        >
          <div
            v-for="(option, index) in dataTypes"
            :key="index"
            class="dropdown-option-for"
          >
            <DropdownOption
              :icon="option.icon"
              v-if="selectedDataType.text !== option.text"
              @click="setSelectedfileType(index)"
            >
              {{ option.text }}
            </DropdownOption>
          </div>
        </Dropdown>
      </div>
      <div class="right-side-dashboard-header">
        <div
          v-if="tableFormat"
          class="change-files-wrapper-format-btn"
          @click="setfilesWrapperFormat()"
        >
          <fa :icon="['fas', 'table-cells-large']" />
          <p>Table</p>
        </div>
        <div
          v-else
          class="change-files-wrapper-format-btn"
          @click="setfilesWrapperFormat()"
        >
          <fa :icon="['fas', 'list-ul']" />
          <p>List</p>
        </div>
      </div>
    </header>
    <div v-if="tableFormat">
      <div class="files-header-table-format">
        <div class="files-table-format-sort-titles">
          <div class="files-name-column-table-format">
            <p>Name</p>
            <div
              class="data-sort-order-icon"
              @click="
                {
                  filterDataBy = 0;
                  setSortingOrder();
                }
              "
            >
              <fa :icon="['fas', 'sort']" v-if="columnsData[0].order == 0" />
              <fa :icon="['fas', 'sort-up']" v-if="columnsData[0].order == 1" />
              <fa
                :icon="['fas', 'sort-down']"
                v-if="columnsData[0].order == 2"
              />
            </div>
          </div>
          <div class="files-size-column-table-format">
            <p>Size</p>
            <div
              class="data-sort-order-icon"
              @click="
                {
                  filterDataBy = 1;
                  setSortingOrder();
                }
              "
            >
              <fa :icon="['fas', 'sort']" v-if="columnsData[1].order == 0" />
              <fa :icon="['fas', 'sort-up']" v-if="columnsData[1].order == 1" />
              <fa
                :icon="['fas', 'sort-down']"
                v-if="columnsData[1].order == 2"
              />
            </div>
          </div>
        </div>
        <div class="select-files-btn" @click="filesSelectionToggle()">
          <div class="select-files-toggle-btn" v-if="!filesSelection">
            <!-- <fa :icon="['fas', 'check-to-slot']" /> -->
            Select
          </div>
          <div class="select-files-toggle-btn" v-else>
            <!-- <fa :icon="['fas', 'check-to-slot']" /> -->
            Cancel
          </div>
        </div>
      </div>
      <div class="files-container-table-format" v-if="data.length > 0">
        <div
          v-for="(file, index) in dataCopy"
          :key="index"
          @mouseenter="showfileCheckbox(index)"
          @mouseleave="hidefileCheckbox(index)"
          @click.stop="selectfile(index)"
          @dblclick="
            {
              this.dataObjOpenedOptions = this.dataCopy[index];
              filesOptions[0].action();
            }
          "
          class="file--table file"
        >
          <div class="file-name-column">
            <div class="select-file-btn hidden">
              <input type="checkbox" @click.stop @click.prevent />
            </div>
            <div class="file-image">
              <img v-if="file.type === 'file'" src="@/assets/file.png" />
              <img v-else src="@/assets/folder.png" />
            </div>
            <p class="file-name file-name-table">{{ file.name }}</p>
          </div>
          <div class="file-options-btn-container">
            <div
              class="file-options-btn file-dropdown file-options--dropdown"
              @click="
                showDropdown($event, index), setFileDropdownOptions(index)
              "
            >
              <fa :icon="['fas', 'ellipsis']" class="file-options--dropdown" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <table v-else class="files-table">
      <tr class="files-table--head">
        <th class="files-name-column">
          <div>
            <p>Name</p>
            <div
              class="data-sort-order-icon"
              @click="
                {
                  filterDataBy = 0;
                  setSortingOrder();
                }
              "
            >
              <fa :icon="['fas', 'sort']" v-if="columnsData[0].order == 0" />
              <fa :icon="['fas', 'sort-up']" v-if="columnsData[0].order == 1" />
              <fa
                :icon="['fas', 'sort-down']"
                v-if="columnsData[0].order == 2"
              />
            </div>
          </div>
        </th>
        <th class="files-size-column">
          <div>
            <p>Size</p>
            <div
              class="data-sort-order-icon"
              @click="
                {
                  filterDataBy = 1;
                  setSortingOrder();
                }
              "
            >
              <fa :icon="['fas', 'sort']" v-if="columnsData[1].order == 0" />
              <fa :icon="['fas', 'sort-up']" v-if="columnsData[1].order == 1" />
              <fa
                :icon="['fas', 'sort-down']"
                v-if="columnsData[1].order == 2"
              />
            </div>
          </div>
        </th>
        <th class="files-last-accesed-column">
          <div>
            <p>Last accessed</p>
          </div>
        </th>
        <th>
          <div class="select-files-btn" @click="filesSelectionToggle()">
            <div class="select-files-toggle-btn" v-if="!filesSelection">
              <!-- <fa :icon="['fas', 'check-to-slot']" /> -->
              Select
            </div>
            <div class="select-files-toggle-btn" v-else>
              <!-- <fa :icon="['fas', 'check-to-slot']" /> -->
              Cancel
            </div>
          </div>
        </th>
      </tr>
      <tr
        class="file--list file"
        v-for="(file, index) in dataCopy"
        :key="index"
        @mouseenter="showfileCheckbox(index)"
        @mouseleave="hidefileCheckbox(index)"
        @click.stop="selectfile(index)"
        @dblclick="
          {
            this.dataObjOpenedOptions = this.dataCopy[index];
            filesOptions[0].action();
          }
        "
      >
        <th>
          <div class="file-name-column">
            <div class="select-file-btn hidden">
              <input type="checkbox" @click.stop @click.prevent />
            </div>
            <div class="file-image">
              <img v-if="file.type === 'file'" src="@/assets/file.png" />
              <img v-else src="@/assets/folder.png" />
            </div>
            <p class="file-name">
              {{ file.name }}
            </p>
          </div>
        </th>
        <th>
          <p class="file-size">{{ file.size }}MB</p>
        </th>
        <th>
          <p class="file-last-accesed">{{ file.last_accessed }}</p>
        </th>
        <th>
          <div class="file-options-btn-container">
            <div
              class="file-options-btn file-dropdown file-options--dropdown"
              @click="
                showDropdown($event, index), setFileDropdownOptions(index)
              "
            >
              <fa :icon="['fas', 'ellipsis']" class="file-options--dropdown" />
            </div>
          </div>
        </th>
      </tr>
    </table>
  </main>
  <Dropdown
    :customClass="'file-options--dropdown'"
    :style="{
      marginTop: '0px',
      marginLeft: '0px',
    }"
  >
    <div
      v-for="(option, index) in filesOptions"
      :key="index"
      class="dropdown-option-for"
    >
      <DropdownOption
        @click="dataAction(filesOptions[index])"
        :style="{ fontSize: '13px' }"
        :icon="option.icon"
        v-if="selectedDataType.text !== option.text && option.show"
      >
        {{ option.text }}
      </DropdownOption>
    </div>
  </Dropdown>
  <Modal
    :title="'Rename ' + dataObjOpenedOptions.type"
    :customClass="'modal-rename-data'"
    ref="Modal"
  >
    <RenameData
      :data="dataObjOpenedOptions"
      @hide-modal="hideModalTrigger"
      @update-data="$emit('update-data')"
    ></RenameData>
  </Modal>
  <Modal
    :title="'Move ' + dataObjOpenedOptions.type"
    :customClass="'modal-move-data'"
    ref="Modal"
  >
    <MoveData
      :data="dataObjOpenedOptions"
      @hide-modal="hideModalTrigger"
      @update-data="$emit('update-data')"
      ref="moveDataModal"
    ></MoveData>
  </Modal>
  <Modal :title="'Detalies'" :customClass="'modal-data-detalies'" ref="Modal">
    <DataDetalies :data="dataObjOpenedOptions"></DataDetalies>
  </Modal>
  <Modal
    :title="'Temporary link'"
    :customClass="'modal-download-link'"
    ref="Modal"
  >
    <GenerateDownloadLink
      ref="generateLinkModal"
      :data="dataObjOpenedOptions"
    ></GenerateDownloadLink>
  </Modal>
  <MessageBox
    ref="MessageBox"
    :style="{ marginLeft: '15px', bottom: '20px' }"
  ></MessageBox>
  <div class="actions-box" v-show="showDataActionsBar">
    <p>{{ selectedData }} selected</p>
    <div class="line"></div>
    <div class="options-container">
      <fa @click="updateSelectedData('starred')" :icon="['far', 'star']"></fa>
      <fa @click="downloadMultipleData()" :icon="['fas', 'download']"></fa>
      <fa
        @click="updateSelectedData('delete')"
        :icon="['far', 'trash-can']"
      ></fa>
    </div>
  </div>
  <div
    v-if="data.length == 0 && !$store.state.dataReceived"
    class="receiving-data-status"
  >
    <Loader></Loader>
  </div>
  <div
    v-if="$store.state.dataReceived && data.length == 0"
    class="receiving-data-status message"
    style="font-size: 20px"
  >
    <h1>No data found</h1>
  </div>
</template>

<script>
import axios from "axios";

import Dropdown from "@/components/dropdown/dropdown.vue";
import DropdownOption from "@/components/dropdown/dropdownOption";
import Loader from "@/components/loader.vue";
import Modal from "@/components/modal/modal.vue";
import RenameData from "@/components/modal/modalContent/renameData.vue";
import GenerateDownloadLink from "./modal/modalContent/generateDownloadLink.vue";
import MoveData from "@/components/modal/modalContent/moveData.vue";
import DataDetalies from "./modal/modalContent/dataDetalies.vue";
import MessageBox from "@/components/notifications/messageBox.vue";

export default {
  components: {
    Dropdown,
    DropdownOption,
    Loader,
    Modal,
    RenameData,
    MessageBox,
    MoveData,
    DataDetalies,
    GenerateDownloadLink,
  },
  props: {
    data: {
      type: Array,
      required: true,
      default: () => [],
    },
    page: {
      type: String,
      default: "",
    },
    prevPage: {
      type: String,
      default: "",
    },
  },
  emits: ["update-data", "fetch-folder-data"],
  data() {
    return {
      filesSelection: false,
      tableFormat: false,
      selectedDataType: {
        icon: ["fas", "briefcase"],
        type: "all",
        text: "All",
      },
      dataTypes: [
        {
          text: "All",
          type: "all",
          icon: ["fas", "briefcase"],
        },
        {
          text: "Folders",
          type: "folder",
          icon: ["fas", "folder"],
        },
        {
          text: "Files",
          type: "file",
          icon: ["fas", "file"],
        },
      ],
      columnsData: [
        {
          column: 0,
          order: 0,
          name: "name",
        },
        {
          column: 1,
          order: 0,
          name: "size",
        },
      ],
      prevSortedColumn: -1,
      filterDataBy: 0,
      filesOptions: [
        {
          text: "Open",
          icon: ["fas", "folder-open"],
          modalClassName: "",
          actionType: "function",
          show: true,
          action: () => {
            if (this.dataObjOpenedOptions.type === "folder") {
              this.$router.replace({
                name: "folderData",
                params: {
                  folderIdentifier: this.dataObjOpenedOptions.unique_identifier,
                  page: this.prevPage ? this.prevPage : this.page,
                },
              });
            }
          },
        },
        {
          text: "Rename",
          icon: ["fas", "pencil"],
          modalClassName: "modal-rename-data",
          actionType: "modal",
          show: true,
          action: () => {},
        },
        {
          text: "Move",
          icon: ["fas", "arrow-right-to-bracket"],
          modalClassName: "modal-move-data",
          actionType: "modal",
          show: this.page !== "deleted" ? true : false,
          action: () => this.$refs.moveDataModal.fetchPaths(),
        },
        {
          text: "Add to starred",
          icon: ["far", "star"],
          modalClassName: "",
          actionType: "function",
          show: true,
          type: "starred",
          action: () => {
            this.updateData(true, this.dataObjOpenedOptions, "starred");
          },
        },
        {
          text: "Remove from starred",
          icon: ["fas", "star"],
          modalClassName: "",
          actionType: "function",
          show: false,
          type: "starred",
          action: () => {
            this.updateData(false, this.dataObjOpenedOptions, "starred");
          },
        },
        {
          text: "Detalies",
          icon: ["fas", "circle-info"],
          modalClassName: "modal-data-detalies",
          actionType: "modal",
          show: true,
          action: () => {},
        },
        {
          text: "Download",
          icon: ["fas", "download"],
          modalClassName: "",
          actionType: "function",
          show: true,
          action: () => this.downloadData(this.dataObjOpenedOptions),
        },
        {
          text: "Generate Link",
          icon: ["fas", "link"],
          modalClassName: "modal-download-link",
          actionType: "modal",
          show: true,
          action: () => {
            this.$refs.generateLinkModal.getDownloadLink();
          },
        },
        {
          text: "Recover",
          icon: ["fas", "trash-arrow-up"],
          modalClassName: "",
          actionType: "function",
          show: this.page === "deleted" ? true : false,
          action: () => {
            this.updateData(true, this.dataObjOpenedOptions, "recover");
          },
        },
        {
          text: "Delete",
          icon: ["far", "trash-can"],
          modalClassName: "",
          actionType: "function",
          show: true,
          action: () => {
            this.updateData(true, this.dataObjOpenedOptions, "delete");
          },
        },
      ],
      dataCopy: this.data,
      dataObjOpenedOptions: {},
      selectedData: 0,
      showDataActionsBar: false,
    };
  },
  methods: {
    hideModalTrigger(response) {
      this.$refs.Modal.hideModal();
      if (response.message) this.showMessageBox(response.message);
    },

    showMessageBox(message) {
      this.$refs.MessageBox.showMessage(message);
    },

    setFileDropdownOptions(index) {
      const optionsTypes = ["starred", "public"];
      this.dataObjOpenedOptions = this.dataCopy[index];
      this.filesOptions[
        this.filesOptions.findIndex((obj) => obj.text === "Recover")
      ].show = this.dataObjOpenedOptions.deletion_date ? true : false;
      let dataIndex = this.filesOptions.findIndex((obj) =>
        optionsTypes.includes(obj.type)
      );
      if (
        dataIndex >= 0 &&
        this.dataObjOpenedOptions[this.filesOptions[dataIndex].type]
      ) {
        this.filesOptions[dataIndex].show = false;
        this.filesOptions[dataIndex + 1].show = true;
      } else {
        this.filesOptions[dataIndex + 1].show = false;
        this.filesOptions[dataIndex].show = true;
      }
      if (this.dataObjOpenedOptions.type === "file") {
        this.filesOptions[0].show = false;
      } else {
        this.filesOptions[0].show = true;
      }
    },

    updateData(isTrue, obj, route) {
      axios
        .post(
          `/api/${route}`,
          {
            condition: isTrue,
            data: obj,
          },
          { withCredentials: true }
        )
        .then((response) => {
          this.$emit("update-data");
          this.showMessageBox(response.data.message);
          this.cancelfilesSelection();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    downloadData(data) {
      axios
        .post(
          `/api/download`,
          {
            data: data,
          },
          { responseType: "blob", withCredentials: true }
        )
        .then((response) => {
          if (response.headers.dataisavailable == 0) {
            this.showMessageBox("File/folder not found!");
          } else {
            const blob = new Blob([response.data], {
              type: "application/zip",
            });

            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = data.name;
            link.click();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    dataAction(option) {
      if (option.actionType === "function") {
        option.action();
      } else if (option.actionType === "modal") {
        option.action();
        this.showModal(option.modalClassName);
      }
    },

    showModal(modalClassName) {
      const modals = document.querySelectorAll(".modal");
      const overlay = document.querySelector(".overlay");
      modals.forEach((modal) => {
        if (modalClassName === modal.classList[0]) {
          modal.classList.remove("hidden");
          overlay.classList.remove("hidden");
        }
      });
    },
    showDropdown(event, index) {
      const files = document.querySelectorAll(".file");
      const dropdowns = document.querySelectorAll(".dropdown");

      this.cancelfilesSelection();

      files.forEach((file) => {
        file.style.backgroundColor = "#f7f8fb";
      });

      dropdowns.forEach((dropdown) => {
        dropdown.classList.add("hidden");
        //verify if the clicked element has a match for one of the dropdowns class
        if (event.target.classList.contains(dropdown.classList[0])) {
          setTimeout(() => {
            dropdown.classList.remove("hidden");
            //verify if is the files dropdown
            if (dropdown.classList[0] === "file-options--dropdown") {
              //set the top distance of the dropdown to the top distance of the cursor position
              dropdown.style.top = event.clientY + "px";
              //set the left distance of the dropdown to the left distance of the cursor position
              dropdown.style.left =
                event.clientX - dropdown.clientWidth - 5 + "px";
              //get the height of the dropdown that is lower than the screen
              let exeededHeight =
                event.clientY + dropdown.clientHeight - window.innerHeight;
              //if the entire dropdown is not visible on the window
              if (exeededHeight > 0) {
                //substract the height from the top distance
                dropdown.style.top = event.clientY - exeededHeight - 10 + "px";
              }
              //marg the file that has the options dropdown open
              files[index].style.backgroundColor = "#E9ECF8";
            }
          }, 100);
        }
      });
    },

    setSelectedfileType(index) {
      this.selectedDataType = this.dataTypes[index];
      if (this.selectedDataType.type !== "all") {
        //return only the files that has the specified type
        this.dataCopy = this.data.filter((file) => {
          return this.dataTypes[index].type === file.type;
        });
      } else {
        //return all the files
        this.dataCopy = this.data;
      }
      this.sortDataInOrder();
    },

    setfilesWrapperFormat() {
      this.tableFormat = !this.tableFormat;
      this.cancelfilesSelection();
    },

    setSortingOrder() {
      this.cancelfilesSelection();
      this.defaultSorting();
      this.columnsData.forEach((sort) => {
        //verify if new column order is clicked
        if (this.prevSortedColumn !== this.filterDataBy) {
          //reset all the orders
          this.columnsData.forEach((data) => {
            data.order = 0;
          });
          this.prevSortedColumn = this.filterDataBy;
        }
        //verify by wiitch column to order the data
        if (sort.column === this.filterDataBy) {
          //increase order
          sort.order++;
          if (sort.order > 2) {
            sort.order = 0;
            this.defaultSorting();
          }
          this.sortDataInOrder();
        }
      });
    },

    defaultSorting() {
      if (this.page === "recents")
        this.dataCopy.sort((a, b) => {
          let aDate = new Date(a.last_accessed);
          let bDate = new Date(b.last_accessed);
          return bDate.getTime() - aDate.getTime();
        });
      else
        this.dataCopy.sort((a, b) => {
          let aDate = new Date(a.creation_date);
          let bDate = new Date(b.creation_date);
          return bDate.getTime() - aDate.getTime();
        });
    },

    sortDataInOrder() {
      let sort = this.columnsData[this.filterDataBy];
      if (sort.order === 1) {
        if (this.filterDataBy === 0) {
          //sort ascending by file name (type string)
          this.dataCopy.sort((a, b) => {
            if (a.name > b.name) return 1;
            else if (a.name < b.name) return -1;
            return 0;
          });
        } else if (this.filterDataBy === 1) {
          //sort ascending by size(type number)
          this.dataCopy.sort((a, b) => {
            return Number(a.size.slice(0, -2)) - Number(b.size.slice(0, -2));
          });
        }
      }
      if (sort.order === 2) {
        if (this.filterDataBy === 0) {
          //sort descending by file name (type string)
          this.dataCopy.sort((a, b) => {
            if (b.name > a.name) return 1;
            else if (b.name < a.name) return -1;
            return 0;
          });
        } else if (this.filterDataBy === 1) {
          //sort descending by size(type number)
          this.dataCopy.sort((a, b) => {
            return Number(b.size.slice(0, -2)) - Number(a.size.slice(0, -2));
          });
        }
      }
    },

    /*-------------------------------*\
          files selection system
    \*-------------------------------*/

    getSelectedData() {
      let selectedDataArray = [];
      const checkboxes = document.querySelectorAll(
        ".file .select-file-btn input"
      );
      checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
          selectedDataArray.push(this.dataCopy[index]);
        }
      });
      return selectedDataArray;
    },

    downloadMultipleData() {
      const dataToDownload = this.getSelectedData();
      if (dataToDownload.length > 0) {
        dataToDownload.forEach((dataObj) => {
          this.downloadData(dataObj);
        });
        this.cancelfilesSelection();
      } else {
        this.showMessageBox("Please select at least 1 folder/file.");
      }
    },

    updateSelectedData(route) {
      const dataToModify = this.getSelectedData();
      if (dataToModify.length > 0) {
        dataToModify.forEach((dataObj) => {
          this.updateData(true, dataObj, route);
        });
      } else {
        this.showMessageBox("Please select at least 1 folder/file.");
      }
    },

    filesSelectionToggle() {
      //set files selection to true/false if the selection button is pressed
      this.filesSelection = !this.filesSelection;
      this.showDataActionsBar = !this.showDataActionsBar;

      if (!this.filesSelection) {
        //cancel the selection
        this.cancelfilesSelection();
      }
    },

    selectfile(index) {
      //check the checkbox if selection si true
      if (this.filesSelection) {
        const checkbox = document.querySelectorAll(
          ".file .select-file-btn input"
        )[index];
        checkbox.checked = !checkbox.checked;
        if (checkbox.checked) {
          this.selectedData++;
        } else {
          this.selectedData--;
        }
      }
    },

    cancelfilesSelection() {
      const files = document.querySelectorAll(".file");
      //set files selection to false
      this.filesSelection = false;
      this.selectedData = 0;
      this.showDataActionsBar = false;
      //go trough every file
      files.forEach((file) => {
        //chage the background color to defalut
        file.style.backgroundColor = "#f7f8fb";
        //hide the checkbox and show the file image
        file.querySelector(".select-file-btn").classList.add("hidden");
        file.querySelector(".file-image").classList.remove("hidden");
        //set the checkboxes to false
        file.querySelector(".select-file-btn input").checked = false;
      });
    },

    showfileCheckbox(index) {
      //when filesSelection is true call the function on mouse over the file
      const files = document.querySelectorAll(".file");
      if (this.filesSelection) {
        //show the checkbox and hide the file image
        files[index]
          .querySelector(".select-file-btn")
          .classList.remove("hidden");
        files[index].querySelector(".file-image").classList.add("hidden");
      }
    },

    hidefileCheckbox(index) {
      //when filesSelection is true call the function on mouse leave the file
      const files = document.querySelectorAll(".file");
      const checkbox = files[index].querySelector(".select-file-btn input");
      if (this.filesSelection && !checkbox.checked) {
        //hide the checkbox and show the file image if the checkbox is not checked
        files[index].querySelector(".select-file-btn").classList.add("hidden");
        files[index].querySelector(".file-image").classList.remove("hidden");
      }
    },
  },
  mounted() {
    this.defaultSorting();
  },
  watch: {
    data: {
      immediate: true, // Trigger the handler immediately when the component is created
      handler(newValue) {
        this.dataCopy = newValue;
        this.defaultSorting();
        this.setSelectedfileType(0);
      },
    },
  },
};
</script>

<style>
body {
  overflow: hidden;
}

.receiving-data-status {
  display: grid;
  place-items: center;
  height: 55%;
  width: 100%;
  overflow: hidden;
  color: #19172e;
}

.receiving-data-status h1 {
  font-size: 25px;
}

.content {
  padding: 0 25px;
  border-top: 2px solid #edeef8;
  font-weight: 500;
  user-select: none;
}

.content--header {
  background-color: #f6f9fb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

/*Select files type button */

.file-type-dropdown-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
  font-size: 12px;
  color: #19172e;
}

.file-type-dropdown-btn .file-type--dropdown:first-child {
  margin-right: 5px;
  font-size: 20px;
}

.file-type-dropdown-btn .file-type--dropdown:last-child {
  margin-left: 5px;
  font-size: 18px;
}

.change-files-wrapper-format-btn {
  display: flex;
  align-items: center;
  font-size: 18px;
  user-select: none;
}

.change-files-wrapper-format-btn p {
  margin-left: 4px;
}

.data-sort-order-icon {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 16px;
  margin-left: 5px;
}

.data-sort-order-icon:hover {
  background-color: #e2e5f3;
}

table,
th,
tr {
  font-weight: 500;
  margin: 0;
  padding: 0;
}

.files-table {
  width: 100%;
  border: none;
  border-collapse: collapse;
}

.files-table--head {
  background-color: #f7f8fb;
  position: sticky;
  top: 55px;
  z-index: 2;
  width: 100%;
  padding: 15px;
  height: 40px;
  font-size: 17px;
}

.files-name-column > div,
.files-name-column-table-format,
.files-size-column-table-format {
  display: flex;
  align-items: center;
  margin-left: 10px;
  font-weight: 600;
  font-size: 17px;
}

.files-size-column > div {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.files-last-accesed-column > div {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.select-files-btn {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 15.5px;
  user-select: none;
}

.select-files-toggle-btn {
  padding: 1px 2.5px;
  border: 1px solid #c3c5df;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 1px 2px;
  border-radius: 5px;
}

.file--list {
  width: 100%;
  height: 41px;
  background-color: #f7f8fb;
  border-bottom: 2px solid #eceef0;
  padding: 0 10px;
  font-size: 17px;
}

.file--list:hover {
  background-color: #f1f3f8;
}

/*----------files detalies wrapper---------*/

.file-name-column *,
.file-name-column {
  box-sizing: content-box;
}

.file-name-column {
  display: flex;
  align-items: center;
  /* width: calc(100px); */
}

.file-size-column,
.file-last-accesed-column {
  display: flex;
  justify-content: center;
  align-items: center;
}

.file-options-btn-container {
  display: flex;
  justify-content: flex-end;
  margin-right: 10px;
}

.file-options-btn {
  font-size: 18px;
  height: 25px;
  width: 25px;
  border-radius: 50%;
  display: grid;
  place-items: center;
}

.file-options-btn:hover {
  background-color: #e6e9ee;
}

/*-----------------file image-------------*/
.select-file-btn {
  display: grid;
  align-items: center;
  font-size: 18px;
  height: 33.5px;
  width: 33.5px;
  border-radius: 50%;
  margin: 0 5px;
  font-size: 19px;
}

.select-file-btn input {
  height: 16px;
}

.select-file-btn:hover {
  background-color: #e6e9ee;
}

.file-image {
  display: grid;
  place-items: center;
  height: 30px;
  width: 30px;
  border-radius: 50%;
  background-image: cover;
  background-color: #ffffff;
  margin: 0 5px;
  border: 2px solid #eceef0;
  user-select: none;
}

.file-image img {
  height: 25px;
  width: auto;
  border-radius: 50%;
}

.files-header-table-format {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 5px;
  position: sticky;
  top: 55px;
  z-index: 2;
  background-color: #f7f8fb;
}

.files-table-format-sort-titles {
  width: 20%;
  min-width: 200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 17px;
}

.files-container-table-format {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 0.8fr));
}

.file--table {
  height: 41px;
  margin: 5px;
  background-color: #f7f8fb;
  border: 2px solid #eceef0;
  font-size: 17px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 10px;
}

.file--table:hover {
  background-color: #f1f3f8;
}

.file-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media screen and (min-width: 2000px) {
  .file-name {
    max-width: 700px;
  }
}

@media screen and (max-width: 1450px) {
  .file-name {
    max-width: 300px;
  }
}

@media screen and (max-width: 1100px) {
  .file-name {
    max-width: 200px;
  }
}

@media screen and (max-width: 350px) {
  .file-name {
    max-width: 150px;
  }
}

.file-name-table {
  max-width: 150px;
}

/*-------------Data actions bar----------------*/

.actions-box {
  position: absolute;
  margin-left: calc(38% - 95px);
  transform: translate(0, -50%);
  bottom: 20px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 2px 4px;
  padding: 5px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  color: #252531;
  font-size: 17px;
  background-color: #ffffff;
}

.line {
  margin: 0 5px;
  height: 18px;
  width: 2px;
  border-radius: 5px;
  background-color: #808086;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 2px 4px;
}

.options-container {
  font-size: 16px;
  width: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
}

@media screen and (max-width: 1150px) {
  .actions-box {
    position: absolute;
    margin-left: calc(50% - 85px);
    bottom: 0px;
  }
}

@media screen and (max-width: 850px) {
  .files-last-accesed-column,
  .file-last-accesed {
    display: none;
  }
  .files-table--head .select-files-btn {
    margin-right: -69%;
  }
  .content {
    padding: 0 10px;
  }
}

@media screen and (max-width: 530px) {
  .files-size-column,
  .file-size {
    display: none;
  }
  .change-files-wrapper-format-btn {
    display: none;
  }
}
</style>
