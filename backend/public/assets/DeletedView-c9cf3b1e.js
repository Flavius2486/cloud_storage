import{D as s}from"./dataWrapper-242be64d.js";import{f as p}from"./fetchData-b654229f.js";import{_ as n,r as c,o as _,c as l,h as i,F as f,p as m,f as u,b as a}from"./index-051f8a8c.js";import"./deleteDownloadedFolder-8e6939cc.js";const D={components:{DataWrapper:s},data(){return{data:[]}},created(){this.updateData()},methods:{updateData(){p("deleted").then(e=>{this.data=e}).catch(e=>{console.error("Error:",e)})}}},h=e=>(m("data-v-db0584f6"),e=e(),u(),e),v=h(()=>a("div",{class:"deleted-view__header"},[a("h1",null,"Deleted")],-1));function b(e,t,w,x,o,d){const r=c("DataWrapper");return _(),l(f,null,[v,i(r,{data:o.data,page:"deleted",onUpdateData:t[0]||(t[0]=I=>d.updateData())},null,8,["data"])],64)}const W=n(D,[["render",b],["__scopeId","data-v-db0584f6"]]);export{W as default};
