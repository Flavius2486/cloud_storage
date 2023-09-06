<template>
  <DataWrapper :data="$store.state.publicData"></DataWrapper>
</template>

<script>
import DataWrapper from "@/components/dataWrapper";

export default {
  components: { DataWrapper },
};
</script>
