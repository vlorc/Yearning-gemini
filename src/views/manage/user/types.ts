interface DependUser {
    source: source[]
    grained: grained[]
}

interface source {
    source: string
}

interface grained {
    name: string
}

interface UserInfo {
    username: string;
    password: string;
    confirm_password: string;
    rule: string;
    department: string;
    email: string;
    real_name: string;
    mobile: string;
    openId: string;
}

export {
    DependUser,
    UserInfo
}