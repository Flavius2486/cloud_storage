<template>
  <main class="content">
    <header class="content--header">
      <div class="left-side--header">
        <div
          class="asset-type-dropdown-btn asset-type--dropdown"
          @click="showDropdown($event)"
        >
          <fa
            :icon="selectedAssetType.icon"
            class="asset-type--dropdown asset-type-dropdown-btn-icon"
          />
          <h1 class="asset-type--dropdown">{{ selectedAssetType.text }}</h1>
          <fa
            :icon="['fas', 'chevron-down']"
            class="asset-type--dropdown asset-type-dropdown-btn-icon"
          />
        </div>
        <Dropdown
          :customClass="'asset-type--dropdown'"
          :style="{ marginTop: '0px', marginLeft: '0px' }"
        >
          <div
            v-for="(option, index) in assetsTypes"
            :key="index"
            class="dropdown-option-for"
          >
            <DropdownOption
              :icon="option.icon"
              v-if="selectedAssetType.text !== option.text"
              @click="setSelectedAssetType(index)"
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
          @click="setAsetsWrapperFormat()"
        >
          <fa :icon="['fas', 'table-cells-large']" />
          <p>Table</p>
        </div>
        <div
          v-else
          class="change-files-wrapper-format-btn"
          @click="setAsetsWrapperFormat()"
        >
          <fa :icon="['fas', 'list-ul']" />
          <p>List</p>
        </div>
      </div>
    </header>
    <div v-if="tableFormat">
      <h1>Table</h1>
    </div>
    <table v-else class="asets-table--list">
      <tr class="asets-table--head--list">
        <th class="asets-name-column--list">
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
        <th class="asets-size-column--list">
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
        <th class="asets-last-accesed--list">
          <div>
            <p>Last accesed</p>
          </div>
        </th>
        <th>
          <div class="select-asets-btn--list" @click="asetsSelectionToggle()">
            <div>
              <fa :icon="['fas', 'check-to-slot']" />
            </div>
          </div>
        </th>
      </tr>
      <tr
        class="aset--list"
        v-for="(aset, index) in data"
        :key="index"
        @mouseenter="showAsetCheckbox(index)"
        @mouseleave="hideAsetCheckbox(index)"
        @click.stop="selectAset(index)"
      >
        <th>
          <div class="aset-name-column--list">
            <div class="select-aset-btn--list hidden">
              <input type="checkbox" @click.stop @click.prevent />
            </div>
            <div class="aset-image--list">
              <img src="@/assets/logo.png" />
            </div>
            <p class="aset-name--list">{{ aset.name }}</p>
          </div>
        </th>
        <th>
          <p class="aset-size--list">{{ aset.size }}</p>
        </th>
        <th>
          <p class="aset-last-accesed--list">12.09.2022</p>
        </th>
        <th>
          <div class="aset-options-btn-container--list">
            <div
              class="aset-options-btn--list aset-dropdown--list asset-options--dropdown"
              @click="showDropdown($event, index)"
            >
              <fa :icon="['fas', 'ellipsis']" class="asset-options--dropdown" />
            </div>
          </div>
        </th>
      </tr>
    </table>
    <Dropdown
      :customClass="'asset-options--dropdown'"
      :style="{
        marginTop: '0px',
        marginLeft: '0px',
      }"
    >
      <div
        v-for="(option, index) in asetsOptions"
        :key="index"
        class="dropdown-option-for"
      >
        <DropdownOption
          :style="{ fontSize: '13px' }"
          :icon="option.icon"
          v-if="selectedAssetType.text !== option.text"
        >
          {{ option.text }}
        </DropdownOption>
      </div>
    </Dropdown>
  </main>
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
    return {
      asetsSelection: false,
      tableFormat: false,
      selectedAssetType: {
        icon: ["fas", "briefcase"],
        type: "all",
        text: "All",
      },
      assetsTypes: [
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
      asetsOptions: [
        {
          text: "Open",
          icon: ["fas", "folder-open"],
          index: 0,
        },
        {
          text: "Rename",
          icon: ["fas", "pencil"],
          index: 1,
        },
        {
          text: "Move",
          icon: ["fas", "arrow-right-to-bracket"],
          index: 2,
        },
        {
          text: "Add to starred",
          icon: ["far", "star"],
          index: 3,
        },
        {
          text: "Remove from starred",
          icon: ["fas", "star"],
          index: 4,
        },
        {
          text: "Detalies",
          icon: ["fas", "circle-info"],
          index: 5,
        },
        {
          text: "Download",
          icon: ["fas", "download"],
          index: 6,
        },
        {
          text: "Delete",
          icon: ["far", "trash-can"],
          index: 7,
        },
      ],
      data: [
        {
          name: ".pnbreak.png",
          size: "20MB",
          type: "file",
        },
        { name: "file1.pdf", size: "15MB", type: "file" },
        { name: "video.mp4", size: "50MB", type: "file" },
        { name: "document.docx", size: "10MB", type: "file" },
        { name: "music.mp3", size: "5MB", type: "file" },
        { name: "spreadsheet.xlsx", size: "30MB", type: "folder" },
        { name: "presentation.pptx", size: "25MB", type: "file" },
        { name: "archive.zip", size: "40MB", type: "file" },
        { name: "code.js", size: "2MB", type: "file" },
        { name: "text.txt", size: "1MB", type: "file" },
        { name: "image2.png", size: "18MB", type: "file" },
        { name: "file2.pdf", size: "13MB", type: "file" },
        { name: "video2.mp4", size: "45MB", type: "file" },
        { name: "document2.docx", size: "8MB", type: "file" },
        { name: "music2.mp3", size: "3MB", type: "file" },
        { name: "spreadsheet2.xlsx", size: "28MB", type: "file" },
        { name: "presentation2.pptx", size: "23MB", type: "folder" },
        { name: "archive2.zip", size: "38MB", type: "folder" },
        { name: "code2.js", size: "4MB", type: "file" },
        { name: "text2.txt", size: "3MB", type: "folder" },
      ],
      dataCopy: [
        { name: "image.png", size: "20MB", type: "file" },
        { name: "file1.pdf", size: "15MB", type: "file" },
        { name: "video.mp4", size: "50MB", type: "file" },
        { name: "document.docx", size: "10MB", type: "file" },
        { name: "music.mp3", size: "5MB", type: "file" },
        { name: "spreadsheet.xlsx", size: "30MB", type: "folder" },
        { name: "presentation.pptx", size: "25MB", type: "file" },
        { name: "archive.zip", size: "40MB", type: "file" },
        { name: "code.js", size: "2MB", type: "file" },
        { name: "text.txt", size: "1MB", type: "file" },
        { name: "image2.png", size: "18MB", type: "file" },
        { name: "file2.pdf", size: "13MB", type: "file" },
        { name: "video2.mp4", size: "45MB", type: "file" },
        { name: "document2.docx", size: "8MB", type: "file" },
        { name: "music2.mp3", size: "3MB", type: "file" },
        { name: "spreadsheet2.xlsx", size: "28MB", type: "file" },
        { name: "presentation2.pptx", size: "23MB", type: "file" },
        { name: "archive2.zip", size: "38MB", type: "folder" },
        { name: "code2.js", size: "4MB", type: "file" },
        { name: "text2.txt", size: "3MB", type: "folder" },
      ],
    };
  },
  methods: {
    showDropdown(event, index) {
      const asets = document.querySelectorAll(".aset--list");
      const dropdowns = document.querySelectorAll(".dropdown");

      this.cancelAsetsSelection();

      asets.forEach((aset) => {
        aset.style.backgroundColor = "#f7f8fb";
      });

      dropdowns.forEach((dropdown) => {
        dropdown.classList.add("hidden");
        //verify if the clicked element has a match for one of the dropdowns class
        if (event.target.classList.contains(dropdown.classList[0])) {
          setTimeout(() => {
            dropdown.classList.remove("hidden");
            //verify if is the asets dropdown
            if (dropdown.classList[0] === "asset-options--dropdown") {
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
              //marg the aset that has the options dropdown open
              asets[index].style.backgroundColor = "#E9ECF8";
            }
          }, 100);
        }
      });
    },

    setSelectedAssetType(index) {
      this.selectedAssetType = this.assetsTypes[index];
      if (this.selectedAssetType.type !== "all") {
        //return only the asets that has the specified type
        this.data = this.dataCopy.filter((file) => {
          if (this.assetsTypes[index].type === file.type) return true;
        });
      } else {
        //return all the asets
        this.data = this.dataCopy;
      }
      this.sortDataInOrder();
    },

    setAsetsWrapperFormat() {
      this.tableFormat = !this.tableFormat;
    },

    setSortingOrder() {
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
          }
          this.sortDataInOrder();
        }
      });
    },

    sortDataInOrder() {
      let sort = this.columnsData[this.filterDataBy];
      if (sort.order === 1) {
        if (this.filterDataBy === 0) {
          //sort ascending by aset name (type string)
          this.data.sort((a, b) => {
            if (a.name > b.name) return 1;
            else if (a.name < b.name) return -1;
            return 0;
          });
        } else if (this.filterDataBy === 1) {
          //sort ascending by size(type number)
          this.data.sort((a, b) => {
            return Number(a.size.slice(0, -2)) - Number(b.size.slice(0, -2));
          });
        }
      }
      if (sort.order === 2) {
        if (this.filterDataBy === 0) {
          //sort descending by aset name (type string)
          this.data.sort((a, b) => {
            if (b.name > a.name) return 1;
            else if (b.name < a.name) return -1;
            return 0;
          });
        } else if (this.filterDataBy === 1) {
          //sort descending by size(type number)
          this.data.sort((a, b) => {
            return Number(b.size.slice(0, -2)) - Number(a.size.slice(0, -2));
          });
        }
      }
    },

    /*-------------------------------*\
          Asets selection system
    \*-------------------------------*/

    asetsSelectionToggle() {
      //set asets selection to true/false if the selection button is pressed
      this.asetsSelection = !this.asetsSelection;

      if (!this.asetsSelection) {
        //cancel the selection
        this.cancelAsetsSelection();
      }
    },

    selectAset(index) {
      //check the checkbox if selection si true
      if (this.asetsSelection) {
        const checkbox = document.querySelectorAll(
          ".aset--list .select-aset-btn--list input"
        )[index];
        checkbox.checked = !checkbox.checked;
      }
    },

    cancelAsetsSelection() {
      const asets = document.querySelectorAll(".aset--list");
      //set asets selection to false
      this.asetsSelection = false;
      //go trough every aset
      asets.forEach((aset) => {
        //chage the background color to defalut
        aset.style.backgroundColor = "#f7f8fb";
        //hide the checkbox and show the aset image
        aset.querySelector(".select-aset-btn--list").classList.add("hidden");
        aset.querySelector(".aset-image--list").classList.remove("hidden");
        //set the checkboxes to false
        aset.querySelector(".select-aset-btn--list input").checked = false;
      });
    },

    showAsetCheckbox(index) {
      //when asetsSelection is true call the function on mouse over the aset
      const asets = document.querySelectorAll(".aset--list");
      if (this.asetsSelection) {
        //show the checkbox and hide the aset image
        asets[index]
          .querySelector(".select-aset-btn--list")
          .classList.remove("hidden");
        asets[index].querySelector(".aset-image--list").classList.add("hidden");
      }
    },

    hideAsetCheckbox(index) {
      //when asetsSelection is true call the function on mouse leave the aset
      const asets = document.querySelectorAll(".aset--list");
      const checkbox = asets[index].querySelector(
        ".select-aset-btn--list input"
      );
      if (this.asetsSelection && !checkbox.checked) {
        //hide the checkbox and show the aset image if the checkbox is not checked
        asets[index]
          .querySelector(".select-aset-btn--list")
          .classList.add("hidden");
        asets[index]
          .querySelector(".aset-image--list")
          .classList.remove("hidden");
      }
    },
  },
};
</script>

