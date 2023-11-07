<template>
  <DataWrapper :data="data" :page="'search'"></DataWrapper>
</template>

<script>
import DataWrapper from "@/components/dataWrapper";
import axios from "axios";
import config from "@/config.json";

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
            `${config.BASE_URL}/search`,
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
