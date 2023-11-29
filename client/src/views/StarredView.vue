<template>
  <div class="starred-view__header">
    <h1>Starred</h1>
  </div>
  <DataWrapper
    :data="data"
    :page="'starred'"
    @update-data="updateData()"
  ></DataWrapper>
</template>

<script>
import DataWrapper from "@/components/dataWrapper.vue";
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
      fetchData("starred")
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
.starred-view__header {
  user-select: none;
  padding: 25px;
  background-color: #f7f8fb;
}

.starred-view__header > h1 {
  color: #333343;
  font-size: 35px;
}

@media screen and (max-width: 1150px) {
  .starred-view__header {
    padding: 15px;
  }
}
</style>
