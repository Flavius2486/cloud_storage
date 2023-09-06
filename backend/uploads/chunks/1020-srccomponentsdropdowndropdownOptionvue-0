<template>
  <div class="dropdown-option">
    <fa :icon="icon" class="icon" />
    <p><slot></slot></p>
    <input
      v-if="type == 'folder'"
      type="file"
      style="display: none"
      multiple="true"
      webkitdirectory
    />
    <input
      v-else-if="type == 'file'"
      type="file"
      style="display: none"
      multiple="true"
      webkitfolder
    />
  </div>
</template>

<script>
export default {
  name: "dropdown-option",
  props: {
    type: {
      type: String,
      default: "none",
      required: false,
    },
    icon: {
      type: Array,
      required: true,
    },
  },
  methods: {},
};
</script>

<style>
.dropdown-option {
  font-size: 17px;
  color: #323541;
  padding: 5px 10px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
}

.dropdown-option p {
  margin-left: 10px;
}

.dropdown-option:hover {
  background-color: #e7e9ef;
}

.icon {
  width: 20px;
  font-size: 16px;
}
</style>
