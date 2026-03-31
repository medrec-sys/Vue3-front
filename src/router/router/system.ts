import type { RouteRecordRaw } from 'vue-router';
import {ROUTE_PATHS} from "@/constant/SystemRouterConfig";

const aboutRoutes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/login',
    },
    {
        path: '/login',
        component: () => import('@/views/login/index.vue'),
    },
    {
        path: '/home',
        component: () => import('@/views/container/index.vue'),
        children: [
            {
                path: ROUTE_PATHS.HOME,
                redirect: ROUTE_PATHS.START,
            },
            {
                path: ROUTE_PATHS.START,
                component: () => import('@/views/Start/index.vue'),
            },
            {
                path: ROUTE_PATHS.AGENT,
                component: () => import('@/views/Agent/index.vue'),
            },
            {
                path: ROUTE_PATHS.VECTOR,
                component: () => import('@/views/Vector/index.vue'),
            },
            {
                path: ROUTE_PATHS.CHAT,
                component: () => import('@/views/Chat/index.vue'),
            },
        ],
    },
    {
        path: '/:pathMatch(.*)*',
        name: '404',
        component: () => import('@/views/404/index.vue')
    },
];

export default aboutRoutes;
