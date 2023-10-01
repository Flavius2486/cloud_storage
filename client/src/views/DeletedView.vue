<template>
  <div class="deleted-view__header">
    <h1>Deleted</h1>
  </div>
  <DataWrapper :data="$store.state.deletedData" :page="'deleted'"></DataWrapper>
</template>

<script>
import DataWrapper from "@/components/dataWrapper";

export default {
  components: { DataWrapper },
};
</script>

<style scoped>
.deleted-view__header {
  padding: 25px;
  background-color: #f7f8fb;
}

.deleted-view__header > h1 {
  color: #333343;
  font-size: 35px;
}
</style>
