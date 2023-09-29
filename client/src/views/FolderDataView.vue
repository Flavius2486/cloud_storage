<template>
  <div class="header">
    <p>
      <i>{{ folder.frontend_path }}/{{ folder.name }}/</i>
    </p>
  </div>
  <DataWrapper @update-data="fetchFolderData" :data="data"></DataWrapper>
</template>

<script>
import DataWrapper from "@/components/dataWrapper.vue";
import axios from "axios";
import config from "@/config.json";

export default {
  components: {
    DataWrapper,
  },
  props: ["folderIdentifier"],
  data() {
    return {
      data: [],
      folder: {},
    };
  },
  methods: {
    fetchFolderData() {
      this.data = [];
      axios
        .post(
          `${config.BASE_URL}/folder-data`,
          {
            folderIdentifier: this.$route.params.folderIdentifier,
          },
          { withCredentials: true }
        )
        .then((response) => {
          this.data = response.data.folderContent;
          this.folder = response.data.folderData;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    this.fetchFolderData();
  },
};
</script>

<style scoped>
.header {
  padding: 15px;
  background-color: #f7f8fb;
}

.header > p {
  color: #333343;
  font-size: 30px;
}
</style>
