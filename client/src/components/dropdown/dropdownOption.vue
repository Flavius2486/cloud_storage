<template>
  <div class="dropdown-option">
    <fa :icon="icon" class="icon" />
    <p><slot></slot></p>
    <input v-if="typeInput" type="file" style="display: none" />
  </div>
</template>

<script>
export default {
  name: "dropdown-option",
  props: {
    typeInput: {
      type: Boolean,
      default: false,
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
