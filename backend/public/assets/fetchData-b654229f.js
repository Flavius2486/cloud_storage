import{s as a,a as r}from"./index-051f8a8c.js";const s=async e=>{a.commit("setDataStatus",{state:!1});try{const t=await r.post("http://localhost:3002/api/fetch-data",{dataCategory:e},{withCredentials:!0});return a.commit("setDataStatus",{state:!0}),a.commit("setMemoryStatus",{data:{totalMemory:t.data.totalMemory,usedMemory:t.data.usedMemory}}),t.data.dataArray}catch(t){throw console.error("Error fetching data:",t),t}};export{s as f};
