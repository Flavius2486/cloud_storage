<template>
  <router-view v-if="!$store.state.isAuthenticated" />
  <sidebar
    @click.stop
    @close-sidebar="hideSidebar"
    class="sidebar"
    v-if="$store.state.isAuthenticated"
  ></sidebar>
  <div @click="hideSidebar" class="overlay-app hidden"></div>
  <main
    @click.stop="hideDropdowns"
    v-if="$store.state.isAuthenticated"
    class="centering-container"
  >
    <div class="main-container" @scroll="hideDropdowns">
      <navbar ref="navbar" @show-sidebar="openSidebar"></navbar>
      <router-view />
    </div>
  </main>
</template>

<script>
import sidebar from "@/components/sidebar/sidebar.vue";
import navbar from "@/components/navbar.vue";
import refreshToken from "@/utils/refreshToken.js";
import axios from "axios";

export default {
  name: "App",
  components: {
    sidebar,
    navbar,
  },
  data() {
    return {
      showSidebar: false,
    };
  },
  methods: {
    openSidebar() {
      const sidebar = document.querySelector(".sidebar");
      sidebar.style.display = "flex";
      document.querySelector(".overlay-app").classList.remove("hidden");
      this.hideDropdowns();
    },
    hideSidebar() {
      if (this.$store.state.isAuthenticated) {
        const sidebar = document.querySelector(".sidebar");
        sidebar.style.display = "none";
      }
      if (this.showSidebar) this.showSidebar = false;
      document.querySelector(".overlay-app").classList.add("hidden");
    },
    hideDropdowns() {
      const dropdowns = document.querySelectorAll(".dropdown");
      dropdowns.forEach((dropdown) => {
        dropdown.classList.add("hidden");
      });
      const asets = document.querySelectorAll(".file");
      asets.forEach((aset) => {
        aset.style.backgroundColor = "#f7f8fb";
      });
      //hide info modal
      if (this.$store.state.isAuthenticated && this.$refs.navbar)
        this.$refs.navbar.hideInfoModal();
    },
  },
  mounted() {
    if (this.$store.state.isAuthenticated) {
      refreshToken();
    }
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/reset-data`,
        {},
        { withCredentials: true }
      )
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  },
  created: function () {
    window.addEventListener("click", () => {
      this.hideDropdowns();
    });
  },
  watch: {
    "$store.state.isAuthenticated": {
      immediate: true,
      handler(newVal) {
        if (newVal === true) {
          window.setInterval(() => {
            refreshToken();
          }, 1800000);
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

.hidden {
  display: none;
}

/* Hide the scrollbar when not hovered */
::-webkit-scrollbar {
  height: 6px;
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

@media screen and (max-width: 1150px) {
  .main-container,
  .centering-container {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
  .overlay-app {
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: 11;
    filter: blur(5px);
  }
}
</style>
