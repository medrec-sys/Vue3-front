import { defineStore } from 'pinia';
import { ref } from 'vue';
import { aiChatApi } from '@/api/chatApi';

export interface ChatMessage {
    id?: number;
    role: 'user' | 'assistant';
    content: string;
    timestamp?: number;
}

export const useAiChatStore = defineStore('aiChat', () => {
    const messages = ref<Map<number, ChatMessage[]>>(new Map()); // key: agentId, value: 消息列表
    const currentAgentId = ref<number | null>(null);
    const isStreaming = ref(false);
    const loading = ref(false);

    // 发送消息（SSE流式响应）
    const sendMessage = async (agentId: number, question: string) => {
        if (!question.trim()) return;

        // 添加用户消息
        addMessage(agentId, {
            role: 'user',
            content: question,
            timestamp: Date.now(),
        });

        isStreaming.value = true;
        loading.value = true;

        try {
            const response = await aiChatApi.chat(agentId, question);
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            // 添加一个占位的助手消息
            const assistantMessage: ChatMessage = {
                role: 'assistant',
                content: '',
                timestamp: Date.now(),
            };
            addMessage(agentId, assistantMessage);

            // 获取最新消息的索引
            const agentMessages = messages.value.get(agentId) || [];
            const lastMessageIndex = agentMessages.length - 1;

            while (reader) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const content = line.slice(6);
                        if (content !== '[DONE]') {
                            // 更新助手消息内容
                            const updatedMessages = messages.value.get(agentId) || [];
                            if (updatedMessages[lastMessageIndex]) {
                                updatedMessages[lastMessageIndex].content += content;
                                messages.value.set(agentId, [...updatedMessages]);
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error('发送消息失败:', error);
            // 添加错误提示
            addMessage(agentId, {
                role: 'assistant',
                content: '抱歉，发生了错误，请稍后重试。',
                timestamp: Date.now(),
            });
        } finally {
            isStreaming.value = false;
            loading.value = false;
        }
    };

    // 添加消息
    const addMessage = (agentId: number, message: ChatMessage) => {
        const agentMessages = messages.value.get(agentId) || [];
        messages.value.set(agentId, [...agentMessages, message]);
    };

    // 清空指定Agent的消息
    const clearMessages = async (agentId: number) => {
        loading.value = true;
        try {
            await aiChatApi.deleteAll(agentId);
            messages.value.delete(agentId);
        } finally {
            loading.value = false;
        }
    };

    // 删除指定Agent的对话记录
    const deleteChat = async (agentId: number) => {
        loading.value = true;
        try {
            await aiChatApi.delete(agentId);
            messages.value.delete(agentId);
        } finally {
            loading.value = false;
        }
    };

    // 获取指定Agent的消息列表
    const getMessages = (agentId: number): ChatMessage[] => {
        return messages.value.get(agentId) || [];
    };

    // 设置当前Agent
    const setCurrentAgent = (agentId: number) => {
        currentAgentId.value = agentId;
    };

    return {
        messages,
        currentAgentId,
        isStreaming,
        loading,
        sendMessage,
        addMessage,
        clearMessages,
        deleteChat,
        getMessages,
        setCurrentAgent,
    };
});