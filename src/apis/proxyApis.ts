import libs from "@/libs/libs";
import {request} from "@/libs/requests";

const AutoTaskCommonPath = {
    basic: `${libs.url}/manage/proxy`,
}


export interface ProxyMode {
    id?: number;
    name?: string;
    alias?: string;
    driver?: string;
    username?: string;
    password?: string;
    secret?: string;
    status?: number;
}

export interface ProxyExplorer {
    tp: string  // 类型flag
    proxy: ProxyMode
}

export interface ProxyFinder {
    page: number,
    find: any
}

export function ProxyCreateOrEditApi(args: ProxyExplorer) {
    return request({
        method: 'post',
        data: args,
        url: AutoTaskCommonPath.basic
    })
}

export function ProxyFetchApi(args: ProxyFinder) {
    return request({
        method: 'put',
        data: args,
        url: AutoTaskCommonPath.basic
    })
}

export function ProxyDeleteApi(args: number) {
    return request({
        method: 'delete',
        params: {
            id: args
        },
        url: AutoTaskCommonPath.basic
    })
}

export function ProxyDetailApi(args: number) {
    return request({
        method: 'get',
        url: AutoTaskCommonPath.basic + `?id=${args}`
    })
}