<template>
  <aside class="sidebar">
    <div class="title">Personal Cloud</div>
    <div class="nav-btns">
      <div class="dashboard-btn nav-btn">
        <font-awesome-icon icon="fa-regular fa-star" style="color: #d7da25" />
        Dashboard
      </div>
    </div>
    <div class="storage-informations"></div>
  </aside>
</template>

<script>
export default {
  name: "side-bar",
  data() {
    return {
      name: null,
    };
  },
};
</script>

<style>
.sidebar {
  background: transparent;
  width: 20%;
}
</style>
