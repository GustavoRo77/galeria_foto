import { createRouter, createWebHistory } from '@ionic/vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { isAuthenticated } from '@/services/auth';

const routes: Array<RouteRecordRaw> = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: () => import('@/views/LoginPage.vue'), meta: { public: true } },
  { path: '/cadastro', component: () => import('@/views/RegisterPage.vue'), meta: { public: true } },
  { path: '/home', component: () => import('@/views/HomePage.vue') },
  { path: '/sobre', component: () => import('@/views/AboutPage.vue') },
  { path: '/termos/:tipo', component: () => import('@/views/TermsPage.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/login' }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to) => {
  if (!to.meta.public && !isAuthenticated()) return '/login';
  if (to.meta.public && isAuthenticated()) return '/home';
  return true;
});

export default router;
