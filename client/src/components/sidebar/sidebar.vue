<template>
  <aside class="sidebar">
    <header class="sidebar-header">
      <div class="title">
        <b>Personal Cloud</b>
        <div class="close-sidebar-btn" @click="$emit('close-sidebar')">
          <fa :icon="['fas', 'xmark']" />
        </div>
      </div>
      <div v-for="(button, index) in sidebarBtns" :key="index" class="nav-btns">
        <SidebarButton
          @click="
            setActivePage(index);
            $emit('close-sidebar');
          "
          :icon="button.icon"
          :iconColor="button.color"
          :buttonText="button.text"
          :active="button.active"
        ></SidebarButton>
      </div>
      <div class="divider"></div>
    </header>
    <div class="storage-informations">
      <div class="divider"></div>
      <div class="storage-title">
        <fa :icon="['fas', 'cloud']" style="color: #2ab7e8" />
        <p>Storage</p>
      </div>
      <div class="progress-bar">
        <span></span>
      </div>
      <div class="storage-informations-text">
        {{ ($store.state.usedMemory / Math.pow(1023, 3)).toFixed(2) }}GB out of
        {{ ($store.state.totalMemory / Math.pow(1023, 3)).toFixed(2) }}GB used
      </div>
    </div>
  </aside>
</template>

<script>
import SidebarButton from "@/components/sidebar/sidebarButton.vue";

export default {
  name: "side-bar",
  emits: ["close-sidebar"],
  components: {
    SidebarButton,
  },
  data() {
    return {
      sidebarBtns: [
        {
          icon: ["fas", "qrcode"],
          color: "#2ab7e8",
          text: "Dashboard",
          active: false,
          page: "dashboard",
        },
        {
          icon: ["far", "clock"],
          color: "#A4ADD3",
          text: "Recents",
          active: false,
          page: "recents",
        },
        {
          icon: ["far", "star"],
          color: "yellow",
          text: "Starred",
          active: false,
          page: "starred",
        },
        {
          icon: ["far", "trash-can"],
          color: "#d31c1c",
          text: "Deleted Files",
          active: false,
          page: "deleted",
        },
      ],
    };
  },
  methods: {
    setActivePage(index) {
      // this.sidebarBtns.forEach((button) => {
      //   button.active = false;
      // });
      // this.sidebarBtns[index].active = true;
      this.$router.replace({ name: this.sidebarBtns[index].page });
    },
    progressBar() {
      const usedStorage =
        (Math.floor(this.$store.state.usedMemory) /
          this.$store.state.totalMemory) *
        100;
      document.querySelector(".progress-bar span").style.width =
        usedStorage + "%";
    },
  },
  mounted() {
    this.progressBar();
  },
  watch: {
    $route(to) {
      this.sidebarBtns.forEach((button) => {
        button.active = false;
        if (to.fullPath.split("/").includes(button.page)) {
          button.active = true;
        }
      });
    },
    "$store.state.usedMemory"() {
      this.progressBar();
    },
  },
};
</script>

<style scoped>
.sidebar {
  background: transparent;
  padding: 20px 0;
  width: 17%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.title {
  color: #f9f9fb;
  font-size: 25px;
  margin: 0 auto 15px 25px;
  display: flex;
}

.close-sidebar-btn {
  margin-right: 0px;
  font-size: 22px;
  display: none;
}

.divider {
  height: 0.5px;
  width: calc(100% - 10px);
  background-color: #577082;
  margin: 20px 10px 0 10px;
}

.storage-title {
  display: flex;
  height: 20px;
  align-items: center;
  margin-left: 20px;
  font-size: 15px;
  margin-top: 20px;
}

.storage-title p {
  margin-left: 10px;
  color: #dbeff4;
}

.progress-bar {
  width: 65%;
  height: 6px;
  border-radius: 5px;
  margin: 10px 10px;
  overflow: hidden;
  position: relative;
  margin: 10px 50px 5px 50px;
  background-color: #36395b;
}

.progress-bar span {
  height: 100%;
  display: block;
  width: 0;
  color: rgb(255, 251, 251);
  line-height: 30px;
  position: absolute;
  text-align: end;
  padding-right: 5px;
  background-color: #2ab7e8;
}

.storage-informations-text {
  font-size: 12px;
  color: #9b9cab;
  margin-left: 50px;
  margin-bottom: 5px;
}

@media screen and (min-width: 1150px) {
  .sidebar {
    display: flex !important;
  }
}

@media screen and (max-width: 1150px) {
  .sidebar {
    display: none;
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
    position: absolute;
    z-index: 12000;
    padding: 10px 0;
    width: 220px;
    border-radius: 10px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    padding-right: 10px;
    height: 100%;
    overflow: auto;
  }
  .title {
    display: flex;
    justify-content: space-between;
    font-size: 20px;
    margin-top: 0px;
  }

  .close-sidebar-btn {
    display: block;
  }

  /* .divider {
    display: none;
  } */
}
</style>
