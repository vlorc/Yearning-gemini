<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="md-sync"></Icon>
                Template
            </p>
            <Form inline ref="queryForm" :modal="find">
                <FormItem>
                </FormItem>
                <FormItem>
                    <Button type="warning" @click="createTemplate">新建模板</Button>
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
                        @on-ok="delTemplate(row)"
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
        <Modal v-model="is_open" title="模板" @on-ok="postTemplate">
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
                <FormItem label="类型" required>
                    <Select v-model="general.type">
                        <Option v-for="i in fetchList.types" :key="i.v" :value="i.v">{{ i.title }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="事件" required>
                    <Select v-model="general.event" clearable multiple filterable>
                        <Option v-for="i in fetchList.events" :key="i.v" :value="i.v">{{ i.title }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="标题" prop="title">
                    <Input v-model="general.title" ></Input>
                </FormItem>
                <FormItem label="内容" prop="body">
                    <Input type="textarea" :autosize="true" v-model="general.body" ></Input>
                </FormItem>
                <FormItem label="通道" required>
                    <Select v-model="general.channel">
                        <Option v-for="i in fetchList.channels" :key="i.v" :value="i.v">{{ i.title }}</Option>
                    </Select>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script lang="ts">
import {Mixins, Component} from "vue-property-decorator";
import FetchMixins from "@/mixins/fetch";
import {
    TemplateCreateOrEditApi, TemplateFetchApi, TemplateMode
} from "@/apis/templateApis";
import {FetchCommonGetApis} from "@/apis/commonApis";
import {AxiosResponse} from "axios";
import {Res} from "@/interface";

@Component
export default class emplate extends Mixins(FetchMixins) {
    fetchList = {
        source: [],
        drivers: [
            {
                'title': 'default',
                'v': 'default'
            }
        ],
        types: [
            {
                'title': 'text',
                'v': 'text'
            },
            {
                'title': 'html',
                'v': 'html'
            },
            {
                'title': 'markdown',
                'v': 'markdown'
            },
            {
                'title': 'json',
                'v': 'json'
            }
        ],
        channels: [
            {
                'title': 'email',
                'v': 'email'
            },
            {
                'title': 'webhook',
                'v': 'webhook'
            }
        ],
        events: 	[
            {"v":"ORDER_EXEC_CREATE",  "title":"工单提交"},
            {"v":"ORDER_EXEC_PASS",    "title":"工单通过"},
            {"v":"ORDER_EXEC_REJECT",  "title":"工单拒绝"},
            {"v":"ORDER_EXEC_SUCCESS", "title":"工单执行成功"},
            {"v":"ORDER_EXEC_FAILED",  "title":"工单执行失败"},
            {"v":"ORDER_EXEC_PERFORM", "title":"工单移交"},
            {"v":"ORDER_EXEC_UNDO",    "title":"工单撤销"},
            {"v":"ORDER_QUERY_CREATE", "title":"查询申请创建"},
            {"v":"ORDER_QUERY_PASS",   "title":"查询申请通过"},
            {"v":"ORDER_QUERY_REJECT", "title":"查询申请拒绝"}
        ]
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
            title: '类型',
            key: 'type'
        },
        {
            title: '标题',
            key: 'title'
        },
        {
            title: '通道',
            key: 'channel'
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

    createTemplate() {
        this.is_open = !this.is_open
    }

    postTemplate() {
        let is_validate: any = this.$refs['general'];
        is_validate.validate((valid: boolean) => {
            if (valid) {
                let v = Object.assign({}, this.general) as TemplateMode;
                v.event = (v.event as string[]).join(",");
                TemplateCreateOrEditApi({tp: "create", template: v})
                    .then(() => {
                        this.current_page(this.current);
                    })
            } else {
                this.$Message.error("请填写相关性信息！")
            }
        })
    }

    current_page(vl = 1) {
        TemplateFetchApi({page: vl, find: this.find})
            .then((res: AxiosResponse<Res>) => {
                this.datas = res.data.payload.data;
                this.datas.forEach((item: { status: number | boolean; }) => {
                    (item.status === 1) ? item.status = true : item.status = false
                });
                this.page_number = res.data.payload.page
            })
    }

    editRecord(vl: any) {
        let v = Object.assign({}, vl);
        v.status = vl.status ? 1 : 2;
        v.event = (vl.event || "").split(",");
        console.log(v);
        this.general = v;
        this.is_open = true;
    }

    delTemplate(vl: { id: number }) {

    }

    activityStatus(vl: { status: boolean; id: number; }) {
        TemplateCreateOrEditApi({tp: 'active', template: {id: vl.id, status: vl.status ? 1 : 2}})
    }

    mounted() {
        this.current_page();
    }
}
</script>

<style>
@import "../../../styles/common.less";
</style>