<template>
  <div class="navbar">
    <div class="navbar__left-side--group">
      <div class="side-bar-btn" @click.stop="$emit('show-sidebar')">
        <fa :icon="['fas', 'bars']" />
      </div>
      <div class="info-modal-btn" @click.stop="togleInfoModal()">
        <fa :icon="['far', 'circle-question']" />
      </div>
      <div class="info-modal" @click.stop v-show="showInfoModal">
        <p>
          In oreder to search you must use a specific syntax:<br />
          (1) category: dashboard, recents, starred or deleted <br />
          (2) folder name or "all" everything or "/" root
          <br />
          (3) search string <br />
          In the end you will have: (1) | (2) | (3)
        </p>
      </div>
    </div>
    <div class="search-bar">
      <div class="search-icon" @click="search()">
        <fa :icon="['fas', 'magnifying-glass']" />
      </div>
      <input
        v-model="searchQuery"
        type="search"
        placeholder="Search"
        @keyup.enter="search()"
      />
    </div>
    <div class="navbar__right-side--group">
      <div class="settings-btn dropdown-settings" @click="showDropdown($event)">
        <fa :icon="['fas', 'gear']" class="dropdown-settings" />
      </div>
      <Dropdown
        :customClass="'dropdown-settings'"
        :style="{ marginTop: '0px', marginLeft: '-120px' }"
      >
        <DropdownOption
          :icon="['fas', 'arrow-right-from-bracket']"
          @click="logout()"
          >Logout</DropdownOption
        >
      </Dropdown>
    </div>
  </div>
  <MessageBox
    ref="MessageBox"
    :style="{ marginLeft: '15px', bottom: '20px' }"
  ></MessageBox>
</template>

<script>
import Dropdown from "@/components/dropdown/dropdown.vue";
import DropdownOption from "@/components/dropdown/dropdownOption";
import MessageBox from "@/components/notifications/messageBox.vue";
import axios from "axios";

export default {
  name: "nav-bar",
  emits: ["show-sidebar"],
  components: {
    Dropdown,
    DropdownOption,
    MessageBox,
  },
  data() {
    return {
      searchQuery: "",
      showInfoModal: false,
    };
  },
  methods: {
    togleInfoModal() {
      this.showInfoModal = !this.showInfoModal;
    },
    hideInfoModal() {
      this.showInfoModal = false;
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
    logout() {
      axios
        .post(`/api/logout`, {}, { withCredentials: true })
        .then(() => {
          this.$router.go();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    showMessageBox(message) {
      this.$refs.MessageBox.showMessage(message);
    },
    search() {
      let query = [];
      if (this.searchQuery) query = this.searchQuery.split("|");
      if (query.length === 3) {
        query[0] = query[0].trim();
        query[1] = query[1].trim();
        query[2] = query[2]
          .trim()
          .split(" ")
          .map((element) => element.trim())
          .join("-");

        query = query.join("?");

        this.$router.replace({
          name: "search",
          params: {
            query: query,
          },
        });
      } else {
        this.showMessageBox("There is an error in your search syntax.");
      }
    },
  },
};
</script>

<style scoped>
.navbar {
  width: 100%;
  height: 55px;
  border-bottom: 1px solid #e8eaeb;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  background-color: #f6f8fa;
  box-shadow: 0px 2px 3px -2px #ccced3;

  display: flex;
  justify-content: space-between;
  align-items: center;
  top: 0;
  position: sticky;
  z-index: 3;
}

.navbar__left-side--group {
  margin-left: 25px;
  display: flex;
}

.navbar__right-side--group {
  margin-right: 25px;
}

.info-modal-btn,
.side-bar-btn {
  background-color: #ebeaef;
  color: #363745;
  border-radius: 50%;
  height: 30px;
  width: 30px;
  display: grid;
  place-items: center;
  font-size: 16px;
}

.side-bar-btn {
  display: none;
}

.info-modal {
  position: absolute;
  z-index: 3;
  padding: 10px;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  margin-right: 20px;
  margin-top: 35px;
  font-size: 17px;
}

.search-bar {
  display: flex;
  background-color: #ffffff;
  border-radius: 5px;
  border: 1px solid #efeff1;
  box-shadow: 0px 1px 2px 0px #ccced3;
}

.search-bar input {
  width: 400px;
  height: 28px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border: none !important;
  padding: 2px;
  color: #9e9ea2;
  font-size: 15px;
}

.search-bar input:focus {
  border: none;
  outline: none;
}

.search-icon {
  height: 28px;
  width: 30px;
  display: grid;
  place-items: center;
  color: #9e9ea2;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}

.settings-btn {
  font-size: 19px;
  color: #363745;
  width: 20px;
  height: 25px;
  z-index: 99999999;
}

@media screen and (max-width: 1150px) {
  .navbar__left-side--group {
    display: flex;
    justify-content: space-between;
    margin-left: 5px;
    width: 70px;
  }
  .side-bar-btn {
    display: grid;
  }
  .info-modal {
    margin-left: 40px;
    font-size: 16px;
  }
}

@media screen and (max-width: 900px) {
  .search-bar input {
    width: 300px;
  }
  .info-modal {
    font-size: 15px;
  }
}

@media screen and (max-width: 700px) {
  .search-bar input {
    width: 250px;
  }
}

@media screen and (max-width: 500px) {
  .search-bar input {
    width: 180px;
  }
  .info-modal {
    font-size: 14px;
  }
}

@media screen and (max-width: 380px) {
  .search-bar input {
    width: 130px;
  }
}
</style>
