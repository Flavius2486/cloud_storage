<template>
  <div class="recents-view__header">
    <h1>Recents</h1>
  </div>
  <DataWrapper
    :data="data"
    :page="'recents'"
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
      fetchData("recents")
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
.recents-view__header {
  padding: 25px;
  background-color: #f7f8fb;
}

.recents-view__header > h1 {
  color: #333343;
  font-size: 35px;
}
</style>
