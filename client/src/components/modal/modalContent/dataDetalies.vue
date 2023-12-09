<template>
  <div class="detalies-container">
    <p class="data-info"><b>Name:</b> {{ data.name }}</p>
    <p class="data-info"><b>Original Name:</b> {{ data.original_name }}</p>
    <p class="data-info"><b>Location:</b> {{ data.frontend_path }}</p>
    <p class="data-info"><b>Size:</b> {{ data.size }} MB</p>
    <p class="data-info"><b>Starred:</b> {{ data.starred }}</p>
    <!-- <p class="data-info"><b>Public:</b> {{ data.public }}</p> -->
    <p class="data-info"><b>Type:</b> {{ data.type }}</p>
    <p class="data-info"><b>Last accessed:</b> {{ data.last_accessed }}</p>
    <p class="data-info"><b>Creation date:</b> {{ data.creation_date }}</p>
  </div>
</template>

<script>
export default {
  name: "data-delaties",
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
};
</script>

<style scoped>
.detalies-container {
  width: 100%;
  height: 100%;
  max-width: 200px;
  max-height: 200px;
  overflow-y: auto;
  padding-right: 5px;
}

.data-info {
  word-wrap: break-word;
  color: #333343;
  font-size: 17px;
}
</style>
