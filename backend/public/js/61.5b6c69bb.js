"use strict";(self["webpackChunkclient"]=self["webpackChunkclient"]||[]).push([[61],{8560:function(t,a,e){var r=e(4161),d=e(4239);const n=async t=>{d.Z.commit("setDataStatus",{state:!1});try{const a=await r.Z.post("/api/fetch-data",{dataCategory:t},{withCredentials:!0});return d.Z.commit("setDataStatus",{state:!0}),d.Z.commit("setMemoryStatus",{data:{freeMemory:a.data.freeMemory,usedMemory:a.data.usedMemory}}),a.data.dataArray}catch(a){throw console.error("Error fetching data:",a),a}};a.Z=n},8189:function(t,a,e){e.r(a),e.d(a,{default:function(){return p}});var r=e(3396);const d=t=>((0,r.dD)("data-v-a8cdcb48"),t=t(),(0,r.Cn)(),t),n=d((()=>(0,r._)("div",{class:"deleted-view__header"},[(0,r._)("h1",null,"Deleted")],-1)));function c(t,a,e,d,c,o){const s=(0,r.up)("DataWrapper");return(0,r.wg)(),(0,r.iD)(r.HY,null,[n,(0,r.Wm)(s,{data:c.data,page:"deleted",onUpdateData:a[0]||(a[0]=t=>o.updateData())},null,8,["data"])],64)}var o=e(8129),s=e(8560),u={components:{DataWrapper:o.Z},data(){return{data:[]}},created(){this.updateData()},methods:{updateData(){(0,s.Z)("deleted").then((t=>{this.data=t})).catch((t=>{console.error("Error:",t)}))}}},i=e(89);const l=(0,i.Z)(u,[["render",c],["__scopeId","data-v-a8cdcb48"]]);var p=l}}]);
//# sourceMappingURL=61.5b6c69bb.js.map