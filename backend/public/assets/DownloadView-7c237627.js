import{_ as i,a as n,o as r,c as l}from"./index-c64f7efd.js";const c={name:"tmp-download",data(){return{}},mounted(){n.post("http://localhost:3002/api/tmp-link-download",{link:this.$route.params.identifier},{responseType:"blob",withCredentials:!0}).then(t=>{n.post("http://localhost:3002/api/get-data-name",{link:this.$route.params.identifier},{withCredentials:!0}).then(e=>{if(e.data.dataName){const o=new Blob([t.data],{type:"application/zip"}),a=document.createElement("a");a.href=window.URL.createObjectURL(o),a.download=e.data.dataName,a.click()}else this.$router.replace({name:"login"})}).catch(e=>{console.log(e),this.$router.replace({name:"login"})})}).catch(t=>{console.log(t),this.$router.replace({name:"login"})})}};function s(t,e,o,a,d,p){return r(),l("div")}const h=i(c,[["render",s]]);export{h as default};
