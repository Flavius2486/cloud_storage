(function(){"use strict";var e={1720:function(e,t,n){var o=n(9242),r=n(3396);function a(e,t,n,a,i,s){const d=(0,r.up)("router-view"),c=(0,r.up)("sidebar"),l=(0,r.up)("navbar");return(0,r.wg)(),(0,r.iD)(r.HY,null,[e.$store.state.isAuthenticated?(0,r.kq)("",!0):((0,r.wg)(),(0,r.j4)(d,{key:0})),e.$store.state.isAuthenticated?((0,r.wg)(),(0,r.j4)(c,{key:1,onClick:t[0]||(t[0]=(0,o.iM)((()=>{}),["stop"])),class:"sidebar",onCloseSidebar:s.hideSidebar},null,8,["onCloseSidebar"])):(0,r.kq)("",!0),(0,r._)("div",{onClick:t[1]||(t[1]=(...e)=>s.hideSidebar&&s.hideSidebar(...e)),class:"overlay-app hidden"}),e.$store.state.isAuthenticated?((0,r.wg)(),(0,r.iD)("main",{key:2,onClick:t[3]||(t[3]=(0,o.iM)(((...e)=>s.hideDropdowns&&s.hideDropdowns(...e)),["stop"])),class:"centering-container"},[(0,r._)("div",{class:"main-container",onScroll:t[2]||(t[2]=(...e)=>s.hideDropdowns&&s.hideDropdowns(...e))},[(0,r.Wm)(l,{ref:"navbar",onShowSidebar:s.openSidebar},null,8,["onShowSidebar"]),(0,r.Wm)(d)],32)])):(0,r.kq)("",!0)],64)}var i=n(7139);const s=e=>((0,r.dD)("data-v-48494e88"),e=e(),(0,r.Cn)(),e),d={class:"sidebar"},c={class:"sidebar-header"},l={class:"title"},u=s((()=>(0,r._)("b",null,"Personal Cloud",-1))),h=s((()=>(0,r._)("div",{class:"divider"},null,-1))),p={class:"storage-informations"},f=s((()=>(0,r._)("div",{class:"divider"},null,-1))),m={class:"storage-title"},v=s((()=>(0,r._)("p",null,"Storage",-1))),b=s((()=>(0,r._)("div",{class:"progress-bar"},[(0,r._)("span")],-1))),y={class:"storage-informations-text"};function g(e,t,n,o,a,s){const g=(0,r.up)("fa"),w=(0,r.up)("SidebarButton");return(0,r.wg)(),(0,r.iD)("aside",d,[(0,r._)("header",c,[(0,r._)("div",l,[u,(0,r._)("div",{class:"close-sidebar-btn",onClick:t[0]||(t[0]=t=>e.$emit("close-sidebar"))},[(0,r.Wm)(g,{icon:["fas","xmark"]})])]),((0,r.wg)(!0),(0,r.iD)(r.HY,null,(0,r.Ko)(a.sidebarBtns,((t,n)=>((0,r.wg)(),(0,r.iD)("div",{key:n,class:"nav-btns"},[(0,r.Wm)(w,{onClick:t=>{s.setActivePage(n),e.$emit("close-sidebar")},icon:t.icon,iconColor:t.color,buttonText:t.text,active:t.active},null,8,["onClick","icon","iconColor","buttonText","active"])])))),128)),h]),(0,r._)("div",p,[f,(0,r._)("div",m,[(0,r.Wm)(g,{icon:["fas","cloud"],style:{color:"#2ab7e8"}}),v]),b,(0,r._)("div",y,(0,i.zw)(e.$store.state.usedMemory)+"GB out of "+(0,i.zw)(e.$store.state.freeMemory)+"GB used ",1)])])}const w={class:"icon-container"};function _(e,t,n,o,a,s){const d=(0,r.up)("fa");return(0,r.wg)(),(0,r.iD)("div",{class:(0,i.C_)(["sidebar-btn",{active:n.active}]),onMouseover:t[0]||(t[0]=e=>a.iconAnimation=!0),onMouseleave:t[1]||(t[1]=e=>a.iconAnimation=!1)},[(0,r._)("div",w,[(0,r.Wm)(d,{icon:n.icon,style:(0,i.j5)({color:n.iconColor}),beat:a.iconAnimation},null,8,["icon","style","beat"])]),(0,r._)("p",null,(0,i.zw)(n.buttonText),1)],34)}var k={name:"siedbar-btn",props:{icon:{type:Array,required:!0},iconColor:{type:String,required:!0},buttonText:{type:String,required:!0},active:{type:Boolean,required:!0}},data(){return{iconAnimation:!1}}},C=n(89);const S=(0,C.Z)(k,[["render",_],["__scopeId","data-v-46ad9572"]]);var M=S,A={name:"side-bar",emits:["close-sidebar"],components:{SidebarButton:M},data(){return{sidebarBtns:[{icon:["fas","qrcode"],color:"#2ab7e8",text:"Dashboard",active:!1,page:"dashboard"},{icon:["far","clock"],color:"#A4ADD3",text:"Recents",active:!1,page:"recents"},{icon:["far","star"],color:"yellow",text:"Starred",active:!1,page:"starred"},{icon:["far","trash-can"],color:"#d31c1c",text:"Deleted Files",active:!1,page:"deleted"}]}},methods:{setActivePage(e){this.sidebarBtns.forEach((e=>{e.active=!1})),this.sidebarBtns[e].active=!0,console.log("OK"),this.$router.replace({name:this.sidebarBtns[e].page})},progressBar(){const e=Math.floor(this.$store.state.usedMemory)/this.$store.state.freeMemory*100;document.querySelector(".progress-bar span").style.width=e+"%"}},mounted(){this.progressBar()},watch:{$route(e){this.sidebarBtns.forEach((t=>{t.active=!1,e.fullPath.split("/").includes(t.page)&&(t.active=!0)}))},"$store.state.usedMemory"(){this.progressBar()}}};const D=(0,C.Z)(A,[["render",g],["__scopeId","data-v-48494e88"]]);var q=D;const x=e=>((0,r.dD)("data-v-57c5b0d4"),e=e(),(0,r.Cn)(),e),B={class:"navbar"},Z={class:"navbar__left-side--group"},$=x((()=>(0,r._)("p",null,[(0,r.Uk)(" In order to search you must use a specific syntax:"),(0,r._)("br"),(0,r.Uk)(" (1) category: dashboard, recents, starred or deleted "),(0,r._)("br"),(0,r.Uk)(' (2) folder name or "all" everything or "/" root '),(0,r._)("br"),(0,r.Uk)(" (3) search string "),(0,r._)("br"),(0,r.Uk)(" In the end you will have: (1) | (2) | (3) ")],-1))),I=[$],O={class:"search-bar"},T={class:"navbar__right-side--group"},L=x((()=>(0,r._)("div",{class:"dropdown-settings"},null,-1)));function j(e,t,n,a,i,s){const d=(0,r.up)("fa"),c=(0,r.up)("DropdownOption"),l=(0,r.up)("Dropdown"),u=(0,r.up)("MessageBox");return(0,r.wg)(),(0,r.iD)(r.HY,null,[(0,r._)("div",B,[(0,r._)("div",Z,[(0,r._)("div",{class:"side-bar-btn",onClick:t[0]||(t[0]=(0,o.iM)((t=>e.$emit("show-sidebar")),["stop"]))},[(0,r.Wm)(d,{icon:["fas","bars"]})]),(0,r._)("div",{class:"info-modal-btn",onClick:t[1]||(t[1]=(0,o.iM)((e=>s.togleInfoModal()),["stop"]))},[(0,r.Wm)(d,{icon:["far","circle-question"]})]),(0,r.wy)((0,r._)("div",{class:"info-modal",onClick:t[2]||(t[2]=(0,o.iM)((()=>{}),["stop"]))},I,512),[[o.F8,i.showInfoModal]])]),(0,r._)("div",O,[(0,r._)("div",{class:"search-icon",onClick:t[3]||(t[3]=e=>s.search())},[(0,r.Wm)(d,{icon:["fas","magnifying-glass"]})]),(0,r.wy)((0,r._)("input",{"onUpdate:modelValue":t[4]||(t[4]=e=>i.searchQuery=e),type:"search",placeholder:"Search",onKeyup:t[5]||(t[5]=(0,o.D2)((e=>s.search()),["enter"]))},null,544),[[o.nr,i.searchQuery]])]),(0,r._)("div",T,[(0,r._)("div",{class:"settings-btn dropdown-settings",onClick:t[6]||(t[6]=e=>s.showDropdown(e))},[L,(0,r.Wm)(d,{icon:["fas","gear"],class:"dropdown-settings"})]),(0,r.Wm)(l,{customClass:"dropdown-settings",style:{marginTop:"0px",marginLeft:"-120px"}},{default:(0,r.w5)((()=>[(0,r.Wm)(c,{icon:["fas","arrow-right-from-bracket"],onClick:t[7]||(t[7]=e=>s.logout())},{default:(0,r.w5)((()=>[(0,r.Uk)("Logout")])),_:1})])),_:1})])]),(0,r.Wm)(u,{ref:"MessageBox",style:{marginLeft:"15px",bottom:"20px"}},null,512)],64)}var E=n(7173),P=n(8226),W=n(4340),N=n(4161),U={name:"nav-bar",emits:["show-sidebar"],components:{Dropdown:E.Z,DropdownOption:P.Z,MessageBox:W.Z},data(){return{searchQuery:"",showInfoModal:!1}},methods:{togleInfoModal(){this.showInfoModal=!this.showInfoModal},hideInfoModal(){this.showInfoModal=!1},showDropdown(e){const t=document.querySelectorAll(".dropdown");t.forEach((t=>{t.classList.add("hidden"),e.target.classList.contains(t.classList[0])&&setTimeout((()=>{t.classList.remove("hidden")}),100)}))},logout(){N.Z.post("/api/logout",{},{withCredentials:!0}).then((()=>{this.$router.go()})).catch((e=>{console.log(e)}))},showMessageBox(e){this.$refs.MessageBox.showMessage(e)},search(){let e=[];this.searchQuery&&(e=this.searchQuery.split("|")),3===e.length?(e[0]=e[0].trim(),e[1]=e[1].trim(),e[2]=e[2].trim().split(" ").map((e=>e.trim())).join("-"),e=e.join("?"),this.$router.replace({name:"search",params:{query:e}})):this.showMessageBox("There is an error in your search syntax.")}}};const F=(0,C.Z)(U,[["render",j],["__scopeId","data-v-57c5b0d4"]]);var H=F;const Q=()=>{N.Z.post("/api/refresh-token",{},{withCredentials:!0}).then((()=>{})).catch((e=>{console.log(e)}))};var K=Q;const R=()=>{N.Z.post("/api/auto-delete-data",{},{withCredentials:!0}).then((()=>{})).catch((e=>{console.log(e)}))};var z=R,G={name:"App",components:{sidebar:q,navbar:H},data(){return{showSidebar:!1}},methods:{openSidebar(){const e=document.querySelector(".sidebar");e.style.display="flex",document.querySelector(".overlay-app").classList.remove("hidden"),this.hideDropdowns()},hideSidebar(){if(this.$store.state.isAuthenticated){const e=document.querySelector(".sidebar");e.style.display="none"}this.showSidebar&&(this.showSidebar=!1),document.querySelector(".overlay-app").classList.add("hidden")},hideDropdowns(){const e=document.querySelectorAll(".dropdown");e.forEach((e=>{e.classList.add("hidden")}));const t=document.querySelectorAll(".file");t.forEach((e=>{e.style.backgroundColor="#f7f8fb"})),this.$store.state.isAuthenticated&&this.$refs.navbar.hideInfoModal()}},mounted(){K()},created:function(){window.addEventListener("click",(()=>{this.hideDropdowns(),this.hideSidebar()})),z()},unmounted:function(){window.removeEventListener("click",(()=>{this.hideDropdowns(),this.hideSidebar()}))},watch:{"$store.state.isAuthenticated":{immediate:!0,handler(e){!0===e&&window.setInterval((()=>{K()}),18e5)}}}};const Y=(0,C.Z)(G,[["render",a]]);var V=Y,X=n(2483);const J=async()=>{try{const e=await N.Z.post("/api/verify-auth",{},{withCredentials:!0});return e.data.auth}catch(e){throw e}};var ee=J,te=n(4239);const ne=[{path:"/login",name:"login",component:()=>n.e(787).then(n.bind(n,6787))},{path:"/",redirect:()=>({path:"/dashboard"})},{path:"/search",redirect:()=>({path:"/dashboard"})},{path:"/download",redirect:()=>({path:"/dashboard"})},{path:"/dashboard",name:"dashboard",component:()=>Promise.all([n.e(394),n.e(852)]).then(n.bind(n,3398)),meta:{requiresAuth:!0}},{path:"/recents",name:"recents",component:()=>Promise.all([n.e(394),n.e(179)]).then(n.bind(n,7602)),meta:{requiresAuth:!0}},{path:"/starred",name:"starred",component:()=>Promise.all([n.e(394),n.e(899)]).then(n.bind(n,8898)),meta:{requiresAuth:!0}},{path:"/deleted",name:"deleted",component:()=>Promise.all([n.e(394),n.e(599)]).then(n.bind(n,8189)),meta:{requiresAuth:!0}},{path:"/search/:query",name:"search",component:()=>Promise.all([n.e(394),n.e(927)]).then(n.bind(n,4306)),meta:{requiresAuth:!0}},{path:"/:page/:folderIdentifier",name:"folderData",component:()=>Promise.all([n.e(394),n.e(784)]).then(n.bind(n,4344)),meta:{requiresAuth:!0}},{path:"/download/:identifier",name:"download",component:()=>n.e(585).then(n.bind(n,585)),meta:{requiresAuth:!1}}],oe=(0,X.p7)({mode:(0,X.PO)(),history:(0,X.PO)("/"),routes:ne});oe.beforeEach((async(e,t,n)=>{const o=await ee();e.matched.some((e=>e.meta.requiresAuth))?(te.Z.commit("setAuthentication",{auth:o}),o?n():n("/login")):"/login"===e.path&&o?n(t.path):n()}));var re=oe,ae=n(5269),ie=n.n(ae),se=n(3636),de=n(5925),ce=n(3494),le=n(8539),ue=n(8429),he=n(4551),pe=n(7749);ce.vI.add(le.mRB,ue.NCV,he.vnX),(0,o.ri)(V).use(te.Z).use(ie()).use(re).component("qr-code",de.Z).component("fa",pe.GN).component("v-select",se.Z).mount("#app")},4239:function(e,t,n){var o=n(65);t.Z=(0,o.MT)({state:{isAuthenticated:!1,dataReceived:!1,freeMemory:0,usedMemory:0},getters:{},mutations:{setAuthentication(e,t){e.isAuthenticated=t.auth},setMemoryStatus(e,t){e.freeMemory=t.data.freeMemory,e.usedMemory=t.data.usedMemory},setDataStatus(e,t){e.dataReceived=t.state}},actions:{},modules:{}})},7173:function(e,t,n){n.d(t,{Z:function(){return c}});var o=n(3396),r=n(7139);function a(e,t,n,a,i,s){return(0,o.wg)(),(0,o.iD)("div",{class:(0,r.C_)([n.customClass,"dropdown hidden"]),style:(0,r.j5)({marginTop:n.style.marginTop,marginLeft:n.style.marginLeft})},[(0,o.WI)(e.$slots,"default")],6)}var i={name:"dropdown-menu",props:{style:{type:Object,required:!1},customClass:{type:String,required:!0}}},s=n(89);const d=(0,s.Z)(i,[["render",a]]);var c=d},8226:function(e,t,n){n.d(t,{Z:function(){return u}});var o=n(3396),r=n(7139);const a={key:0,type:"file",style:{display:"none"},multiple:"true",webkitdirectory:""},i={key:1,type:"file",style:{display:"none"},multiple:"true",webkitfolder:""};function s(e,t,n,s,d,c){const l=(0,o.up)("fa");return(0,o.wg)(),(0,o.iD)("div",{class:(0,r.C_)([n.customClass,"dropdown-option"])},[(0,o.Wm)(l,{icon:n.icon,class:"icon"},null,8,["icon"]),(0,o._)("p",{class:(0,r.C_)(n.customClass)},[(0,o.WI)(e.$slots,"default")],2),"folder"==n.type?((0,o.wg)(),(0,o.iD)("input",a)):"file"==n.type?((0,o.wg)(),(0,o.iD)("input",i)):(0,o.kq)("",!0)],2)}var d={name:"dropdown-option",props:{type:{type:String,default:"none",required:!1},icon:{type:Array,required:!0},customClass:{type:String}},methods:{}},c=n(89);const l=(0,c.Z)(d,[["render",s]]);var u=l},4340:function(e,t,n){n.d(t,{Z:function(){return c}});var o=n(3396);const r={class:"message-box"};function a(e,t,n,a,i,s){return(0,o.wg)(),(0,o.iD)("div",r)}var i={methods:{showMessage(e){const t=document.querySelector(".message-box");t.innerHTML=e,t.animate([{opacity:0},{opacity:1}],{duration:500,forwards:!0}),t.style.display="block",setTimeout((()=>{t.animate([{opacity:1},{opacity:0}],{duration:500,forwards:!0}).onfinish=()=>{t.style.display="none"}}),4e3)}}},s=n(89);const d=(0,s.Z)(i,[["render",a],["__scopeId","data-v-71734977"]]);var c=d}},t={};function n(o){var r=t[o];if(void 0!==r)return r.exports;var a=t[o]={id:o,loaded:!1,exports:{}};return e[o].call(a.exports,a,a.exports,n),a.loaded=!0,a.exports}n.m=e,function(){var e=[];n.O=function(t,o,r,a){if(!o){var i=1/0;for(l=0;l<e.length;l++){o=e[l][0],r=e[l][1],a=e[l][2];for(var s=!0,d=0;d<o.length;d++)(!1&a||i>=a)&&Object.keys(n.O).every((function(e){return n.O[e](o[d])}))?o.splice(d--,1):(s=!1,a<i&&(i=a));if(s){e.splice(l--,1);var c=r();void 0!==c&&(t=c)}}return t}a=a||0;for(var l=e.length;l>0&&e[l-1][2]>a;l--)e[l]=e[l-1];e[l]=[o,r,a]}}(),function(){n.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return n.d(t,{a:t}),t}}(),function(){n.d=function(e,t){for(var o in t)n.o(t,o)&&!n.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})}}(),function(){n.f={},n.e=function(e){return Promise.all(Object.keys(n.f).reduce((function(t,o){return n.f[o](e,t),t}),[]))}}(),function(){n.u=function(e){return"js/"+e+"."+{179:"1e535071",394:"44679f2b",585:"b235d9ad",599:"310ee6ab",784:"f15383a6",787:"5875b4a4",852:"dcbb97f1",899:"989ddf34",927:"294264d4"}[e]+".js"}}(),function(){n.miniCssF=function(e){return"css/"+e+"."+{179:"aa36a784",599:"c07c0522",784:"a1812925",787:"eff79cf4",852:"001f44d7",899:"f95dd373",927:"91f6b458"}[e]+".css"}}(),function(){n.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){var e={},t="client:";n.l=function(o,r,a,i){if(e[o])e[o].push(r);else{var s,d;if(void 0!==a)for(var c=document.getElementsByTagName("script"),l=0;l<c.length;l++){var u=c[l];if(u.getAttribute("src")==o||u.getAttribute("data-webpack")==t+a){s=u;break}}s||(d=!0,s=document.createElement("script"),s.charset="utf-8",s.timeout=120,n.nc&&s.setAttribute("nonce",n.nc),s.setAttribute("data-webpack",t+a),s.src=o),e[o]=[r];var h=function(t,n){s.onerror=s.onload=null,clearTimeout(p);var r=e[o];if(delete e[o],s.parentNode&&s.parentNode.removeChild(s),r&&r.forEach((function(e){return e(n)})),t)return t(n)},p=setTimeout(h.bind(null,void 0,{type:"timeout",target:s}),12e4);s.onerror=h.bind(null,s.onerror),s.onload=h.bind(null,s.onload),d&&document.head.appendChild(s)}}}(),function(){n.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}}(),function(){n.nmd=function(e){return e.paths=[],e.children||(e.children=[]),e}}(),function(){n.p="/"}(),function(){if("undefined"!==typeof document){var e=function(e,t,n,o,r){var a=document.createElement("link");a.rel="stylesheet",a.type="text/css";var i=function(n){if(a.onerror=a.onload=null,"load"===n.type)o();else{var i=n&&("load"===n.type?"missing":n.type),s=n&&n.target&&n.target.href||t,d=new Error("Loading CSS chunk "+e+" failed.\n("+s+")");d.code="CSS_CHUNK_LOAD_FAILED",d.type=i,d.request=s,a.parentNode&&a.parentNode.removeChild(a),r(d)}};return a.onerror=a.onload=i,a.href=t,n?n.parentNode.insertBefore(a,n.nextSibling):document.head.appendChild(a),a},t=function(e,t){for(var n=document.getElementsByTagName("link"),o=0;o<n.length;o++){var r=n[o],a=r.getAttribute("data-href")||r.getAttribute("href");if("stylesheet"===r.rel&&(a===e||a===t))return r}var i=document.getElementsByTagName("style");for(o=0;o<i.length;o++){r=i[o],a=r.getAttribute("data-href");if(a===e||a===t)return r}},o=function(o){return new Promise((function(r,a){var i=n.miniCssF(o),s=n.p+i;if(t(i,s))return r();e(o,s,null,r,a)}))},r={143:0};n.f.miniCss=function(e,t){var n={179:1,599:1,784:1,787:1,852:1,899:1,927:1};r[e]?t.push(r[e]):0!==r[e]&&n[e]&&t.push(r[e]=o(e).then((function(){r[e]=0}),(function(t){throw delete r[e],t})))}}}(),function(){var e={143:0};n.f.j=function(t,o){var r=n.o(e,t)?e[t]:void 0;if(0!==r)if(r)o.push(r[2]);else{var a=new Promise((function(n,o){r=e[t]=[n,o]}));o.push(r[2]=a);var i=n.p+n.u(t),s=new Error,d=function(o){if(n.o(e,t)&&(r=e[t],0!==r&&(e[t]=void 0),r)){var a=o&&("load"===o.type?"missing":o.type),i=o&&o.target&&o.target.src;s.message="Loading chunk "+t+" failed.\n("+a+": "+i+")",s.name="ChunkLoadError",s.type=a,s.request=i,r[1](s)}};n.l(i,d,"chunk-"+t,t)}},n.O.j=function(t){return 0===e[t]};var t=function(t,o){var r,a,i=o[0],s=o[1],d=o[2],c=0;if(i.some((function(t){return 0!==e[t]}))){for(r in s)n.o(s,r)&&(n.m[r]=s[r]);if(d)var l=d(n)}for(t&&t(o);c<i.length;c++)a=i[c],n.o(e,a)&&e[a]&&e[a][0](),e[a]=0;return n.O(l)},o=self["webpackChunkclient"]=self["webpackChunkclient"]||[];o.forEach(t.bind(null,0)),o.push=t.bind(null,o.push.bind(o))}();var o=n.O(void 0,[998],(function(){return n(1720)}));o=n.O(o)})();
//# sourceMappingURL=app.75913749.js.map