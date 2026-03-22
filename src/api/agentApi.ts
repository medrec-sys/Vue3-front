import type {PageDTO} from "@/types/common/PageDTO";
import type {Result} from "@/types/common/Result";
import type {PageVO} from "@/types/common/PageVO";
import type { AxiosResponse } from 'axios';
import {myAxios} from "@/utils/axios";

export interface Agent {
    id?: number;
    // 根据实际Agent实体添加字段
    name?: string;
    description?: string;
    [key: string]: any;
}

export const agentApi = {
    // 分页获取Agent列表
    getPage(page: PageDTO<Agent>): Promise<AxiosResponse<Result<PageVO<Agent>>>> {
        return myAxios({
            method: 'post',
            url: '/api/agent/list',
            data: page,
        });
    },

    // 根据ID获取Agent
    getById(id: string | number): Promise<AxiosResponse<Result<Agent>>> {
        return myAxios({
            method: 'get',
            url: `/api/agent/${id}`,
        });
    },

    // 删除Agent
    delete(id: number): Promise<AxiosResponse<Result<void>>> {
        return myAxios({
            method: 'delete',
            url: `/api/agent/${id}`,
        });
    },

    // 添加Agent
    add(agent: Agent): Promise<AxiosResponse<Result<number>>> {
        return myAxios({
            method: 'post',
            url: '/api/agent',
            data: agent,
        });
    },

    // 更新Agent
    update(agent: Agent): Promise<AxiosResponse<Result<void>>> {
        return myAxios({
            method: 'put',
            url: '/api/agent',
            data: agent,
        });
    },

    // 添加知识库到Agent
    addVector(agentId: number, vectorId: number): Promise<AxiosResponse<Result<void>>> {
        return myAxios({
            method: 'post',
            url: '/api/agent/knowledge',
            params: {
                agentId,
                vectorId,
            },
        });
    },

    // 从Agent移除知识库
    deleteVector(agentId: number, vectorId: number): Promise<AxiosResponse<Result<void>>> {
        return myAxios({
            method: 'delete',
            url: '/api/agent/knowledge',
            params: {
                agentId,
                vectorId,
            },
        });
    },
};