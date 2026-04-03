import {myFetch} from "@/utils/fetch";
import {myAxios} from "@/utils/axios";
import type {Result} from "@/types/common/Result";
import type {Document} from "@/types/entity/Document";
import type {AxiosResponse} from "axios";
import type {Chat} from "@/types/entity/Chat";


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
            params: {
                question: question
            },
        });
    },

    /**
     * 获取指定Agent的聊天记录
     * @param agentId Agent ID
     */
    getHistory(agentId: number): Promise<AxiosResponse<Result<Chat[]>>> {
        return myAxios({
            method: 'get',
            url: `/api/ai/history/${agentId}`,
        })
    },

    /**
     * 删除指定Agent的对话记录
     * @param agentId Agent ID
     * @param id  ID
     */
    delete(agentId : number, id: number): Promise<AxiosResponse<Result<void>>> {
        return myAxios({
            method: 'delete',
            url: `/api/ai/${agentId}/${id}`,
        });
    },

    /**
     * 删除指定Agent的所有对话记录
     * @param id Agent ID
     */
    deleteAll(id: number): Promise<AxiosResponse<Result<void>>> {
        return myAxios({
            method: 'delete',
            url: `/api/ai/all/${id}`,
        });
    },

    // 根据id获取检索到的文本
    getVectors(id: number): Promise<AxiosResponse<Result<Document[]>>> {
        return myAxios({
            method: 'get',
            url: `/api/ai/vectors/${id}`,
        });
    }
};