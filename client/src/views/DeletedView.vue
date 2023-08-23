<template>
  <AsetsWrapper :data="$store.state.deletedFiles"></AsetsWrapper>
</template>

<script>
import AsetsWrapper from "@/components/asetsWrapper";

export default {
  components: { AsetsWrapper },
};
</script>
