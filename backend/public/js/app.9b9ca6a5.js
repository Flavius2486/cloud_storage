(function(){"use strict";var e={4338:function(e,t,n){var o=n(9242),r=n(3396);const a={key:2,class:"centering-container"};function s(e,t,n,o,s,i){const c=(0,r.up)("router-view"),d=(0,r.up)("sidebar"),l=(0,r.up)("navbar");return(0,r.wg)(),(0,r.iD)(r.HY,null,[e.$store.state.isAuthenticated?(0,r.kq)("",!0):((0,r.wg)(),(0,r.j4)(c,{key:0})),e.$store.state.isAuthenticated?((0,r.wg)(),(0,r.j4)(d,{key:1,class:"sidebar"})):(0,r.kq)("",!0),e.$store.state.isAuthenticated?((0,r.wg)(),(0,r.iD)("main",a,[(0,r._)("div",{class:"main-container",onScroll:t[0]||(t[0]=(...e)=>i.hideDropdowns&&i.hideDropdowns(...e))},[(0,r.Wm)(l,{ref:"navbar",onShowSidebar:i.openSidebar},null,8,["onShowSidebar"]),(0,r.Wm)(c)],32)])):(0,r.kq)("",!0)],64)}var i=n(7139);const c=e=>((0,r.dD)("data-v-92724918"),e=e(),(0,r.Cn)(),e),d={class:"sidebar"},l={class:"sidebar-header"},u={class:"title"},h=c((()=>(0,r._)("b",null,"Personal Cloud",-1))),p=c((()=>(0,r._)("div",{class:"divider"},null,-1))),f={class:"storage-informations"},m=c((()=>(0,r._)("div",{class:"divider"},null,-1))),v={class:"storage-title"},b=c((()=>(0,r._)("p",null,"Storage",-1))),y=c((()=>(0,r._)("div",{class:"progress-bar"},[(0,r._)("span")],-1))),g={class:"storage-informations-text"};function w(e,t,n,o,a,s){const c=(0,r.up)("fa"),w=(0,r.up)("SidebarButton");return(0,r.wg)(),(0,r.iD)("aside",d,[(0,r._)("header",l,[(0,r._)("div",u,[h,(0,r._)("div",{class:"close-sidebar-btn",onClick:t[0]||(t[0]=e=>s.closeSidebar())},[(0,r.Wm)(c,{icon:["fas","xmark"]})])]),((0,r.wg)(!0),(0,r.iD)(r.HY,null,(0,r.Ko)(a.sidebarBtns,((e,t)=>((0,r.wg)(),(0,r.iD)("div",{key:t,class:"nav-btns"},[(0,r.Wm)(w,{onClick:e=>s.setActivePage(t),icon:e.icon,iconColor:e.color,buttonText:e.text,active:e.active},null,8,["onClick","icon","iconColor","buttonText","active"])])))),128)),p]),(0,r._)("div",f,[m,(0,r._)("div",v,[(0,r.Wm)(c,{icon:["fas","cloud"],style:{color:"#2ab7e8"}}),b]),y,(0,r._)("div",g,(0,i.zw)(e.$store.state.usedMemory)+"GB out of "+(0,i.zw)(e.$store.state.freeMemory)+"GB used ",1)])])}const _={class:"icon-container"};function k(e,t,n,o,a,s){const c=(0,r.up)("fa");return(0,r.wg)(),(0,r.iD)("div",{class:(0,i.C_)(["sidebar-btn",{active:n.active}]),onMouseover:t[0]||(t[0]=e=>a.iconAnimation=!0),onMouseleave:t[1]||(t[1]=e=>a.iconAnimation=!1)},[(0,r._)("div",_,[(0,r.Wm)(c,{icon:n.icon,style:(0,i.j5)({color:n.iconColor}),beat:a.iconAnimation},null,8,["icon","style","beat"])]),(0,r._)("p",null,(0,i.zw)(n.buttonText),1)],34)}var C={name:"siedbar-btn",props:{icon:{type:Array,required:!0},iconColor:{type:String,required:!0},buttonText:{type:String,required:!0},active:{type:Boolean,required:!0}},data(){return{iconAnimation:!1}}},S=n(89);const A=(0,S.Z)(C,[["render",k],["__scopeId","data-v-46ad9572"]]);var M=A,D={name:"side-bar",components:{SidebarButton:M},data(){return{sidebarBtns:[{icon:["fas","qrcode"],color:"#2ab7e8",text:"Dashboard",active:!1,page:"dashboard"},{icon:["far","clock"],color:"#A4ADD3",text:"Recents",active:!1,page:"recents"},{icon:["far","star"],color:"yellow",text:"Starred",active:!1,page:"starred"},{icon:["far","trash-can"],color:"#d31c1c",text:"Deleted Files",active:!1,page:"deleted"}]}},methods:{closeSidebar(){const e=document.querySelector(".sidebar");e.style.display="none"},setActivePage(e){this.sidebarBtns.forEach((e=>{e.active=!1})),this.sidebarBtns[e].active=!0,this.$router.replace({name:this.sidebarBtns[e].page})},progressBar(){const e=Math.floor(this.$store.state.usedMemory)/this.$store.state.freeMemory*100;document.querySelector(".progress-bar span").style.width=e+"%"}},mounted(){this.progressBar()},watch:{$route(e){this.sidebarBtns.forEach((t=>{t.active=!1,t.page===e.name&&(t.active=!0)}))},"$store.state.usedMemory"(){this.progressBar()}}};const q=(0,S.Z)(D,[["render",w],["__scopeId","data-v-92724918"]]);var x=q;const B=e=>((0,r.dD)("data-v-5de4e1b5"),e=e(),(0,r.Cn)(),e),I={class:"navbar"},T={class:"navbar__left-side--group"},Z=B((()=>(0,r._)("p",null,[(0,r.Uk)(" In oreder to search you must use a specific syntax:"),(0,r._)("br"),(0,r.Uk)(" (1) category: dashboard, recents, starred or deleted "),(0,r._)("br"),(0,r.Uk)(' (2) folder name or "all" everything or "/" root '),(0,r._)("br"),(0,r.Uk)(" (3) search string "),(0,r._)("br"),(0,r.Uk)(" In the end you will have: (1) | (2) | (3) ")],-1))),O=[Z],$={class:"search-bar"},j={class:"navbar__right-side--group"};function E(e,t,n,a,s,i){const c=(0,r.up)("fa"),d=(0,r.up)("DropdownOption"),l=(0,r.up)("Dropdown"),u=(0,r.up)("MessageBox");return(0,r.wg)(),(0,r.iD)(r.HY,null,[(0,r._)("div",I,[(0,r._)("div",T,[(0,r._)("div",{class:"side-bar-btn",onClick:t[0]||(t[0]=(0,o.iM)((t=>e.$emit("show-sidebar")),["stop"]))},[(0,r.Wm)(c,{icon:["fas","bars"]})]),(0,r._)("div",{class:"info-modal-btn",onClick:t[1]||(t[1]=(0,o.iM)((e=>i.togleInfoModal()),["stop"]))},[(0,r.Wm)(c,{icon:["far","circle-question"]})]),(0,r.wy)((0,r._)("div",{class:"info-modal",onClick:t[2]||(t[2]=(0,o.iM)((()=>{}),["stop"]))},O,512),[[o.F8,s.showInfoModal]])]),(0,r._)("div",$,[(0,r._)("div",{class:"search-icon",onClick:t[3]||(t[3]=e=>i.search())},[(0,r.Wm)(c,{icon:["fas","magnifying-glass"]})]),(0,r.wy)((0,r._)("input",{"onUpdate:modelValue":t[4]||(t[4]=e=>s.searchQuery=e),type:"search",placeholder:"Search",onKeyup:t[5]||(t[5]=(0,o.D2)((e=>i.search()),["enter"]))},null,544),[[o.nr,s.searchQuery]])]),(0,r._)("div",j,[(0,r._)("div",{class:"settings-btn dropdown-settings",onClick:t[6]||(t[6]=e=>i.showDropdown(e))},[(0,r.Wm)(c,{icon:["fas","gear"],class:"dropdown-settings"})]),(0,r.Wm)(l,{customClass:"dropdown-settings",style:{marginTop:"0px",marginLeft:"-120px"}},{default:(0,r.w5)((()=>[(0,r.Wm)(d,{icon:["fas","arrow-right-from-bracket"],onClick:t[7]||(t[7]=e=>i.logout())},{default:(0,r.w5)((()=>[(0,r.Uk)("Logout")])),_:1})])),_:1})])]),(0,r.Wm)(u,{ref:"MessageBox",style:{marginLeft:"15px",bottom:"20px"}},null,512)],64)}var L=n(7173),P=n(8226),W=n(4340),N=n(4161),U={name:"nav-bar",emits:["show-sidebar"],components:{Dropdown:L.Z,DropdownOption:P.Z,MessageBox:W.Z},data(){return{searchQuery:"",showInfoModal:!1}},methods:{togleInfoModal(){this.showInfoModal=!this.showInfoModal},hideInfoModal(){this.showInfoModal=!1},showDropdown(e){const t=document.querySelectorAll(".dropdown");t.forEach((t=>{t.classList.add("hidden"),e.target.classList.contains(t.classList[0])&&setTimeout((()=>{t.classList.remove("hidden")}),100)}))},logout(){N.Z.post("/api/logout",{},{withCredentials:!0}).then((()=>{this.$router.go()})).catch((e=>{console.log(e)}))},showMessageBox(e){this.$refs.MessageBox.showMessage(e)},search(){let e=[];this.searchQuery&&(e=this.searchQuery.split("|")),3===e.length?(e[0]=e[0].trim(),e[1]=e[1].trim(),e[2]=e[2].trim().split(" ").map((e=>e.trim())).join("-"),e=e.join("?"),this.$router.replace({name:"search",params:{query:e}})):this.showMessageBox("There is an error in your search syntax.")}}};const F=(0,S.Z)(U,[["render",E],["__scopeId","data-v-5de4e1b5"]]);var H=F;const Q=()=>{N.Z.post("/api/refresh-token",{},{withCredentials:!0}).then((()=>{})).catch((e=>{console.log(e)}))};var R=Q;const z=()=>{N.Z.post("/api/auto-delete-data",{},{withCredentials:!0}).then((()=>{})).catch((e=>{console.log(e)}))};var G=z,K={name:"App",components:{sidebar:x,navbar:H},data(){return{showSidebar:!1}},methods:{openSidebar(){const e=document.querySelector(".sidebar");e.style.display="flex",this.hideDropdowns()},hideSidebar(){if(this.$store.state.isAuthenticated){const e=document.querySelector(".sidebar");e.style.display="none"}this.showSidebar&&(this.showSidebar=!1)},hideDropdowns(){const e=document.querySelectorAll(".dropdown");e.forEach((e=>{e.classList.add("hidden")}));const t=document.querySelectorAll(".file");t.forEach((e=>{e.style.backgroundColor="#f7f8fb"})),this.$store.state.isAuthenticated&&this.$refs.navbar.hideInfoModal()}},mounted(){R()},created:function(){window.addEventListener("click",(()=>{this.hideDropdowns(),this.hideSidebar()})),G()},unmounted:function(){window.removeEventListener("click",(()=>{this.hideDropdowns(),this.hideSidebar()}))},watch:{"$store.state.isAuthenticated":{immediate:!0,handler(e){!0===e&&window.setInterval((()=>{R()}),18e5)}}}};const Y=(0,S.Z)(K,[["render",s]]);var V=Y,X=n(2483);const J=async()=>{try{const e=await N.Z.post("/api/verify-auth",{},{withCredentials:!0});return e.data.auth}catch(e){throw e}};var ee=J,te=n(4239);const ne=[{path:"/login",name:"login",component:()=>n.e(224).then(n.bind(n,3224))},{path:"/",redirect:()=>({path:"/dashboard"})},{path:"/dashboard",name:"dashboard",component:()=>Promise.all([n.e(497),n.e(459)]).then(n.bind(n,9654)),meta:{requiresAuth:!0}},{path:"/recents",name:"recents",component:()=>Promise.all([n.e(497),n.e(603)]).then(n.bind(n,7602)),meta:{requiresAuth:!0}},{path:"/starred",name:"starred",component:()=>Promise.all([n.e(497),n.e(328)]).then(n.bind(n,8898)),meta:{requiresAuth:!0}},{path:"/deleted",name:"deleted",component:()=>Promise.all([n.e(497),n.e(782)]).then(n.bind(n,8189)),meta:{requiresAuth:!0}},{path:"/search/:query",name:"search",component:()=>Promise.all([n.e(497),n.e(405)]).then(n.bind(n,4306)),meta:{requiresAuth:!0}},{path:"/:page/:folderIdentifier",name:"folderData",component:()=>Promise.all([n.e(497),n.e(639)]).then(n.bind(n,4854)),meta:{requiresAuth:!0}}],oe=(0,X.p7)({mode:(0,X.PO)(),history:(0,X.PO)("/"),routes:ne});oe.beforeEach((async(e,t,n)=>{const o=await ee();e.matched.some((e=>e.meta.requiresAuth))?(te.Z.commit("setAuthentication",{auth:o}),o?n():n("/login")):"/login"===e.path&&o?n(t.path):n()}));var re=oe,ae=n(5269),se=n.n(ae),ie=n(3636),ce=n(3494),de=n(8539),le=n(8429),ue=n(4551),he=n(7749);ce.vI.add(de.mRB,le.NCV,ue.vnX),(0,o.ri)(V).use(te.Z).use(se()).use(re).component("fa",he.GN).component("v-select",ie.Z).mount("#app")},4239:function(e,t,n){var o=n(65);t.Z=(0,o.MT)({state:{isAuthenticated:!1,dataReceived:!1,freeMemory:0,usedMemory:0},getters:{},mutations:{setAuthentication(e,t){e.isAuthenticated=t.auth},setMemoryStatus(e,t){e.freeMemory=t.data.freeMemory,e.usedMemory=t.data.usedMemory},setDataStatus(e,t){e.dataReceived=t.state}},actions:{},modules:{}})},7173:function(e,t,n){n.d(t,{Z:function(){return d}});var o=n(3396),r=n(7139);function a(e,t,n,a,s,i){return(0,o.wg)(),(0,o.iD)("div",{class:(0,r.C_)([n.customClass,"dropdown hidden"]),style:(0,r.j5)({marginTop:n.style.marginTop,marginLeft:n.style.marginLeft})},[(0,o.WI)(e.$slots,"default")],6)}var s={name:"dropdown-menu",props:{style:{type:Object,required:!1},customClass:{type:String,required:!0}}},i=n(89);const c=(0,i.Z)(s,[["render",a]]);var d=c},8226:function(e,t,n){n.d(t,{Z:function(){return u}});var o=n(3396),r=n(7139);const a={key:0,type:"file",style:{display:"none"},multiple:"true",webkitdirectory:""},s={key:1,type:"file",style:{display:"none"},multiple:"true",webkitfolder:""};function i(e,t,n,i,c,d){const l=(0,o.up)("fa");return(0,o.wg)(),(0,o.iD)("div",{class:(0,r.C_)([n.customClass,"dropdown-option"])},[(0,o.Wm)(l,{icon:n.icon,class:"icon"},null,8,["icon"]),(0,o._)("p",{class:(0,r.C_)(n.customClass)},[(0,o.WI)(e.$slots,"default")],2),"folder"==n.type?((0,o.wg)(),(0,o.iD)("input",a)):"file"==n.type?((0,o.wg)(),(0,o.iD)("input",s)):(0,o.kq)("",!0)],2)}var c={name:"dropdown-option",props:{type:{type:String,default:"none",required:!1},icon:{type:Array,required:!0},customClass:{type:String}},methods:{}},d=n(89);const l=(0,d.Z)(c,[["render",i]]);var u=l},4340:function(e,t,n){n.d(t,{Z:function(){return d}});var o=n(3396);const r={class:"message-box"};function a(e,t,n,a,s,i){return(0,o.wg)(),(0,o.iD)("div",r)}var s={methods:{showMessage(e){const t=document.querySelector(".message-box");t.innerHTML=e,t.animate([{opacity:0},{opacity:1}],{duration:500,forwards:!0}),t.style.display="block",setTimeout((()=>{t.animate([{opacity:1},{opacity:0}],{duration:500,forwards:!0}).onfinish=()=>{t.style.display="none"}}),4e3)}}},i=n(89);const c=(0,i.Z)(s,[["render",a],["__scopeId","data-v-71734977"]]);var d=c}},t={};function n(o){var r=t[o];if(void 0!==r)return r.exports;var a=t[o]={exports:{}};return e[o].call(a.exports,a,a.exports,n),a.exports}n.m=e,function(){var e=[];n.O=function(t,o,r,a){if(!o){var s=1/0;for(l=0;l<e.length;l++){o=e[l][0],r=e[l][1],a=e[l][2];for(var i=!0,c=0;c<o.length;c++)(!1&a||s>=a)&&Object.keys(n.O).every((function(e){return n.O[e](o[c])}))?o.splice(c--,1):(i=!1,a<s&&(s=a));if(i){e.splice(l--,1);var d=r();void 0!==d&&(t=d)}}return t}a=a||0;for(var l=e.length;l>0&&e[l-1][2]>a;l--)e[l]=e[l-1];e[l]=[o,r,a]}}(),function(){n.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return n.d(t,{a:t}),t}}(),function(){n.d=function(e,t){for(var o in t)n.o(t,o)&&!n.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})}}(),function(){n.f={},n.e=function(e){return Promise.all(Object.keys(n.f).reduce((function(t,o){return n.f[o](e,t),t}),[]))}}(),function(){n.u=function(e){return"js/"+e+"."+{224:"09409bfa",328:"e4a1a82b",405:"552f8b22",459:"a6ccee7d",497:"3d501ad0",603:"299fe56b",639:"6c609e00",782:"6015c2a3"}[e]+".js"}}(),function(){n.miniCssF=function(e){return"css/"+e+"."+{224:"e8b6cb09",328:"69cc5af6",405:"217ee68a",459:"2cf05e32",603:"58ad239a",639:"664d662c",782:"b34bc5c0"}[e]+".css"}}(),function(){n.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){var e={},t="client:";n.l=function(o,r,a,s){if(e[o])e[o].push(r);else{var i,c;if(void 0!==a)for(var d=document.getElementsByTagName("script"),l=0;l<d.length;l++){var u=d[l];if(u.getAttribute("src")==o||u.getAttribute("data-webpack")==t+a){i=u;break}}i||(c=!0,i=document.createElement("script"),i.charset="utf-8",i.timeout=120,n.nc&&i.setAttribute("nonce",n.nc),i.setAttribute("data-webpack",t+a),i.src=o),e[o]=[r];var h=function(t,n){i.onerror=i.onload=null,clearTimeout(p);var r=e[o];if(delete e[o],i.parentNode&&i.parentNode.removeChild(i),r&&r.forEach((function(e){return e(n)})),t)return t(n)},p=setTimeout(h.bind(null,void 0,{type:"timeout",target:i}),12e4);i.onerror=h.bind(null,i.onerror),i.onload=h.bind(null,i.onload),c&&document.head.appendChild(i)}}}(),function(){n.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}}(),function(){n.p="/"}(),function(){if("undefined"!==typeof document){var e=function(e,t,n,o,r){var a=document.createElement("link");a.rel="stylesheet",a.type="text/css";var s=function(n){if(a.onerror=a.onload=null,"load"===n.type)o();else{var s=n&&("load"===n.type?"missing":n.type),i=n&&n.target&&n.target.href||t,c=new Error("Loading CSS chunk "+e+" failed.\n("+i+")");c.code="CSS_CHUNK_LOAD_FAILED",c.type=s,c.request=i,a.parentNode&&a.parentNode.removeChild(a),r(c)}};return a.onerror=a.onload=s,a.href=t,n?n.parentNode.insertBefore(a,n.nextSibling):document.head.appendChild(a),a},t=function(e,t){for(var n=document.getElementsByTagName("link"),o=0;o<n.length;o++){var r=n[o],a=r.getAttribute("data-href")||r.getAttribute("href");if("stylesheet"===r.rel&&(a===e||a===t))return r}var s=document.getElementsByTagName("style");for(o=0;o<s.length;o++){r=s[o],a=r.getAttribute("data-href");if(a===e||a===t)return r}},o=function(o){return new Promise((function(r,a){var s=n.miniCssF(o),i=n.p+s;if(t(s,i))return r();e(o,i,null,r,a)}))},r={143:0};n.f.miniCss=function(e,t){var n={224:1,328:1,405:1,459:1,603:1,639:1,782:1};r[e]?t.push(r[e]):0!==r[e]&&n[e]&&t.push(r[e]=o(e).then((function(){r[e]=0}),(function(t){throw delete r[e],t})))}}}(),function(){var e={143:0};n.f.j=function(t,o){var r=n.o(e,t)?e[t]:void 0;if(0!==r)if(r)o.push(r[2]);else{var a=new Promise((function(n,o){r=e[t]=[n,o]}));o.push(r[2]=a);var s=n.p+n.u(t),i=new Error,c=function(o){if(n.o(e,t)&&(r=e[t],0!==r&&(e[t]=void 0),r)){var a=o&&("load"===o.type?"missing":o.type),s=o&&o.target&&o.target.src;i.message="Loading chunk "+t+" failed.\n("+a+": "+s+")",i.name="ChunkLoadError",i.type=a,i.request=s,r[1](i)}};n.l(s,c,"chunk-"+t,t)}},n.O.j=function(t){return 0===e[t]};var t=function(t,o){var r,a,s=o[0],i=o[1],c=o[2],d=0;if(s.some((function(t){return 0!==e[t]}))){for(r in i)n.o(i,r)&&(n.m[r]=i[r]);if(c)var l=c(n)}for(t&&t(o);d<s.length;d++)a=s[d],n.o(e,a)&&e[a]&&e[a][0](),e[a]=0;return n.O(l)},o=self["webpackChunkclient"]=self["webpackChunkclient"]||[];o.forEach(t.bind(null,0)),o.push=t.bind(null,o.push.bind(o))}();var o=n.O(void 0,[998],(function(){return n(4338)}));o=n.O(o)})();
//# sourceMappingURL=app.9b9ca6a5.js.map