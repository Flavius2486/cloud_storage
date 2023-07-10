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
    component: () => import("../views/LoginView.vue"),
  },
  {
    path: "/",
    redirect: () => {
      return { path: "/dashboard" };
    },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("../views/DashboardView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const authenticated = await isAuthenticated();
    store.commit('setAuthentication', { auth: authenticated });
    if (authenticated) {
      next();
    } else {
      next("/login");
    }
  } else {
    next();
  }
});

export default router;
