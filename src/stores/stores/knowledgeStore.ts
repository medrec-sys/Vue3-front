import { defineStore } from 'pinia';
import { ref } from 'vue';
import { knowledgeApi } from '@/api/knowledgeApi';
import type { PageDTO } from '@/types/common/PageDTO';
import type {Knowledge} from "@/types/entity/Knowledge";

export const useKnowledgeStore = defineStore('knowledge', () => {
    const knowledges = ref<Knowledge[]>([]);
    const allKnowledges = ref<Knowledge[]>([]);
    const currentKnowledge = ref<Knowledge | null>(null);
    const total = ref(0);
    const pageQuery = ref<PageDTO<Knowledge>>({
        pageNum: 1,
        pageSize: 10,
        order: 'DESC',
        query: {} as Knowledge,
    });
    const loading = ref(false);

    // 创建知识（上传文件）
    const createKnowledge = async (file: File, vectorId: number) => {
        loading.value = true;
        try {
            const res = await knowledgeApi.add(file, vectorId);
            await fetchKnowledgePage(); // 刷新知识列表
            return res.data;
        } finally {
            loading.value = false;
        }
    };

    // 获取单个知识
    const fetchKnowledge = async (id: number) => {
        loading.value = true;
        try {
            const res = await knowledgeApi.getById(id);
            currentKnowledge.value = res.data.data;
            return res.data;
        } finally {
            loading.value = false;
        }
    };

    // 更新知识
    const updateKnowledge = async (knowledge: Knowledge) => {
        loading.value = true;
        try {
            const res = await knowledgeApi.update(knowledge);
            await fetchKnowledgePage(); // 刷新知识列表
            return res.data;
        } finally {
            loading.value = false;
        }
    };

    // 删除知识
    const deleteKnowledge = async (id: number) => {
        loading.value = true;
        try {
            const res = await knowledgeApi.delete(id);
            knowledges.value = knowledges.value.filter(knowledge => knowledge.id !== id);
            allKnowledges.value = allKnowledges.value.filter(knowledge => knowledge.id !== id);
            return res.data;
        } finally {
            loading.value = false;
        }
    };

    // 获取所有知识（用于下拉选择等场景）
    const fetchAllKnowledges = async () => {
        loading.value = true;
        try {
            const res = await knowledgeApi.getPage({
                pageNum: 1,
                pageSize: 9999,
                order: 'ASC',
                query: {} as Knowledge,
            });
            allKnowledges.value = res.data.data.rows;
            return res.data;
        } finally {
            loading.value = false;
        }
    };

    // 分页查询知识
    const fetchKnowledgePage = async () => {
        loading.value = true;
        try {
            const res = await knowledgeApi.getPage(pageQuery.value);
            knowledges.value = res.data.data.rows;
            total.value = res.data.data.total;
            return res.data;
        } finally {
            loading.value = false;
        }
    };

    // 根据ID获取知识名称
    const getKnowledgeNameById = (id: number): string => {
        const knowledge = allKnowledges.value.find(k => k.id === id);
        return knowledge?.name || '';
    };

    return {
        knowledges,
        allKnowledges,
        currentKnowledge,
        loading,
        pageQuery,
        total,
        createKnowledge,
        fetchKnowledge,
        updateKnowledge,
        deleteKnowledge,
        fetchAllKnowledges,
        fetchKnowledgePage,
        getKnowledgeNameById,
    };
});