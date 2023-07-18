<template>
  <div
    class="file-menu dropdown hidden"
    :style="{ top: style.top, left: style.left }"
  ></div>
</template>

<script>
export default {
  props: {
    style: {
      type: Object,
      required: true,
    },
  },
  methods: {
    showFileMenu() {
      document.querySelector(".file-menu").classList.remove("hidden");
    },
  },
};
</script>

<style>
.file-menu {
  min-width: 160px;
  position: absolute;
  z-index: 99999;
  color: #141323;
  border: 1px solid #e5e4e4;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  background-color: #ffffff;
  animation: growDown 300ms ease-in-out;
  user-select: none;
}

.file-menu > :first-child {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.file-menu > :last-child {
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

@keyframes growDown {
  0% {
    transform: scaleY(0);
  }
  80% {
    transform: scaleY(1.1);
  }
  100% {
    transform: scaleY(1);
  }
}

.hidden {
  display: none !important;
}
</style>
