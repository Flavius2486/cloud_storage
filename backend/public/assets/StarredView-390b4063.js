import{D as d}from"./dataWrapper-63e81982.js";import{f as p}from"./fetchData-3c36b4e7.js";import{_ as n,r as c,o as _,c as f,h as l,F as i,p as u,f as m,b as t}from"./index-381f52fb.js";const h={components:{DataWrapper:d},data(){return{data:[]}},created(){this.updateData()},methods:{updateData(){p("starred").then(a=>{this.data=a}).catch(a=>{console.error("Error:",a)})}}},D=a=>(u("data-v-f67de0fa"),a=a(),m(),a),v=D(()=>t("div",{class:"starred-view__header"},[t("h1",null,"Starred")],-1));function S(a,e,w,x,r,o){const s=c("DataWrapper");return _(),f(i,null,[v,l(s,{data:r.data,page:"starred",onUpdateData:e[0]||(e[0]=I=>o.updateData())},null,8,["data"])],64)}const W=n(h,[["render",S],["__scopeId","data-v-f67de0fa"]]);export{W as default};
