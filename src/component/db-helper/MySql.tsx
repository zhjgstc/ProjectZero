import * as utils from '../../utils/Utils';
import IConfig from '../../models/MySql';

/**
 * 连接数据库
 * @param hostConfig 数据库服务器连接配置信息
 * @param callBack 成功或失败后的回调函数
 */
export function openConnection(hostConfig: IConfig, callBack: any) {
    var conn = utils.MySql.createConnection({
        host: hostConfig.host,
        user: hostConfig.user,
        password: utils.Decrypt(hostConfig.pwd),
        port: hostConfig.port,
        multipleStatements: true
    })

    conn.connect((error: any) => {
        console.log(error);
        if (error) {
            callBack(false, null);
        } else {
            callBack(true, conn);
        }
    });
}

/**
 * 执行sql
 * @param conn 当前要操作的数据库
 * @param sql 要执行的sql语句
 * @param callback 结果回调
 */
export function querySql(conn: any, sql: string, callback: any) {
    conn.query(sql, (error: any, results: any, fields: any) => callback(error, results, fields));
}