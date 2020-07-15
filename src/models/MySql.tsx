export interface IConfig {
    id: number,
    name: string,
    host: string,
    port: string,
    user: string,
    pwd: string,
    remember: boolean,
    createDate: string
}

export interface IDatabase {
    name: string,
    open: boolean,
    selected: boolean
}

export interface IHostItem {
    item: IConfig,
    open: boolean,
    databases: Array<IDatabase>,
    conn?: any
}
