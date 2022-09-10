import libs from "@/libs/libs";
import {request} from "@/libs/requests";
import {FlowOrder} from "@/interface";

const FlowCommonPath = {
    basic: `${libs.url}/manage/flow`,
}

export interface Flow {
    steps: FlowOrder[];
    source: string;
}

export function FlowAllSourceFetchApi() {
    return request({
        method: 'get',
        url: FlowCommonPath.basic
    })
}

export function FlowFetchProfile(args: string) {
    return request({
        method: 'put',
        params: {
            source: args
        },
        url: FlowCommonPath.basic
    })
}

export function FlowCreateOrEditApi(args:Flow) {
    return request({
        method: 'post',
        data: args,
        url: FlowCommonPath.basic
    })
}