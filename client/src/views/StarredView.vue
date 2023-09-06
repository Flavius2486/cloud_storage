<template>
  <DataWrapper :data="$store.state.starredData"></DataWrapper>
</template>

<script>
import DataWrapper from "@/components/dataWrapper";

export default {
  components: { DataWrapper },
};
</script>
