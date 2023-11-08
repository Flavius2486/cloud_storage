<template>
  <div class="header">
    <p>
      <i>{{ folder.frontend_path }}/{{ folder.name }}/</i>
    </p>
  </div>
  <DataWrapper
    @fetch-folder-data="fetchFolderData"
    @update-data="fetchFolderData"
    :data="data"
    :page="'folder'"
  ></DataWrapper>
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

    updateFolderLastAccesse() {
      axios
        .post(
          `${config.BASE_URL}/update-last-access`,
          {
            folderIdentifier: this.$route.params.folderIdentifier,
          },
          { withCredentials: true }
        )
        .then(() => {})
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    this.fetchFolderData();
    this.updateFolderLastAccesse();
  },
  watch: {
    data() {
      this.fetchFolderData();
      this.updateFolderLastAccesse();
    },
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
  word-wrap: break-word;
}
</style>
