<template>
  <div>
    <p class="modal-subtitle">Name</p>
    <input
      class="data-new-name-input input-field"
      type="text"
      placeholder="Enter new name"
    />
  </div>
  <div class="create-folder-btn modal-btn" @click="rename()">Rename</div>
</template>

<script>
import axios from "axios";
import "@/components/modal/modalContent/style.css";

export default {
  name: "rename-data",
  emits: ["hide-modal", "update-data"],
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  methods: {
    rename() {
      const newNameInput = document.querySelector(".data-new-name-input");
      if (newNameInput.value.length === 0) {
        newNameInput.style.borderColor = "red";
      } else {
        newNameInput.style.borderColor = "#CDCDD6";
        axios
          .post(
            `/api/rename-data`,
            {
              newName: newNameInput.value,
              data: this.data,
            },
            { withCredentials: true }
          )
          .then((response) => {
            this.$emit("hide-modal", response.data);
            this.$emit("update-data");
          });
      }
    },
  },
};
</script>
