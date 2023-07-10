<template>
  <router-view v-if="!$store.state.isAuthenticated" />
  <sidebar v-if="$store.state.isAuthenticated"></sidebar>
  <main v-if="$store.state.isAuthenticated" class="centering-container">
    <div class="main-container">
      <navbar></navbar>
      <router-view />
    </div>
  </main>
</template>

<script>
import sidebar from "@/components/sidebar";
import navbar from "@/components/navbar";

export default {
  name: "App",
  components: {
    sidebar,
    navbar,
  },
  data() {
    return {};
  },
  methods: {},
  mounted() {},
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

#app {
  background: linear-gradient(
    to bottom,
    #1c2034,
    #1c263b,
    #183248,
    #183a4c,
    #243a50,
    #2f354f,
    #20284c,
    #1b2146,
    #191b34
  );
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
}

.centering-container {
  background-color: transparent;
  display: grid;
  place-items: center;
  width: 83%;
  height: 100%;
}

.main-container {
  background-color: #f6f9fb;
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  border-radius: 10px;
}
</style>
