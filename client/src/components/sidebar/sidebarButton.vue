<template>
  <div
    class="sidebar-btn"
    :class="{ active: active }"
    @mouseover="iconAnimation = true"
    @mouseleave="iconAnimation = false"
  >
    <div class="icon-container">
      <fa :icon="icon" :style="{ color: iconColor }" :beat="iconAnimation" />
    </div>
    <p>{{ buttonText }}</p>
  </div>
</template>

<script>
export default {
  name: "siedbar-btn",
  props: {
    icon: {
      type: Array,
      required: true,
    },
    iconColor: {
      type: String,
      required: true,
    },
    buttonText: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      iconAnimation: false,
    };
  },
};
</script>

<style scoped>
.sidebar-btn {
  display: flex;
  align-items: center;
  margin-bottom: 3px;
  margin-left: 10px;
  padding: 7px 12px;
  user-select: none;
  box-sizing: border-box;
  height: 35px;
}

.sidebar-btn.active {
  border: #274a62 solid 1px;
  border-radius: 10px;
  background: linear-gradient(to right, #22455f, rgba(255, 0, 0, 0));
  padding: 7px 11px;
}

.icon-container {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
}

.sidebar-btn p {
  font-size: 16px;
  color: #dbeff4;
  margin-left: 10px;
}
</style>
