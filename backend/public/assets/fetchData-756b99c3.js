import{s as a,a as r}from"./index-46b75774.js";const o=async e=>{a.commit("setDataStatus",{state:!1});try{const t=await r.post("https://cloud.fl4v1u5.net:3002/api/fetch-data",{dataCategory:e},{withCredentials:!0});return a.commit("setDataStatus",{state:!0}),a.commit("setMemoryStatus",{data:{totalMemory:t.data.totalMemory,usedMemory:t.data.usedMemory}}),t.data.dataArray}catch(t){throw a.commit("setDataStatus",{state:!0}),console.error("Error fetching data:",t),t}};export{o as f};