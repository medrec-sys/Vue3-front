
import type { AxiosResponse } from 'axios';
import {myAxios} from "@/utils/axios";
import type {PageDTO} from "@/types/common/PageDTO";
import type {Result} from "@/types/common/Result";
import type {PageVO} from "@/types/common/PageVO";
import type {Vector} from "@/types/entity/Vector";
import type {VectorSearchArgs} from "@/types/dto/VectorSearchArgs";
import type {Document} from "@/types/entity/Document";


export const vectorApi = {
    // 分页获取向量列表
    getPage(page: PageDTO<Vector>): Promise<AxiosResponse<Result<PageVO<Vector>>>> {
        return myAxios({
            method: 'post',
            url: '/api/vector/list',
            data: page,
        });
    },

    // 根据ID获取向量
    getById(id: string | number): Promise<AxiosResponse<Result<Vector>>> {
        return myAxios({
            method: 'get',
            url: `/api/vector/${id}`,
        });
    },

    // 删除向量
    delete(id: number): Promise<AxiosResponse<Result<number>>> {
        return myAxios({
            method: 'delete',
            url: `/api/vector/${id}`,
        });
    },

    // 添加向量
    add(vector: Vector): Promise<AxiosResponse<Result<number>>> {
        return myAxios({
            method: 'post',
            url: '/api/vector',
            data: vector,
        });
    },

    // 更新向量
    update(vector: Vector): Promise<AxiosResponse<Result<void>>> {
        return myAxios({
            method: 'put',
            url: '/api/vector',
            data: vector,
        });
    },

    // 检索
    search(args: VectorSearchArgs, vectorId: number): Promise<AxiosResponse<Result<Document[]>>> {
        return myAxios({
            method: 'post',
            url: `/api/vector/search/${vectorId}`,
            data: args,
        });
    },

    // 根据agent id获取向量
    getByAgentId(agentId: number): Promise<AxiosResponse<Result<Vector[]>>> {
        return myAxios({
            method: 'get',
            url: `/api/vector/agent/${agentId}`,
        });
    }
};