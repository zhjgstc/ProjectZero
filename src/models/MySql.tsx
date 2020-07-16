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
    selected: boolean,
    tables: Array<ITableInfo>
}

export interface IHostItem {
    item: IConfig,
    open: boolean,
    databases: Array<IDatabase>,
    conn?: any
}

export interface ITableInfo {
    TABLE_CATALOG: string,
    TABLE_SCHEMA: string,
    TABLE_NAME: string,
    TABLE_TYPE: string,
    ENGINE: string,
    VERSION: number,
    ROW_FORMAT: string,
    TABLE_ROWS: number,
    AVG_ROW_LENGTH: number,
    DATA_LENGTH: number,
    MAX_DATA_LENGTH: number,
    INDEX_LENGTH: number,
    DATA_FREE: number,
    AUTO_INCREMENT: number,
    CREATE_TIME: string,
    UPDATE_TIME: string,
    CHECK_TIME: string,
    TABLE_COLLATION: string,
    CHECKSUM: number,
    CREATE_OPTIONS: string,
    TABLE_COMMENT: string
}
