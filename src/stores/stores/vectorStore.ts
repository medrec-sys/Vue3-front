import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Vector } from '@/api/vectorApi';
import { vectorApi } from '@/api/vectorApi';
import type { PageDTO } from '@/types/common/PageDTO';

export const useVectorStore = defineStore('vector', () => {
    const vectors = ref<Vector[]>([]);
    const allVectors = ref<Vector[]>([]);
    const currentVector = ref<Vector | null>(null);
    const total = ref(0);
    const pageQuery = ref<PageDTO<Vector>>({
        pageNum: 1,
        pageSize: 10,
        order: 'ASC',
        query: {} as Vector,
    });
    const loading = ref(false);

    // 创建向量
    const createVector = async (vector: Vector) => {
        loading.value = true;
        try {
            const res = await vectorApi.add(vector);
            await fetchAllVectors(); // 刷新向量列表
            return res.data;
        } finally {
            loading.value = false;
        }
    };

    // 获取单个向量
    const fetchVector = async (id: number) => {
        loading.value = true;
        try {
            const res = await vectorApi.getById(id);
            currentVector.value = res.data.data;
            return res.data;
        } finally {
            loading.value = false;
        }
    };

    // 更新向量
    const updateVector = async (vector: Vector) => {
        loading.value = true;
        try {
            const res = await vectorApi.update(vector);
            await fetchAllVectors(); // 刷新向量列表
            return res.data;
        } finally {
            loading.value = false;
        }
    };

    // 删除向量
    const deleteVector = async (id: number) => {
        loading.value = true;
        try {
            const res = await vectorApi.delete(id);
            vectors.value = vectors.value.filter(vector => vector.id !== id);
            allVectors.value = allVectors.value.filter(vector => vector.id !== id);
            return res.data;
        } finally {
            loading.value = false;
        }
    };

    // 获取所有向量（用于下拉选择等场景）
    const fetchAllVectors = async () => {
        loading.value = true;
        try {
            // 获取所有向量，这里可以调用一个专门的接口或者使用分页接口获取所有数据
            const res = await vectorApi.getPage({
                pageNum: 1,
                pageSize: 9999,
                order: 'ASC',
                query:  {} as  Vector,
            });
            allVectors.value = res.data.data.rows;
            return res.data;
        } finally {
            loading.value = false;
        }
    };

    // 分页查询向量
    const fetchVectorPage = async () => {
        loading.value = true;
        try {
            const res = await vectorApi.getPage(pageQuery.value);
            vectors.value = res.data.data.rows;
            total.value = res.data.data.total;
            return res.data;
        } finally {
            loading.value = false;
        }
    };

    // 根据ID获取向量名称
    const getVectorNameById = (id: number): string => {
        const vector = allVectors.value.find(v => v.id === id);
        return vector?.name || '';
    };

    return {
        vectors,
        allVectors,
        currentVector,
        loading,
        pageQuery,
        total,
        createVector,
        fetchVector,
        updateVector,
        deleteVector,
        fetchAllVectors,
        fetchVectorPage,
        getVectorNameById,
    };
});