import {defineStore} from 'pinia';
import {ref} from 'vue';
import {agentApi} from '@/api/agentApi';
import type {PageDTO} from '@/types/common/PageDTO';
import type {Agent} from "@/types/entity/Agent";

export const useAgentStore = defineStore('agent', () => {
    const agents = ref<Agent[]>([]);
    const allAgents = ref<Agent[]>([]);
    const currentAgent = ref<Agent | null>(null);
    const total = ref(0);
    const pageQuery = ref<PageDTO<Agent>>({
        pageNum: 1,
        pageSize: 10,
        order: 'DESC',
        query: {} as Agent,
    });
    const loading = ref(false);

    const usingAgent = ref<Agent>({} as any);

    // 创建Agent
    const createAgent = async (agent: Agent) => {
        loading.value = true;
        try {
            const res = await agentApi.add(agent);
            await fetchAllAgents(); // 刷新Agent列表
            return res.data;
        } finally {
            loading.value = false;
        }
    };

    // 获取单个Agent
    const fetchAgent = async (id: number) => {
        loading.value = true;
        try {
            const res = await agentApi.getById(id);
            currentAgent.value = res.data.data;
            return res.data;
        } finally {
            loading.value = false;
        }
    };

    // 更新Agent
    const updateAgent = async (agent: Agent) => {
        loading.value = true;
        try {
            const res = await agentApi.update(agent);
            await fetchAllAgents(); // 刷新Agent列表
            return res.data;
        } finally {
            loading.value = false;
        }
    };

    // 删除Agent
    const deleteAgent = async (id: number) => {
        loading.value = true;
        try {
            const res = await agentApi.delete(id);
            agents.value = agents.value.filter(agent => agent.id !== id);
            allAgents.value = allAgents.value.filter(agent => agent.id !== id);
            return res.data;
        } finally {
            loading.value = false;
        }
    };

    // 获取所有Agent（用于下拉选择等场景）
    const fetchAllAgents = async () => {
        loading.value = true;
        try {
            const res = await agentApi.getPage({
                pageNum: 1,
                pageSize: 9999,
                order: 'ASC',
                query: {} as Agent,
            });
            allAgents.value = res.data.data.rows;
            return res.data;
        } finally {
            loading.value = false;
        }
    };

    // 分页查询Agent
    const fetchAgentPage = async () => {
        loading.value = true;
        try {
            const res = await agentApi.getPage(pageQuery.value);
            agents.value = res.data.data.rows;
            total.value = res.data.data.total;
            return res.data;
        } finally {
            loading.value = false;
        }
    };

    // 添加知识库到Agent
    const addVectorToAgent = async (vectorId: number) => {
        loading.value = true;
        try {
            const res = await agentApi.addVector(usingAgent.value.id, vectorId);
            return res.data;
        } finally {
            loading.value = false;
        }
    };

    // 从Agent移除知识库
    const removeVectorFromAgent = async (vectorId: number) => {
        loading.value = true;
        try {
            const res = await agentApi.deleteVector(usingAgent.value.id, vectorId);
            return res.data;
        } finally {
            loading.value = false;
        }
    };

    // 根据ID获取Agent名称
    const getAgentNameById = (id: number): string => {
        const agent = allAgents.value.find(a => a.id === id);
        return agent?.name || '';
    };

    return {
        agents,
        allAgents,
        currentAgent,
        loading,
        pageQuery,
        total,
        usingAgent,
        createAgent,
        fetchAgent,
        updateAgent,
        deleteAgent,
        fetchAllAgents,
        fetchAgentPage,
        addVectorToAgent,
        removeVectorFromAgent,
        getAgentNameById,
    };
});