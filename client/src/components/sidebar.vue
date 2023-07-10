<template>
  <aside class="sidebar">
    <header class="sidebar-header">
      <div class="title"><b>Personal Cloud</b></div>
      <div v-for="(button, index) in sidebarBtns" :key="index" class="nav-btns">
        <SidebarButton
          @click="setActivePage(index)"
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
        {{ usedStorage.value }}{{ usedStorage.unit }} out of
        {{ freeStorage.value }}{{ freeStorage.unit }} used
      </div>
    </div>
  </aside>
</template>

<script>
import SidebarButton from "@/components/sidebarButton.vue";

export default {
  name: "side-bar",
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
          active: true,
        },
        {
          icon: ["far", "clock"],
          color: "#A4ADD3",
          text: "Recents",
          active: false,
        },
        {
          icon: ["far", "star"],
          color: "yellow",
          text: "Starred",
          active: false,
        },
        {
          icon: ["far", "user"],
          color: "#5c9f19",
          text: "Public",
          active: false,
        },
        {
          icon: ["far", "trash-can"],
          color: "red",
          text: "Deleted",
          active: false,
        },
      ],
      usedStorage: { value: 25, unit: "GB" },
      freeStorage: { value: 50, unit: "GB" },
    };
  },
  methods: {
    setActivePage(index) {
      this.sidebarBtns.forEach((button) => {
        button.active = false;
      });
      this.sidebarBtns[index].active = true;
    },
    progressBar() {
      const usedStorage =
        (this.usedStorage.value / this.freeStorage.value) * 100;
      console.log(usedStorage);
      document.querySelector(".progress-bar span").style.width =
        usedStorage + "%";
    },
  },
  mounted() {
    this.progressBar();
  },
};
</script>

<style>
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
}

.divider {
  height: 0.5px;
  width: calc(100% - 10px);
  background-color: #9da6f8;
  margin: 20px 10px 0 10px;
}

.storage-informations {
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
</style>
