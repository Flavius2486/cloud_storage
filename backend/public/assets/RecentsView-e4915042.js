import{D as c}from"./dataWrapper-e8f42d39.js";import{f as n}from"./fetchData-7a32fd80.js";import{_ as p,r as d,o as _,c as i,h as l,F as m,p as u,f,b as t}from"./index-b4dd7d4e.js";import"./deleteDownloadedFolder-b14da8c5.js";const h={components:{DataWrapper:c},data(){return{data:[]}},created(){this.updateData()},methods:{updateData(){n("recents").then(e=>{this.data=e}).catch(e=>{console.error("Error:",e)})}}},D=e=>(u("data-v-0ac199e4"),e=e(),f(),e),v=D(()=>t("div",{class:"recents-view__header"},[t("h1",null,"Recents")],-1));function w(e,a,x,I,o,s){const r=d("DataWrapper");return _(),i(m,null,[v,l(r,{data:o.data,page:"recents",onUpdateData:a[0]||(a[0]=V=>s.updateData())},null,8,["data"])],64)}const W=p(h,[["render",w],["__scopeId","data-v-0ac199e4"]]);export{W as default};