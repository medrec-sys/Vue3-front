import { defineStore } from 'pinia';
import { ref } from 'vue';
import { userApi } from '@/api/userApi';
import type { PageDTO } from '@/types/common/PageDTO';
import type {User} from "@/types/entity/User";

export const useUserStore = defineStore('user', () => {
    const users = ref<User[]>([]);
    const currentUser = ref<User | null>(null);
    const total = ref(0);
    const pageQuery = ref<PageDTO<User>>({
        pageNum: 1,
        pageSize: 10,
        order: 'DESC',
        query: {} as User,
    });
    const loading = ref(false);

    // 创建用户
    const createUser = async (user: User) => {
        loading.value = true;
        try {
            const res = await userApi.add(user);
            await fetchUserPage(); // 刷新用户列表
            return res.data;
        } finally {
            loading.value = false;
        }
    };

    // 获取单个用户
    const fetchUser = async (id: number) => {
        loading.value = true;
        try {
            const res = await userApi.getById(id);
            currentUser.value = res.data.data;
            return res.data;
        } finally {
            loading.value = false;
        }
    };

    // 更新用户
    const updateUser = async (user: User) => {
        loading.value = true;
        try {
            const res = await userApi.update(user);
            await fetchUserPage(); // 刷新用户列表
            return res.data;
        } finally {
            loading.value = false;
        }
    };

    // 删除用户
    const deleteUser = async (id: number) => {
        loading.value = true;
        try {
            const res = await userApi.delete(id);
            users.value = users.value.filter(user => user.id !== id);
            return res.data;
        } finally {
            loading.value = false;
        }
    };

    // 分页查询用户
    const fetchUserPage = async () => {
        loading.value = true;
        try {
            const res = await userApi.getPage(pageQuery.value);
            users.value = res.data.data.rows;
            total.value = res.data.data.total;
            return res.data;
        } finally {
            loading.value = false;
        }
    };

    // 根据ID获取用户名
    const getUserNameById = (id: number): string => {
        const user = users.value.find(u => u.id === id);
        return user?.username || '';
    };

    return {
        users,
        currentUser,
        loading,
        pageQuery,
        total,
        createUser,
        fetchUser,
        updateUser,
        deleteUser,
        fetchUserPage,
        getUserNameById,
    };
});