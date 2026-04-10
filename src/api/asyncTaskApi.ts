import type {AxiosResponse} from "axios";
import type {Result} from "@/types/common/Result";
import {myAxios} from "@/utils/axios";
import type {Task} from "@/types/dto/Task";

export const asyncTaskApi = {
    // 分页获取Agent列表
    getTask(taskId: string): Promise<AxiosResponse<Result<Task>>> {
        return myAxios({
            method: 'get',
            url: '/api/task',
            params: {
                taskId: taskId
            },
        });
    },
}