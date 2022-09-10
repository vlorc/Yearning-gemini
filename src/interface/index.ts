import {Finder} from "@/store/modules/search";

interface order {
    tp?: number
    work_id?: string
    idc?: string
    source?: string,
    data_base?: string,
    table?: string,
    text?: string,
    delay?: string,
    type?: number,
    status?: number,
    username?: string,
    date?: string,
    execute_time?: string
    rejected?: string
    assigned?: string
    backup?: number,
    export?: number
    current_step?: number
    uuid?: string
    relevant?: string[]
    sql?: string;
}

interface other_modal {
    overdue: string,
    query_expire: string,
    limit: number,
    per_order: number,
    idc: string[],
    foce: string,
    insulate_word_list: string[],
    exclude_db_list: string[],
    exclued_db: string,
    sensitive: string,
    multi: boolean,
    register: boolean,
    export: boolean,
    query: boolean,
}

interface message_modal {
    ding: boolean,
    mail: boolean,
    port: number,
    push_type: boolean,
}

interface test_results {
    status: string,
    level: number,
    error: string,
    sql: string[],
    affect_rows: number
}

interface Permission {
    ddl_source: string[],
    dml_source: string[],
    query_source: string[],
    auditor: string[],
}

interface Fetch_data {
    idc: string[],
    source: string[],
    base: string[],
    table: string[],
    assigned: string[]
}

interface High_light {
    meta: string,
    vl: string
}

interface StepOrder {
    desc: string
    auditor: string[],
    type: number  // 0 audit 1 executor
}

interface CommonFinder {
    page: number;
    find: Finder
}

interface Res {
    code: number;
    text: string;
    payload: any;
}

interface FlowOrder {
    auditor: string[]
    type: number
    desc: string
    source?: string
}

export {
    order,
    other_modal,
    message_modal,
    test_results,
    Permission,
    Fetch_data,
    High_light,
    StepOrder,
    CommonFinder,
    Res,
    FlowOrder
}
