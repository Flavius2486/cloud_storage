<template>
  <AsetsWrapper :data="$store.state.recentFiles"></AsetsWrapper>
</template>

<script>
import AsetsWrapper from "@/components/asetsWrapper";

export default {
  components: { AsetsWrapper },
};
</script>
