import { defineStore } from 'pinia';
import { ref } from 'vue';
import { aiChatApi } from '@/api/chatApi';
import {useAgentStore} from "@/stores";
import type {Document} from "@/types/entity/Document";
import type {Chat} from "@/types/entity/Chat";


export const useAiChatStore = defineStore('aiChat', () => {
    const agentStore = useAgentStore()

    const messages = ref<Chat[]>([]); // key: agentId, value: 消息列表
    const isStreaming = ref(false);
    const loading = ref(false);

    const searchingVectors = ref<Document[]>([]);

    // 发送消息（SSE流式响应）
    const sendMessage = async (agentId: number, question: string) => {
        if (loading.value || isStreaming.value) {
            return
        }

        // 添加用户消息
        addUserMessage(question)

        isStreaming.value = true

        try {
            const response = await aiChatApi.chat(agentId, question)

            if (!response.ok) {
                throw new Error(`请求失败: ${response.status}`)
            }

            if (!response.body) {
                throw new Error("没有返回内容")
            }

            let assistantMessage = ''
            const decoder = new TextDecoder()
            const reader = response.body.getReader()

            // 先添加一个空的助手消息占位
            const messageId = addAssistantMessage('')

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                assistantMessage += decoder.decode(value)
                updateAssistantMessage(messageId, assistantMessage)
            }
        } catch (err) {
            addSystemMessage("AI服务暂时不可用，请稍后再试")
        } finally {
            isStreaming.value = false
        }
    };

    const loadChatHistory = async () => {
        loading.value = true
        try {
            if (agentStore.usingAgent.id  === undefined) return
            const response = await aiChatApi.getHistory(agentStore.usingAgent.id)
            messages.value = response.data.data || []
        } finally {
            loading.value = false
        }
    }



    // 清空指定Agent的消息
    const clearMessages = async (agentId: number) => {
        loading.value = true;
        try {
            const res = await aiChatApi.deleteAll(agentId);
            messages.value = messages.value.filter(m => m.conversationId !== agentId.toString())
            return res.data;
        } finally {
            loading.value = false;
        }
    };

    // 删除指定的对话记录
    const deleteChat = async (id: number) => {
        loading.value = true;
        try {
            const res = await aiChatApi.delete(agentStore.usingAgent.id, id);
            messages.value = messages.value.filter(m => m.id !== id)
            console.log(messages.value)

            return res.data;
        } finally {
            loading.value = false;
        }
    };

    const getVectors = async () => {
        if (agentStore.usingAgent.id  === undefined) return
        const res =  await aiChatApi.getVectors(agentStore.usingAgent.id);
        searchingVectors.value = res.data.data;
        return res.data;
    };

    // 辅助方法：添加用户消息
    const addUserMessage = (content: string) => {
        messages.value.push({
            id: Date.now(),
            conversationId: agentStore.usingAgent.id?.toString() || '',
            content,
            type: 'USER',
            timestamp: new Date().toISOString()
        })
    }


    // 辅助方法：添加助手消息（返回消息ID用于更新）
    const addAssistantMessage = (content: string): number => {
        const messageId = Date.now()
        messages.value.push({
            id: messageId,
            conversationId: agentStore.usingAgent.id?.toString() || '',
            content,
            type: 'ASSISTANT',
            timestamp: new Date().toISOString()
        })
        return messageId
    }

    // 辅助方法：添加系统消息
    const addSystemMessage = (content: string) => {
        messages.value.push({
            id: Date.now(),
            conversationId: agentStore.usingAgent.id?.toString() || '',
            content,
            type: 'SYSTEM',
            timestamp: new Date().toISOString()
        })
    }



    // 辅助方法：更新助手消息
    const updateAssistantMessage = (messageId: number, content: string) => {
        const message = messages.value.find(m => m.id === messageId)
        if (message && message.type === 'ASSISTANT') {
            message.content = content
        }
    }

    return {
        messages,
        isStreaming,
        loading,
        searchingVectors,
        sendMessage,
        loadChatHistory,
        clearMessages,
        deleteChat,
        getVectors,
    };
});