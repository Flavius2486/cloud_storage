<template>
  <DataWrapper :data="data" :page="'search'"></DataWrapper>
</template>

<script>
import DataWrapper from "@/components/dataWrapper";

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
      let category = "";
      let dataType = "";
      let searchString = "";
      if (this.$route.params.query) {
        query = this.$route.params.query.split("?");
        category = query[0];
        dataType = query[1];
        searchString = query[2];
        if (this.$store.state[category.toLowerCase() + "Data"]) {
          searchString = searchString.split("-").join(" ");
          this.data = this.$store.state[category.toLowerCase() + "Data"].filter(
            (obj) => {
              if (
                obj.name.toLowerCase().includes(searchString.toLowerCase()) &&
                (obj.type === dataType.toLowerCase() ||
                  dataType.toLowerCase() === "all")
              )
                return true;
              return false;
            }
          );
          let searchArray = searchString.split(" ");
          searchArray.forEach((word) => {
            this.$store.state[category.toLowerCase() + "Data"].forEach(
              (file) => {
                if (
                  file.name.toLowerCase().includes(word.toLowerCase()) &&
                  (file.type === dataType.toLowerCase() ||
                    dataType.toLowerCase() === "all")
                ) {
                  let added = this.data.find((file1) =>
                    file1.name.toLowerCase().includes(word.toLowerCase())
                  );
                  if (!added) this.data.push(file);
                }
              }
            );
          });
        } else this.data = [];
      } else this.data = [];
      this.$store.commit("setDataStatus", { state: true });
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
