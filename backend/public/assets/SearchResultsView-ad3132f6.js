import{D as r}from"./dataWrapper-86a84303.js";import{_ as o,a as c,r as p,o as i,l as h}from"./index-c64f7efd.js";const n={components:{DataWrapper:r},props:["query"],data(){return{data:[]}},methods:{search(){this.$store.commit("setDataStatus",{state:!1});let a=[];this.$route.params.query?(a=this.$route.params.query.split("?"),c.post("http://localhost:3002/api/search",{query:a},{withCredentials:!0}).then(t=>{this.data=t.data.data,this.$store.commit("setDataStatus",{state:!0})}).catch(t=>{throw t})):(this.data=[],this.$store.commit("setDataStatus",{state:!0}))}},mounted(){this.search()},watch:{"$route.params.query":function(){this.search()}}};function u(a,t,m,d,e,l){const s=p("DataWrapper");return i(),h(s,{data:e.data,page:"search"},null,8,["data"])}const $=o(n,[["render",u]]);export{$ as default};