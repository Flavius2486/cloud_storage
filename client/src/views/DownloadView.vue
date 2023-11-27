<template><div></div></template>

<script>
import axios from "axios";
export default {
  name: "tmp-download",
  data() {
    return {};
  },
  mounted() {
    axios
      .post(
        `/api/tmp-link-download`,
        {
          link: this.$route.params.identifier,
        },
        { responseType: "blob", withCredentials: true }
      )
      .then((response) => {
        console.log(response);
        if (response.headers.dataisavailable == 1) {
          const blob = new Blob([response.data], {
            type: "application/zip",
          });

          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = response.headers.dataname;
          link.click();
          window.close();
        } else {
          this.$router.replace({
            name: "login",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>
