<template>
  <div class="file-status-container" v-if="status && showFileStatus">
    <div class="status" v-if="status == 'error'">
      <fa
        :icon="['fas', 'circle-exclamation']"
        style="color: #cf1717"
        class="status-icon"
      />
      <p>An error has occurred whle uploading the files</p>
    </div>
    <div class="status" v-if="status == 'success'">
      <fa
        :icon="['far', 'circle-check']"
        style="color: #16ac2f"
        class="status-icon"
      />
      <p>Files uploaded successfully ({{ numberOfFilesToUpload }})</p>
    </div>
    <div class="status" v-if="status == 'uploading'">
      <div class="loader icon"></div>
      <p class="status-text">
        {{ numberOfUploadedFiles }} out of {{ numberOfFilesToUpload }} files
        uploaded
      </p>
    </div>
    <div class="xmark-container" @click="hideFileStatus">
      <fa :icon="['fas', 'xmark']" class="xmark" />
    </div>
  </div>
</template>

<script>
export default {
  name: "file-status",
  props: {
    status: {
      type: String,
      default: null,
    },
    numberOfFilesToUpload: {
      type: Number,
      default: 0,
    },
    numberOfUploadedFiles: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      showFileStatus: true,
    };
  },
  methods: {
    hideFileStatus() {
      this.showFileStatus = false;
    },
  },
  watch: {
    status() {
      this.showFileStatus = true;
    },
  },
};
</script>

<style scoped>
.file-status-container {
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 0;
  width: 330px;
  height: 50px;
  background-color: #fff;
  border-radius: 10px;
  border-bottom-left-radius: 0;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12),
    0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15);
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
}

.status {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
}

.file-status-container .xmark {
  font-size: 22px;
}

.xmark-container {
  font-size: 18px;
  height: 30px;
  width: 33px;
  border-radius: 50%;
  display: grid;
  place-items: center;
}

.xmark-container:hover {
  background-color: #f1f3f8;
}

.status-text {
  position: relative;
  width: 220px;
  height: 50px;
  line-height: 50px;
  margin-left: 45px;
  font-size: 17.5px;
  z-index: 999999;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.status-icon {
  font-size: 25px;
  margin-right: 10px;
}

/*----------------------------------*\
        Status Loading
\*----------------------------------*/

.loader {
  margin-right: 5px;
}

.loader {
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  min-width: 30px;
  height: 30px;
  animation: spin 2s linear infinite;
  position: absolute;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
