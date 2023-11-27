<template>
  <div class="header">
    <p>
      <i>{{ folder.frontend_path }}/{{ folder.name }}/</i>
    </p>
  </div>
  <DataWrapper
    @update-data="fetchFolderData"
    @fetch-folder-data="fetchFolderData"
    :data="data"
    :page="'folder'"
    :prevPage="prevPage"
  ></DataWrapper>
</template>

<script>
import DataWrapper from "@/components/dataWrapper.vue";
import axios from "axios";

export default {
  components: {
    DataWrapper,
  },
  props: ["folderIdentifier"],
  data() {
    return {
      prevPage: "",
      data: [],
      folder: {},
    };
  },
  methods: {
    fetchFolderData() {
      this.$store.commit("setDataStatus", { state: false });
      axios
        .post(
          `/api/folder-data`,
          {
            folderIdentifier: this.$route.params.folderIdentifier,
            page: this.prevPage,
          },
          { withCredentials: true }
        )
        .then((response) => {
          this.$store.commit("setDataStatus", { state: true });
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
          `/api/update-last-access`,
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
    this.prevPage = this.$route.params.page;
    this.fetchFolderData();
    this.updateFolderLastAccesse();
  },
  watch: {
    $route() {
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
