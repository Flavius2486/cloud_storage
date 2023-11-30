<template>
  <div>
    <div v-if="dataHasLink">
      <p class="modal-subtitle">Link</p>
      <div class="link-container">
        <a ref="link" class="link">{{ baseURL }}/{{ link }}</a>
        <div class="copy-link-btn">
          <p @click="copyLink">Copy</p>
        </div>
      </div>
      <div class="qr-code-container">
        <QRCodeVue3
          :width="200"
          :height="200"
          :value="baseURL + '/' + link"
          :qrOptions="{
            typeNumber: '0',
            mode: 'Byte',
            errorCorrectionLevel: 'Q',
          }"
          :imageOptions="{
            hideBackgroundDots: true,
            imageSize: 0.4,
            margin: 0,
            padding: 0,
          }"
          :dotsOptions="{ type: 'square', color: 'black' }"
          :cornersSquareOptions="{ type: 'square', color: 'black' }"
        />
      </div>
    </div>
    <div v-if="!dataHasLink" class="modal-btn" @click="generateLink()">
      Generate Link
    </div>
    <div v-else class="modal-btn" @click="deleteLink()">Delete Link</div>
  </div>
</template>

<script>
import "@/components/modal/modalContent/style.css";
import QRCodeVue3 from "qrcode-vue3";
import axios from "axios";

export default {
  name: "generate-download-link",
  emits: ["show-message"],
  components: {
    QRCodeVue3,
  },
  props: {
    data: {
      type: Object,
      required: true,
      dafault: () => {},
    },
  },
  data() {
    return {
      dataHasLink: false,
      link: "",
      baseURL: window.location.origin + "/download",
    };
  },
  methods: {
    copyLink() {
      navigator.clipboard.writeText(this.baseURL + "/" + this.link);
    },
    getDownloadLink() {
      axios
        .post(
          `${import.meta.env.VITE_API_URL}/get-download-link`,
          { data: this.data },
          { withCredentials: true }
        )
        .then((response) => {
          if (response.data.link) {
            this.link = response.data.link;
            this.dataHasLink = true;
          } else {
            this.dataHasLink = false;
          }
        })
        .catch((err) => {
          this.dataHasLink = false;
          console.log(err);
        });
    },
    generateLink() {
      axios
        .post(
          `${import.meta.env.VITE_API_URL}/generate-download-link`,
          { data: this.data },
          { withCredentials: true }
        )
        .then((response) => {
          if (response.data.link) {
            this.link = response.data.link;
            this.dataHasLink = true;
          } else {
            this.$emit("show-message", response.data.message);
          }
        });
    },
    deleteLink() {
      axios
        .post(
          `${import.meta.env.VITE_API_URL}/delete-download-link`,
          { data: this.data },
          { withCredentials: true }
        )
        .then(() => {
          this.link = null;
          this.dataHasLink = false;
        });
    },
  },
};
</script>

<style scoped>
.link-container {
  width: 250px;
  display: flex;
  flex-direction: column;
}
.link {
  padding: 0 3px;
  display: grid;
  align-items: center;
  font-size: 19px;
  font-family: emoji;
  width: 250px;
  height: 45px;
  border-radius: 5px;
  border: 1px solid #efeff1;
  box-shadow: 0px 1px 2px 0px #ccced3;
  overflow-x: hidden;
  overflow-y: auto;
  word-break: break-all;
}

.copy-link-btn {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  user-select: none;
  color: #3957ab;
}

.qr-code-container {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
