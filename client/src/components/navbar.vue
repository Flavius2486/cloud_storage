<template>
  <div class="navbar">
    <div class="navbar__left-side--group">
      <div class="theme-toggle">
        <fa :icon="['far', 'sun']" />
      </div>
    </div>
    <div class="search-bar">
      <div class="search-icon">
        <fa :icon="['fas', 'magnifying-glass']" />
      </div>
      <input type="search" placeholder="Search" />
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
</template>

<script>
import Dropdown from "@/components/dropdown/dropdown.vue";
import DropdownOption from "@/components/dropdown/dropdownOption";
import axios from "axios";
import config from "@/config.json";

export default {
  name: "nav-bar",
  components: {
    Dropdown,
    DropdownOption,
  },
  methods: {
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
        .post(
          `${config.BASE_URL}/logout`,
          { token: window.$cookies.get("refreshToken") },
          { withCredentials: true }
        )
        .then(() => {
          this.$router.go();
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style>
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
}

.navbar__right-side--group {
  margin-right: 25px;
}

.theme-toggle {
  background-color: #ebeaef;
  color: #363745;
  border-radius: 50%;
  height: 35px;
  width: 35px;
  display: grid;
  place-items: center;
  font-size: 18px;
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
</style>
