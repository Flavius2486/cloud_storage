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
      if (newNameInput.value.length === 0 || newNameInput.value.length > 150) {
        newNameInput.style.borderColor = "red";
      } else {
        newNameInput.style.borderColor = "#CDCDD6";
        let newName = newNameInput.value;
        if (
          this.data.type === "file" &&
          this.data.unique_identifier.match(/\.([^.]+)$/)
        ) {
          newName += "." + this.data.unique_identifier.match(/\.([^.]+)$/)[1];
        }
        axios
          .post(
            `${import.meta.env.VITE_API_URL}/rename-data`,
            {
              newName: newName,
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
