import{_ as p,a as m,o as _,c as h,b as s,w as i,v as u,d as c,e as f,p as b,f as y}from"./index-b4dd7d4e.js";const w={data(){return{email_username:"",password:""}},methods:{updateInputColor(n,e){document.querySelector(".form-error").classList.add("transparent"),document.querySelectorAll(".user-box label")[e].style.color="white",document.querySelectorAll(".input-error")[e].classList.add("hidden"),n.target.style.borderColor="#ffffff"},handleLogin(){let n=!1;const e=document.querySelectorAll(".user-box input"),a=document.querySelectorAll(".user-box label"),d=document.querySelectorAll(".input-error");e.forEach((t,r)=>{t.value.length===0&&(t.style.borderColor="rgb(228, 48, 48)",a[r].style.color="rgb(228, 48, 48)",d[r].classList.remove("hidden"),n=!0)}),n||m.post("https://cloud.fl4v1u5.net:3002/api/login",{email_username:this.email_username,password:this.password},{withCredentials:!0}).then(t=>{t.data.auth?window.location.reload():(document.querySelector(".form-error").classList.remove("transparent"),document.querySelector(".form-error i").innerHTML=t.data.message)}).catch(t=>{throw t})}}},l=n=>(b("data-v-cddc265c"),n=n(),y(),n),g={class:"container"},v={class:"login-box"},L=l(()=>s("h2",null,"Login",-1)),x=l(()=>s("div",{class:"form-error transparent"},[s("i",null,"Incorrect email and/or password")],-1)),S={class:"user-box"},q=l(()=>s("label",{class:"username-placeholder"},"Email or username",-1)),I=l(()=>s("i",{class:"input-error hidden"},"Field cannot be empty!",-1)),C={class:"user-box"},V=l(()=>s("label",{class:"password-placeholder"},"Password",-1)),A=l(()=>s("i",{class:"input-error hidden"},"Field cannot be empty!",-1)),F=l(()=>s("span",null,null,-1)),k=l(()=>s("span",null,null,-1)),B=l(()=>s("span",null,null,-1)),E=l(()=>s("span",null,null,-1));function K(n,e,a,d,t,r){return _(),h("div",g,[s("div",v,[L,x,s("form",null,[s("div",S,[i(s("input",{"onUpdate:modelValue":e[0]||(e[0]=o=>t.email_username=o),type:"text",class:"email_username-input",required:"",onKeyup:e[1]||(e[1]=c((...o)=>r.handleLogin&&r.handleLogin(...o),["enter"])),onFocus:e[2]||(e[2]=o=>r.updateInputColor(o,0))},null,544),[[u,t.email_username]]),q,I]),s("div",C,[i(s("input",{"onUpdate:modelValue":e[3]||(e[3]=o=>t.password=o),type:"password",class:"password-input",required:"",onKeyup:e[4]||(e[4]=c((...o)=>r.handleLogin&&r.handleLogin(...o),["enter"])),onFocus:e[5]||(e[5]=o=>r.updateInputColor(o,1))},null,544),[[u,t.password]]),V,A]),s("a",{class:"submit-btn",type:"submit",onClick:e[6]||(e[6]=(...o)=>r.handleLogin&&r.handleLogin(...o))},[F,k,B,E,f(" Submit ")])])])])}const M=p(w,[["render",K],["__scopeId","data-v-cddc265c"]]);export{M as default};