import {myAxios} from "@/utils/axios";
import type {PageDTO} from "@/types/common/PageDTO";
import type {Result} from "@/types/common/Result";
import type {PageVO} from "@/types/common/PageVO";
import type { AxiosResponse } from 'axios';
import type {User} from "@/types/entity/User";

export const userApi = {
    // 分页获取用户列表
    getPage(page: PageDTO<User>): Promise<AxiosResponse<Result<PageVO<User>>>> {
        return myAxios({
            method: 'post',
            url: '/api/user/list',
            data: page,
        });
    },

    // 根据ID获取用户
    getById(id: number | string): Promise<AxiosResponse<Result<User>>> {
        return myAxios({
            method: 'get',
            url: `/api/user/${id}`,
        });
    },

    // 删除用户
    delete(id: number): Promise<AxiosResponse<Result<void>>> {
        return myAxios({
            method: 'delete',
            url: `/api/user/${id}`,
        });
    },

    // 添加用户
    add(user: User): Promise<AxiosResponse<Result<number>>> {
        return myAxios({
            method: 'post',
            url: '/api/user',
            data: user,
        });
    },

    // 更新用户
    update(user: User): Promise<AxiosResponse<Result<void>>> {
        return myAxios({
            method: 'put',
            url: '/api/user',
            data: user,
        });
    },
};