import { defineStore } from 'pinia';
import { ref } from 'vue';
import { loginApi } from '@/api/loginApi';
import { useRouter } from 'vue-router';
import logger from "@/utils/logger";

export const useLoginStore = defineStore('login', () => {
    const isLoggedIn = ref(false);
    const loading = ref(false);

    // 用户登录
    const login = async (account: string, password: string) => {
        logger.log("登录操作")
        loading.value = true;
        try {
            const res = await loginApi.login(account, password);
            isLoggedIn.value = true;

            // 存储token到localStorage
            logger.log("token", res.data.data)
            localStorage.setItem('medrec_token', res.data.data);
            logger.log("token", localStorage.getItem('medrec_token'))

            return res.data;
        } finally {
            loading.value = false;
        }
    };

    // 用户注册
    const register = async (account: string, username: string, password: string) => {
        loading.value = true;
        try {
            const res = await loginApi.register(account, username, password);
            return res.data;
        } finally {
            loading.value = false;
        }
    };

    // 退出登录
    const logout = () => {
        console.log("退出登录")
        isLoggedIn.value = false;
        localStorage.removeItem('medrec_token');

        // 可选：跳转到登录页
        const router = useRouter();
        router.push('/login');
    };

    // 检查登录状态
    const checkLoginStatus = () => {
        const storedToken = localStorage.getItem('medrec_token');
        if (storedToken) {
            isLoggedIn.value = true;
        }
    };

    // 获取token
    const getToken = () => {
        return localStorage.getItem('medrec_token') || '';
    };

    return {
        isLoggedIn,
        loading,
        login,
        register,
        logout,
        checkLoginStatus,
        getToken,
    };
});