<style>
body {
  overflow: hidden;
}

.content {
  padding: 0 25px;
  border-top: 2px solid #edeef8;
}

.content--header {
  background-color: #f6f9fb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

/*Select asets type button */

.asset-type-dropdown-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
  font-size: 10.5px;
  color: #19172e;
}

.asset-type-dropdown-btn .asset-type--dropdown:first-child {
  margin-right: 5px;
  font-size: 18px;
}

.asset-type-dropdown-btn .asset-type--dropdown:last-child {
  margin-left: 5px;
  font-size: 16px;
}

.change-files-wrapper-format-btn {
  display: flex;
  align-items: center;
  font-size: 16px;
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
  font-weight: 450;
  margin: 0;
  padding: 0;
}

.asets-table--list {
  width: 100%;
  border: none;
  border-collapse: collapse;
}

.asets-table--head--list {
  background-color: #f7f8fb;
  position: sticky;
  top: 55px;
  z-index: 2;
  width: 100%;
  padding: 15px;
  height: 40px;
}

.asets-name-column--list > div {
  display: flex;
  align-items: center;
  margin-left: 10px;
}

.asets-size-column--list > div {
  display: flex;
  align-items: center;
  justify-content: center;
}

.asets-last-accesed-column--list > div {
  display: flex;
  align-items: center;
  justify-content: center;
}

