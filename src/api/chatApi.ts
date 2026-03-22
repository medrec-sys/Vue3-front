import {myFetch} from "@/utils/fetch";
import {myAxios} from "@/utils/axios";


export const aiChatApi = {
    /**
     * AI对话（SSE流式响应）
     * @param id Agent ID
     * @param question 用户问题
     */
    chat(id: number, question: string): Promise<Response> {
        return myFetch({
            method: 'POST',
            url: `/api/ai/chat/${id}`,
            data: question,
        });
    },

    /**
     * 删除指定Agent的对话记录
     * @param id Agent ID
     */
    delete(id: number): Promise<void> {
        return myAxios({
            method: 'delete',
            url: `/api/ai/${id}`,
        });
    },

    /**
     * 删除指定Agent的所有对话记录
     * @param id Agent ID
     */
    deleteAll(id: number): Promise<void> {
        return myAxios({
            method: 'delete',
            url: `/api/ai/all/${id}`,
        });
    },
};