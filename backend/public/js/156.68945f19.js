"use strict";(self["webpackChunkclient"]=self["webpackChunkclient"]||[]).push([[156],{8560:function(a,t,e){var r=e(4161),d=e(4239);const n=async a=>{d.Z.commit("setDataStatus",{state:!1});try{const t=await r.Z.post("/api/fetch-data",{dataCategory:a},{withCredentials:!0});return d.Z.commit("setDataStatus",{state:!0}),d.Z.commit("setMemoryStatus",{data:{freeMemory:t.data.freeMemory,usedMemory:t.data.usedMemory}}),t.data.dataArray}catch(t){throw console.error("Error fetching data:",t),t}};t.Z=n},8898:function(a,t,e){e.r(t),e.d(t,{default:function(){return h}});var r=e(3396);const d=a=>((0,r.dD)("data-v-6f2e6de8"),a=a(),(0,r.Cn)(),a),n=d((()=>(0,r._)("div",{class:"starred-view__header"},[(0,r._)("h1",null,"Starred")],-1)));function s(a,t,e,d,s,o){const c=(0,r.up)("DataWrapper");return(0,r.wg)(),(0,r.iD)(r.HY,null,[n,(0,r.Wm)(c,{data:s.data,page:"starred",onUpdateData:t[0]||(t[0]=a=>o.updateData())},null,8,["data"])],64)}var o=e(4747),c=e(8560),u={components:{DataWrapper:o.Z},data(){return{data:[]}},created(){this.updateData()},methods:{updateData(){(0,c.Z)("starred").then((a=>{this.data=a})).catch((a=>{console.error("Error:",a)}))}}},i=e(89);const p=(0,i.Z)(u,[["render",s],["__scopeId","data-v-6f2e6de8"]]);var h=p}}]);
//# sourceMappingURL=156.68945f19.js.map