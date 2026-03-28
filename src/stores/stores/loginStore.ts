import { defineStore } from 'pinia';
import { ref } from 'vue';
import { loginApi } from '@/api/loginApi';
import { useRouter } from 'vue-router';

export const useLoginStore = defineStore('login', () => {
    const token = ref<string>('');
    const isLoggedIn = ref(false);
    const loading = ref(false);

    // 用户登录
    const login = async (account: string, password: string) => {
        loading.value = true;
        try {
            const res = await loginApi.login(account, password);
            token.value = res.data.data;
            isLoggedIn.value = true;

            // 存储token到localStorage
            localStorage.setItem('token', token.value);

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
        token.value = '';
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
            token.value = storedToken;
            isLoggedIn.value = true;
        }
    };

    // 获取token
    const getToken = () => {
        return token.value || localStorage.getItem('medrec_token') || '';
    };

    return {
        token,
        isLoggedIn,
        loading,
        login,
        register,
        logout,
        checkLoginStatus,
        getToken,
    };
});