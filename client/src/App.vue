<template>
  <sidebar></sidebar>
  <main class="main-container">
    <div class="container"></div>
  </main>
  <router-view />
</template>

<script>
import sidebar from "@/components/sidebar";

export default {
  name: "App",
  components: {
    sidebar,
  },
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

.main-container {
  background-color: transparent;
  display: grid;
  place-items: center;
  width: 80%;
  height: 100%;
}

.container {
  background-color: #f6f9fb;
  width: 98%;
  height: 97%;
  border-radius: 10px;
}
</style>
