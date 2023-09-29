<template>
  <div class="recents-view__header">
    <h1>Recents</h1>
  </div>
  <DataWrapper :data="$store.state.recentData"></DataWrapper>
</template>

<script>
import DataWrapper from "@/components/dataWrapper";

export default {
  components: { DataWrapper },
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
