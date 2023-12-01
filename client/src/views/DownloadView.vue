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
        `${import.meta.env.VITE_API_URL}/tmp-link-download`,
        {
          link: this.$route.params.identifier,
        },
        { responseType: "blob", withCredentials: true }
      )
      .then((file) => {
        axios
          .post(
            `${import.meta.env.VITE_API_URL}/get-data-name`,
            { link: this.$route.params.identifier },
            { withCredentials: true }
          )
          .then((response) => {
            if (response.data.dataName) {
              const blob = new Blob([file.data], {
                type: file.data.type,
              });
              console.log(file.data.type);

              const link = document.createElement("a");
              link.href = window.URL.createObjectURL(blob);
              link.download = response.data.dataName;
              link.click();
            } else {
              this.$router.replace({
                name: "login",
              });
            }
          })
          .catch((err) => {
            console.log(err);
            this.$router.replace({
              name: "login",
            });
          });
      })
      .catch((err) => {
        console.log(err);
        this.$router.replace({
          name: "login",
        });
      });
  },
};
</script>
