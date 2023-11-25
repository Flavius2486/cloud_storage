<template>
  <div
    :class="customClass"
    class="dropdown hidden"
    :style="{
      marginTop: style.marginTop,
      marginLeft: style.marginLeft,
    }"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "dropdown-menu",
  props: {
    style: {
      type: Object,
      required: false,
    },
    customClass: {
      type: String,
      required: true,
    },
  },
};
</script>

<style>
.dropdown {
  min-width: 160px;
  position: absolute;
  z-index: 5;
  color: #141323;
  border: 1px solid #e5e4e4;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  background-color: #ffffff;
  animation: growDown 300ms ease-in-out;
  user-select: none;
}

.dropdown-option-for > :first-child,
.dropdown > :first-child {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.dropdown-option-for > :last-child,
.dropdown > :last-child {
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
