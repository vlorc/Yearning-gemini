import libs from "@/libs/libs";
import {request} from "@/libs/requests";

const AutoTaskCommonPath = {
    basic: `${libs.url}/manage/template`,
}


export interface TemplateMode {
    id?: number;
    name?: string;
    alias?: string;
    type?: string;
    driver?: string;
    title?: string;
    body?: string;
    channel?: string;
    event?: string | string[];
    status?: number;
}

export interface TemplateExplorer {
    tp: string  // 类型flag
    template: TemplateMode
}

export interface TemplateFinder {
    page: number,
    find: any
}

export function TemplateCreateOrEditApi(args: TemplateExplorer) {
    return request({
        method: 'post',
        data: args,
        url: AutoTaskCommonPath.basic
    })
}

export function TemplateFetchApi(args: TemplateFinder) {
    return request({
        method: 'put',
        data: args,
        url: AutoTaskCommonPath.basic
    })
}

export function TemplateDeleteApi(args: number) {
    return request({
        method: 'delete',
        params: {
            id: args
        },
        url: AutoTaskCommonPath.basic
    })
}