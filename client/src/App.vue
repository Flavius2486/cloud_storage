<template>
  <router-view v-if="!$store.state.isAuthenticated" />
  <sidebar v-if="$store.state.isAuthenticated"></sidebar>
  <main v-if="$store.state.isAuthenticated" class="centering-container">
    <div class="main-container" @scroll="hideDropdowns">
      <navbar></navbar>
      <router-view />
    </div>
  </main>
</template>

<script>
import sidebar from "@/components/sidebar/sidebar";
import navbar from "@/components/navbar";
import fetchData from "@/utils/fetchData";
import refreshToken from "@/utils/refreshToken";

export default {
  name: "App",
  components: {
    sidebar,
    navbar,
  },
  data() {
    return {};
  },
  methods: {
    hideDropdowns() {
      const dropdowns = document.querySelectorAll(".dropdown");
      dropdowns.forEach((dropdown) => {
        dropdown.classList.add("hidden");
      });
      const asets = document.querySelectorAll(".file");
      asets.forEach((aset) => {
        aset.style.backgroundColor = "#f7f8fb";
      });
    },
  },
  mounted: function () {
    refreshToken();
  },
  created: function () {
    window.addEventListener("click", this.hideDropdowns);
  },
  unmounted: function () {
    window.removeEventListener("click", this.hideDropdowns);
  },
  watch: {
    "$store.state.isAuthenticated": {
      immediate: true,
      handler(newVal) {
        if (newVal === true) {
          window.setInterval(() => {
            refreshToken();
          }, 1800000);
          fetchData();
        }
      },
    },
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Arial, Helvetica, sans-serif;
}

#app {
  background: linear-gradient(
    to bottom,
    #1c2034,
    #1c263b,
    #183248,
    #183a4c,
    #243a50,
    #2f354f,
    #20284c,
    #1b2146,
    #191b34
  );
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  overflow: hidden;
}

.centering-container {
  background-color: transparent;
  display: grid;
  place-items: center;
  width: 83%;
  height: 100%;
}

.main-container {
  background-color: #f6f9fb;
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  border-radius: 10px;
  overflow-y: auto;
  overflow-x: hidden;
}

/* Hide the scrollbar when not hovered */
::-webkit-scrollbar {
  width: 6px;
  background-color: #f1f1f1;
  border-radius: 20px;
}

::-webkit-scrollbar-thumb {
  background-color: #c6c5c5; /* Change to desired thumb color */
  border-radius: 5px; /* Add rounded corners to the thumb */
}
::-webkit-scrollbar-thumb:hover {
  background-color: #a9a9a9;
}

input:focus {
  outline-width: 0;
}
</style>
