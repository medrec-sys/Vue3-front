import type { AxiosResponse } from 'axios';
import {myAxios} from "@/utils/axios";
import type {Result} from "@/types/common/Result";

export const loginApi = {
    // 用户登录
    login(account: string, password: string): Promise<AxiosResponse<Result<string>>> {
        return myAxios({
            method: 'post',
            url: '/api/login/login',
            data: {
                account,
                password,
            },
        });
    },

    // 用户注册
    register(account: string, username: string, password: string): Promise<AxiosResponse<Result<number>>> {
        return myAxios({
            method: 'post',
            url: '/api/login/register',
            data: {
                account,
                username,
                password,
            },
        });
    },
};