<template>
  <main class="content">
    <header class="content--header">
      <div class="left-side--header">
        <div
          class="file-type-dropdown-btn file-type--dropdown"
          @click="showDropdown($event)"
        >
          <fa
            :icon="selectedfileType.icon"
            class="file-type--dropdown file-type-dropdown-btn-icon"
          />
          <h1 class="file-type--dropdown">{{ selectedfileType.text }}</h1>
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
            v-for="(option, index) in filesTypes"
            :key="index"
            class="dropdown-option-for"
          >
            <DropdownOption
              :icon="option.icon"
              v-if="selectedfileType.text !== option.text"
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
          <div>
            <fa :icon="['fas', 'check-to-slot']" />
          </div>
        </div>
      </div>
      <div class="files-container-table-format">
        <div
          v-for="(file, index) in dataCopy"
          :key="index"
          @mouseenter="showfileCheckbox(index)"
          @mouseleave="hidefileCheckbox(index)"
          @click.stop="selectfile(index)"
          class="file--table file"
        >
          <div class="file-name-column">
            <div class="select-file-btn hidden">
              <input type="checkbox" @click.stop @click.prevent />
            </div>
            <div class="file-image">
              <img src="@/assets/logo.png" />
            </div>
            <p class="file-name">{{ file.name }}</p>
          </div>
          <div class="file-options-btn-container">
            <div
              class="file-options-btn file-dropdown file-options--dropdown"
              @click="showDropdown($event, index)"
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
            <p>Last accesed</p>
          </div>
        </th>
        <th>
          <div class="select-files-btn" @click="filesSelectionToggle()">
            <div>
              <fa :icon="['fas', 'check-to-slot']" />
            </div>
          </div>
        </th>
      </tr>
      <tr
        class="file--list file"
        v-for="(file, index) in data"
        :key="index"
        @mouseenter="showfileCheckbox(index)"
        @mouseleave="hidefileCheckbox(index)"
        @click.stop="selectfile(index)"
      >
        <th>
          <div class="file-name-column">
            <div class="select-file-btn hidden">
              <input type="checkbox" @click.stop @click.prevent />
            </div>
            <div class="file-image">
              <img src="@/assets/logo.png" />
            </div>
            <p class="file-name">{{ file.name }}</p>
          </div>
        </th>
        <th>
          <p class="file-size">{{ file.size }}</p>
        </th>
        <th>
          <p class="file-last-accesed">{{ file.last_accessed }}</p>
        </th>
        <th>
          <div class="file-options-btn-container">
            <div
              class="file-options-btn file-dropdown file-options--dropdown"
              @click="showDropdown($event, index)"
            >
              <fa :icon="['fas', 'ellipsis']" class="file-options--dropdown" />
            </div>
          </div>
        </th>
      </tr>
    </table>
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
          :style="{ fontSize: '13px' }"
          :icon="option.icon"
          v-if="selectedfileType.text !== option.text"
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
  props: {
    data: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data() {
    return {
      filesSelection: false,
      tableFormat: false,
      selectedfileType: {
        icon: ["fas", "briefcase"],
        type: "all",
        text: "All",
      },
      filesTypes: [
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
      dataCopy: this.data,
    };
  },
  methods: {
    showDropdown(event, index) {
      console.log(this);
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
      this.selectedfileType = this.filesTypes[index];
      if (this.selectedfileType.type !== "all") {
        //return only the files that has the specified type
        this.dataCopy = this.data.filter((file) => {
          if (this.filesTypes[index].type === file.type) return true;
        });
      } else {
        //return all the files
        this.dataCopy = this.data;
      }
      this.sortDataInOrder();
    },

    setfilesWrapperFormat() {
      this.tableFormat = !this.tableFormat;
      this.filesSelection = false;
    },

    setSortingOrder() {
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

    filesSelectionToggle() {
      //set files selection to true/false if the selection button is pressed
      this.filesSelection = !this.filesSelection;

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
      }
    },

    cancelfilesSelection() {
      const files = document.querySelectorAll(".file");
      //set files selection to false
      this.filesSelection = false;
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
      },
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
  font-weight: 500;
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
}

.select-files-btn > div {
  margin-right: 15px;
  margin-top: 10px;
  font-size: 17px;
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
  word-spacing: 0;
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
  grid-template-columns: repeat(auto-fit, minmax(240px, 1.2fr));
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
  text-overflow: ellipsis;
}
</style>
