import {request} from "@/libs/requests";


interface LoginForm {
    username: string;
    password: string;
}


export function LoginApi(args: LoginForm) {
    return request({
        url: '/login',
        method: "post",
        data: args
    })
}

