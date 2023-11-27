<template>
  <div :class="customClass" class="modal hidden">
    <div class="modal-header">
      <p class="modal-title">{{ title }}</p>
      <div class="close-modal-btn" @click="hideModal()">
        <fa :icon="['fas', 'xmark']" />
      </div>
    </div>
    <div class="modal-body">
      <slot></slot>
    </div>
  </div>
  <div class="overlay hidden" @click="hideModal()"></div>
</template>

<script>
export default {
  name: "common-modal",
  props: {
    title: {
      type: String,
      default: "______",
    },
    customClass: {
      type: String,
      required: true,
    },
  },
  methods: {
    hideModal() {
      const modal = document.querySelectorAll(".modal");
      modal.forEach((modal) => {
        modal.classList.add("hidden");
      });
      document.querySelectorAll(".modal input").forEach((input) => {
        input.value = "";
      });
      document
        .querySelectorAll(".modal .modal-error")
        .forEach((errorMessage) => {
          errorMessage.style.color = "transparent";
        });
      document.querySelector(".overlay").classList.add("hidden");
    },
  },
};
</script>

<style>
.overlay {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 10;
  background-color: black;
  opacity: 0.2;
  filter: blur(10px);
}

.modal {
  padding: 10px;
  border-radius: 10px;
  background-color: #ffffff;
  position: absolute;
  z-index: 11;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 200px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  color: #23232f;
  font-size: 18px;
  padding-bottom: 0px;
  user-select: none;
}

.close-modal-btn {
  margin-left: 40px;
}

.hidden {
  display: none;
}
</style>
