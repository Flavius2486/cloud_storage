<template>
  <p class="modal-subtitle">New path</p>
  <v-select
    :options="availablePaths"
    class="new-path-selector selector"
    label="frontend_path"
    value="unique_path"
    v-model="selectedNewPath"
  >
  </v-select>
  <div class="set-new-path-btn modal-btn" @click="setNewPath()">Move</div>
</template>

<script>
import axios from "axios";
import "@/components/modal/modalContent/style.css";

export default {
  name: "move-data",
  emits: ["hide-modal", "update-data"],
  props: {
    data: {
      type: Object,
      required: true,
      dafault: () => {},
    },
  },
  data() {
    return {
      availablePaths: [],
      availablePathsCopy: [],
      selectedNewPath: { frontend_path: "", unique_path: "" },
    };
  },
  methods: {
    setNewPath() {
      const selector = document.querySelector(".new-path-selector");
      selector.style.border = "none";
      if (this.selectedNewPath.frontend_path.length === 0) {
        selector.style.border = "1px solid red";
      } else {
        if (
          this.selectedNewPath.frontend_path[0] === "/" &&
          this.selectedNewPath.frontend_path.length === 1
        ) {
          this.selectedNewPath.frontend_path =
            this.selectedNewPath.frontend_path.slice(1);
        } else {
          this.selectedNewPath.frontend_path =
            this.selectedNewPath.frontend_path.slice(1, -1);
        }
        axios
          .post(
            `/api/set-new-path`,
            {
              targetFolder: this.selectedNewPath,
              dataToMove: this.data,
            },
            { withCredentials: true }
          )
          .then((response) => {
            this.$emit("update-data");
            this.$emit("hide-modal", response.data);
          });
      }
    },
  },
  watch: {
    data(newVal) {
      axios
        .post(
          `/api/fetch-data`,
          {
            dataCategory: "folders",
          },
          { withCredentials: true }
        )
        .then((response) => {
          this.availablePaths = response.data.dataArray;
          this.availablePaths = this.availablePaths.filter((folder) => {
            return !folder.unique_path
              .split("/")
              .includes(newVal.unique_identifier);
          });
        });
    },
  },
};
</script>