.select-asets-btn--list {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.select-asets-btn--list > div {
  margin-right: 15px;
  margin-top: 10px;
}

.aset--list {
  width: 100%;
  height: 40px;
  background-color: #f7f8fb;
  border-bottom: 2px solid #eceef0;
  padding: 0 10px;
}

.aset--list:hover {
  background-color: #f1f3f8;
}

/*----------asets detalies wrapper---------*/

.aset-name-column--list *,
.aset-name-column--list {
  box-sizing: content-box;
}

.aset-name-column--list {
  display: flex;
  align-items: center;
  word-wrap: break-word;
  word-spacing: 0;
}

.aset-size-column--list,
.aset-last-accesed-column--list {
  display: flex;
  justify-content: center;
  align-items: center;
}

.aset-options-btn-container--list {
  display: flex;
  justify-content: flex-end;
  margin-right: 10px;
}

.aset-options-btn--list {
  font-size: 18px;
  height: 25px;
  width: 25px;
  border-radius: 50%;
}

.aset-options-btn--list:hover {
  background-color: #e6e9ee;
}

/*-----------------Aset image-------------*/
.select-aset-btn--list {
  display: grid;
  align-items: center;
  font-size: 18px;
  height: 33px;
  width: 33px;
  border-radius: 50%;
  margin: 0 5px;
  font-size: 19px;
}

.select-aset-btn--list input {
  height: 15px;
}

.select-aset-btn--list:hover {
  background-color: #e6e9ee;
}

.aset-image--list {
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

.aset-image--list img {
  height: 25px;
  width: auto;
  border-radius: 50%;
}
</style>
