<template>
  <DataWrapper :data="data" :page="'search'"></DataWrapper>
</template>

<script>
import DataWrapper from "@/components/dataWrapper.vue";
import axios from "axios";

export default {
  components: { DataWrapper },
  props: ["query"],
  data() {
    return {
      data: [],
    };
  },
  methods: {
    search() {
      this.$store.commit("setDataStatus", { state: false });
      let query = [];
      if (this.$route.params.query) {
        query = this.$route.params.query.split("?");
        axios
          .post(
            `${import.meta.env.VITE_API_URL}/search`,
            { query: query },
            { withCredentials: true }
          )
          .then((response) => {
            this.data = response.data.data;
            this.$store.commit("setDataStatus", { state: true });
          })
          .catch((error) => {
            throw error;
          });
      } else {
        this.data = [];
        this.$store.commit("setDataStatus", { state: true });
      }
    },
  },
  mounted() {
    this.search();
  },
  watch: {
    "$route.params.query": function () {
      this.search();
    },
  },
};
</script>

<style scoped></style>
