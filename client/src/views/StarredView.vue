<template>
  <AsetsWrapper :data="$store.state.starredFiles"></AsetsWrapper>
</template>

<script>
import AsetsWrapper from "@/components/asetsWrapper";

export default {
  components: { AsetsWrapper },
};
</script>
