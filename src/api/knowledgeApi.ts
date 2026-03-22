import type {PageDTO} from "@/types/common/PageDTO";
import type {Result} from "@/types/common/Result";
import type {PageVO} from "@/types/common/PageVO";
import type { AxiosResponse } from 'axios';
import {myAxios} from "@/utils/axios";

export interface Knowledge {
    id?: number;
    // 根据实际Knowledge实体添加字段
    name?: string;
    content?: string;
    [key: string]: any;
}

export const knowledgeApi = {
    // 分页获取知识列表
    getPage(page: PageDTO<Knowledge>): Promise<AxiosResponse<Result<PageVO<Knowledge>>>> {
        return myAxios({
            method: 'post',
            url: '/api/knowledge/list',
            data: page,
        });
    },

    // 根据ID获取知识
    getById(id: string | number): Promise<AxiosResponse<Result<Knowledge>>> {
        return myAxios({
            method: 'get',
            url: `/api/knowledge/${id}`,
        });
    },

    // 删除知识
    delete(id: number): Promise<AxiosResponse<Result<number>>> {
        return myAxios({
            method: 'delete',
            url: `/api/knowledge/${id}`,
        });
    },

    // 添加知识（上传文件）
    add(file: File, vectorId: number): Promise<AxiosResponse<Result<number>>> {
        const formData = new FormData();
        formData.append('file', file);

        return myAxios({
            method: 'post',
            url: `/api/knowledge/${vectorId}`,
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // 更新知识
    update(knowledge: Knowledge): Promise<AxiosResponse<Result<void>>> {
        return myAxios({
            method: 'put',
            url: '/api/knowledge',
            data: knowledge,
        });
    },
};