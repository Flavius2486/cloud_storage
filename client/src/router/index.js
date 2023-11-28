/* eslint-disable */ import {
  createRouter,
  createWebHistory,
} from "vue-router";
import isAuthenticated from "@/utils/verifyAuth";
import store from "@/store";

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginView.vue"),
  },
  {
    path: "/",
    redirect: () => {
      return { path: "/dashboard" };
    },
  },
  {
    path: "/search",
    redirect: () => {
      return { path: "/dashboard" };
    },
  },
  {
    path: "/download",
    redirect: () => {
      return { path: "/dashboard" };
    },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("@/views/DashboardView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/recents",
    name: "recents",
    component: () => import("@/views/RecentsView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/starred",
    name: "starred",
    component: () => import("@/views/StarredView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/deleted",
    name: "deleted",
    component: () => import("@/views/DeletedView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/search/:query",
    name: "search",
    component: () => import("@/views/SearchResultsView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/:page/:folderIdentifier",
    name: "folderData",
    component: () => import("@/views/FolderDataView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/download/:identifier",
    name: "download",
    component: () => import("@/views/DownloadView.vue"),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/*",
    redirect: () => {
      return { path: "/dashboard" };
    },
  },
];

const router = createRouter({
  mode: createWebHistory(),
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authenticated = await isAuthenticated();
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    store.commit("setAuthentication", { auth: authenticated });
    if (authenticated) {
      next();
    } else {
      next("/login");
    }
  } else if (to.path === "/login" && authenticated) {
    next(from.path);
  } else {
    next();
  }
});

export default router;
