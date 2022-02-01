import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import userService from '../services/user.service'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: () => import(/* webpackChunkName: "about" */ '../views/About.vue') },
  
  { path: '/login', name: 'Login', component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue') },

  { path: '/libraries', name: 'Libraries', component: () => import(/* webpackChunkName: "login" */ '../views/Libraries.vue') },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name == 'Login' || userService.isLoggedIn()) {
    next();
  } else {
    next({
      path: "/login",
      params: { nextUrl: to.fullPath },
    });
  }
});

export default router
