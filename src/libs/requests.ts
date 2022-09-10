import axios, {AxiosInstance, AxiosResponse} from 'axios'
import libs from "@/libs/libs";
// @ts-ignore
import Modal from "view-design/src/components/modal"
// @ts-ignore
import Message from "view-design/src/components/message"
// @ts-ignore
import Notice from "view-design/src/components/notice"
import module_general from "@/store/modules/general";
import {LoginApi} from "@/apis/loginApis";
import {router} from "@/main";
import {loginRender} from "@/views/login/render";
import {Res} from "@/interface";

const ACCESS_TOKEN = sessionStorage.getItem("jwt")

const request: AxiosInstance = axios.create({})

function ReLoginHandler() {
    Modal.warning({
        title: '重新登录',
        okText: '登录',
        closable: false,
        loading: true,
        render: loginRender,
        onOk: () => {
            LoginApi( {
                username: sessionStorage.getItem('user') as string,
                password: module_general.password
            })
                .then((res: AxiosResponse<Res>) => {
                    sessionStorage.setItem('jwt', `Bearer ${res.data.payload.token}`);
                    window.location.reload()
                })
                .catch(() => {
                    router.push({name: 'login'}).then(() => {
                    })
                })
                .finally(() => Modal.remove())
        }
    })
}

const errorHandler = (error: { response: { data: { message: string }; status: number } }) => {
    if (error.response) {
        if (error.response.status === 401) {
            if (document.getElementsByClassName('ivu-message-notice').length === 0) {
                let text = 'Token过期！请重新登录!';
                Message.warning({content: text, duration: 5});
            }
            ReLoginHandler()
            return Promise.reject(error)
        }
        const data = error.response.data
        Notice.error({
            title: `状态码:${error.response.status}`,
            desc: data.message
        })
    }
    return Promise.reject(error)
}

const responseInject = (res: Res) => {
    if (res.text !== '' && res.code === 1200) {
        Notice.info({
            title: '状态码:1200',
            desc: res.text
        })
    }

    if (res.code > 1200) {
        Notice.error({
            title: `状态码:${res.code}`,
            desc: res.text
        })
    }

}

request.interceptors.request.use(config => {
    if (ACCESS_TOKEN !== null) {
        config.headers['Authorization'] = ACCESS_TOKEN
    }
    return config
}, errorHandler)

request.interceptors.response.use((response) => {
    responseInject(response.data)
    return response
}, errorHandler)

export {
    request
}

