import {createRouter, createWebHistory} from 'vue-router';
import type {RouteRecordRaw} from 'vue-router';
import textRoutes from './router/system';
import { ElMessage } from "element-plus";

const routes: RouteRecordRaw[] = [
    ...textRoutes
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, _from, next) => {
    if (to.path == '/login') {
        next();
    } else {
        const token = localStorage.getItem('medrec_token');
        if (!token) {
            ElMessage.error('请先登录' as any);
            next('/login'); // 如果未登录，则跳转到登录页面
        }
        next(); // 否则继续执行
    }

});

export default router;
