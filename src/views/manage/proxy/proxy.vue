<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="md-sync"></Icon>
                Proxy
            </p>
            <Form inline ref="queryForm" :modal="find">
                <FormItem>
                </FormItem>
                <FormItem>
                    <Button type="warning" @click="createProxy">新建代理</Button>
                </FormItem>
                <FormItem>
                    <Input placeholder="名称" v-model="find.text"></Input>
                </FormItem>
                <FormItem>
                    <Button type="success" @click="queryData">查询</Button>
                    <Button type="primary" @click="queryCancel" class="margin-left-10">重置</Button>
                </FormItem>
            </Form>
            <Table :columns="columns" :data="datas">
                <template slot-scope="{ row }" slot="status">
                    <i-switch v-model="row.status" @on-change="activityStatus(row)">
                        <span slot="open">开</span>
                        <span slot="close">关</span>
                    </i-switch>
                </template>
                <template slot-scope="{ row }" slot="action">
                    <Button type="primary" @click="editRecord(row)" size="small">编辑</Button>
                    <Poptip
                        confirm
                        title="确定要删除吗？"
                        @on-ok="delRecord(row)"
                        transfer
                    >
                        <Button type="error" class="margin-left-10" size="small">删除</Button>
                    </Poptip>
                </template>
            </Table>
            <br>
            <Page :total="page_number" show-elevator @on-change="current_page" :page-size="15"
                  :current.sync="current"></Page>
        </Card>
        <Modal v-model="is_open" title="模板" @on-ok="postProxy">
            <Form :model="general" ref="general" :rules="ruleValidate">
                <FormItem label="名称" prop="name">
                    <Input v-model="general.name" ></Input>
                </FormItem>
                <FormItem label="别名" prop="alias">
                    <Input v-model="general.alias" ></Input>
                </FormItem>
                <FormItem label="驱动" required>
                    <Select v-model="general.driver">
                        <Option v-for="i in fetchList.drivers" :key="i.v" :value="i.v">{{ i.title }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="连接" prop="url">
                    <Input v-model="general.url" ></Input>
                </FormItem>
                <FormItem label="用户" prop="username">
                    <Input v-model="general.username" ></Input>
                </FormItem>
                <FormItem label="密码" prop="password">
                    <Input v-model="general.password" type="password" password placeholder="请输入密码" ></Input>
                </FormItem>
                <FormItem label="密钥" prop="secret">
                    <Input type="textarea" :autosize="true" v-model="general.secret" ></Input>
                </FormItem>
                <Button type="info" @click="testProxy()">测试连接</Button>
            </Form>
        </Modal>
    </div>
</template>

<script lang="ts">
import {Mixins, Component} from "vue-property-decorator";
import FetchMixins from "@/mixins/fetch";
import {
    ProxyCreateOrEditApi, ProxyFetchApi, ProxyDeleteApi, ProxyDetailApi,  ProxyMode
} from "@/apis/proxyApis";
import {FetchCommonGetApis} from "@/apis/commonApis";
import {AxiosResponse} from "axios";
import {Res} from "@/interface";
import Basic from "@/mixins/basic";

@Component
export default class Proxy extends Mixins(FetchMixins) {
    fetchList = {
        source: [],
        drivers: [
            {
                'title': 'ssh',
                'v': 'ssh'
            }
        ],
    };
    columns = [
        {
            title: '名称',
            key: 'name'
        },
        {
            title: '别名',
            key: 'alias'
        },
        {
            title: '驱动',
            key: 'driver',
        },
        {
            title: '更新时间',
            key: 'updatedAt'
        },
        {
            title: '创建时间',
            key: 'createdAt'
        },
        {
            title: '状态',
            key: 'status',
            slot: 'status'
        },
        {
            title: '操作',
            key: 'action',
            slot: 'action'
        },
    ];
    datas = [] as any;

    createProxy() {
        this.is_open = !this.is_open
    }

    postProxy() {
        let is_validate: any = this.$refs['general'];
        is_validate.validate((valid: boolean) => {
            if (valid) {
                ProxyCreateOrEditApi({tp: "create", proxy: Object.assign({}, this.general) as ProxyMode})
                    .then(() => {
                        this.current_page(this.current);
                    })
            } else {
                this.$Message.error("请填写相关性信息！")
            }
        })
    }

    testProxy() {
        let is_validate: any = this.$refs['general'];
        is_validate.validate((valid: boolean) => {
            if (valid) {
                ProxyCreateOrEditApi({tp: "test", proxy: Object.assign({}, this.general) as ProxyMode})
                    .then(() => {
                        this.current_page(this.current);
                    })
            } else {
                this.$Message.error("请填写相关性信息！")
            }
        })
    }

    current_page(vl = 1) {
        ProxyFetchApi({page: vl, find: this.find})
            .then((res: AxiosResponse<Res>) => {
                this.datas = res.data.payload.data;
                this.datas.forEach((item: { status: number | boolean; }) => {
                    (item.status === 1) ? item.status = true : item.status = false
                });
                this.page_number = res.data.payload.page
            })
    }

    editRecord(vl: { id: number }) {
        (this.general as any)= {};
        ProxyDetailApi(vl.id)
            .then((res: AxiosResponse<Res>) => {
                this.general = res.data.payload;
                this.is_open = true;
             })
    }

    delRecord(vl: { id: number }) {
        ProxyDeleteApi(vl.id)
              .then(() => {
                        this.current_page(this.current);
                    })
    }

    activityStatus(vl: { status: boolean; id: number; }) {
        ProxyCreateOrEditApi({tp: 'active', proxy: {id: vl.id, status: vl.status ? 1 : 2}})
    }

    mounted() {
        this.current_page();
    }
}
</script>

<style>
@import "../../../styles/common.less";
</style>