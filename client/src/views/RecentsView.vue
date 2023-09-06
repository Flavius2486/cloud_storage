<template>
  <DataWrapper :data="$store.state.recentData"></DataWrapper>
</template>

<script>
import DataWrapper from "@/components/dataWrapper";

export default {
  components: { DataWrapper },
};
</script>
