<template>
  <AsetsWrapper :data="$store.state.publicFiles"></AsetsWrapper>
</template>

<script>
import AsetsWrapper from "@/components/asetsWrapper";

export default {
  components: { AsetsWrapper },
};
</script>
