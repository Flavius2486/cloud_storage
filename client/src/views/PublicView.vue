<template>
  <div class="public-view__header">
    <h1>Public</h1>
  </div>
  <DataWrapper
    :data="data"
    :page="'public'"
    @update-data="updateData()"
  ></DataWrapper>
</template>

<script>
import DataWrapper from "@/components/dataWrapper";
import fetchData from "@/utils/fetchData";

export default {
  components: { DataWrapper },
  data() {
    return {
      data: [],
    };
  },
  created() {
    this.updateData();
  },
  methods: {
    updateData() {
      fetchData("public")
        .then((dataArray) => {
          this.data = dataArray;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
  },
};
</script>

<style scoped>
.public-view__header {
  padding: 25px;
  background-color: #f7f8fb;
}

.public-view__header > h1 {
  color: #333343;
  font-size: 35px;
}
</style>
