<template>
  <DataWrapper :data="$store.state.deletedData"></DataWrapper>
</template>

<script>
import DataWrapper from "@/components/dataWrapper";

export default {
  components: { DataWrapper },
};
</script>
