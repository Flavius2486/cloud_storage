import{D as l}from"./dataWrapper-599ffc08.js";import{_ as c,a as r,r as n,o as p,c as i,b as a,t as s,h,F as f}from"./index-46b75774.js";import"./deleteDownloadedFolder-e6c3c61c.js";const u={components:{DataWrapper:l},props:["folderIdentifier"],data(){return{prevPage:"",data:[],folder:{}}},methods:{fetchFolderData(){this.$store.commit("setDataStatus",{state:!1}),r.post("https://cloud.fl4v1u5.net:3002/api/folder-data",{folderIdentifier:this.$route.params.folderIdentifier,page:this.prevPage},{withCredentials:!0}).then(e=>{this.$store.commit("setDataStatus",{state:!0}),this.data=e.data.folderContent,this.folder=e.data.folderData}).catch(e=>{console.log(e)})},updateFolderLastAccesse(){r.post("https://cloud.fl4v1u5.net:3002/api/update-last-access",{folderIdentifier:this.$route.params.folderIdentifier},{withCredentials:!0}).then(()=>{}).catch(e=>{console.log(e)})}},mounted(){this.prevPage=this.$route.params.page,this.fetchFolderData(),this.updateFolderLastAccesse()},watch:{$route(){this.fetchFolderData(),this.updateFolderLastAccesse()}}},_={class:"header"};function m(e,D,F,g,t,o){const d=n("DataWrapper");return p(),i(f,null,[a("div",_,[a("p",null,[a("i",null,s(t.folder.frontend_path)+"/"+s(t.folder.name)+"/",1)])]),h(d,{onUpdateData:o.fetchFolderData,onFetchFolderData:o.fetchFolderData,data:t.data,page:"folder",prevPage:t.prevPage},null,8,["onUpdateData","onFetchFolderData","data","prevPage"])],64)}const $=c(u,[["render",m],["__scopeId","data-v-02035002"]]);export{$ as default};
