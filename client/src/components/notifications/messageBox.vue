<template>
  <div class="message-box"></div>
</template>

<script>
export default {
  //   props: {
  //     message: {
  //       type: String,
  //     },
  //   },
  methods: {
    showMessage(message) {
      const messageBox = document.querySelector(".message-box");
      messageBox.innerHTML = message;
      messageBox.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 500,
        forwards: true,
      });
      messageBox.style.display = "block";
      setTimeout(() => {
        messageBox.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 500,
          forwards: true,
        }).onfinish = () => {
          messageBox.style.display = "none";
        };
      }, 4000);
    },
  },
};
</script>

<style scoped>
.message-box {
  display: none;
  position: absolute;
  padding: 10px;
  background-color: #1e1f1e;
  border-radius: 10px;
  color: #f5f4f5;
  animation-duration: 0.5s;
  z-index: 1;
}
</style>
