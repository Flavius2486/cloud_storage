import{D as d}from"./dataWrapper-e79034af.js";import{f as p}from"./fetchData-dc2734cf.js";import{_ as n,r as c,o as _,c as l,h as i,F as u,p as m,f,b as t}from"./index-d34f33a9.js";const h={components:{DataWrapper:d},data(){return{data:[]}},created(){this.updateData()},methods:{updateData(){p("starred").then(a=>{this.data=a}).catch(a=>{console.error("Error:",a)})}}},D=a=>(m("data-v-b0a0b4ed"),a=a(),f(),a),v=D(()=>t("div",{class:"starred-view__header"},[t("h1",null,"Starred")],-1));function b(a,e,S,w,r,o){const s=c("DataWrapper");return _(),l(u,null,[v,i(s,{data:r.data,page:"starred",onUpdateData:e[0]||(e[0]=x=>o.updateData())},null,8,["data"])],64)}const B=n(h,[["render",b],["__scopeId","data-v-b0a0b4ed"]]);export{B as default};