import * as MySqlModels from "../../models/MySql";
import * as utils from '../../utils/Utils';
import * as DBHelper from '../../component/db-helper/MySql';

export const INITHOST = "INITHOST";
export const ADDHOST = "ADDHOST";
export const DELHOST = "DELHOST";
export const OPENHOST = "OPENHOST";
export const CLOSEHOST = "CLOSEHOST";

export interface IAction {
    type: string,
    hosts: Array<MySqlModels.IHostItem>
}

/**
 * 记录HostList
 */
var HostList = new Array<MySqlModels.IHostItem>();

/**
 * 加载host列表
 */
export const initHostAction = (): IAction => {
    const store = new utils.Store();
    HostList = new Array<MySqlModels.IHostItem>();
    var list = store.get(utils.DBListKey);
    list = utils.Loadsh.orderBy(list, ['id'], ['desc']);
    for (let index = 0; index < list.length; index++) {
        const element = list[index];
        HostList.push({
            item: element,
            open: false,
            databases: new Array<MySqlModels.IDatabase>()
        });
    }
    return {
        type: INITHOST, hosts: HostList
    }
}

/**
 * 打开host
 * @param item 要打开的host
 */
export const updateHostAction = (item: MySqlModels.IHostItem) => {
    var index = utils.Loadsh.findIndex(HostList, { item: item.item });
    HostList[index] = item;
    return {
        type: OPENHOST, hosts: HostList
    }
}

/**
 * 增加一个数据库项
 * @param item 要增加的数据库项
 */
export const addHostAction = (item: MySqlModels.IHostItem) => {
    HostList.push(item);
    return {
        type: ADDHOST, hosts: HostList
    }
}

/**
 * 关闭host主机后更新一下列表
 * @param item 关闭的数据库项
 */
export const closeHostAction = (item: MySqlModels.IHostItem) => {
    var index = utils.Loadsh.findIndex(HostList, { item: item.item });
    HostList[index] = item;
    return {
        type: OPENHOST, hosts: HostList
    }
}
/**
 * 删除host主机
 * @param item 要删除的host项
 */
export const delHostAction = (item: MySqlModels.IHostItem) => {
    var index = utils.Loadsh.findIndex(HostList, { item: item.item });
    HostList.splice(index, 1)
    return {
        type: OPENHOST, hosts: HostList
    }
}

/**
 * 使用数据库
 * @param host 主机
 * @param database 数据库
 */
export const useDataBaseAction = (host: MySqlModels.IHostItem, database: MySqlModels.IDatabase) => {
        var index = utils.Loadsh.findIndex(HostList, { item: host.item });
        var model = HostList[index];
        var dataBaseIndex = utils.Loadsh.findIndex(model.databases, { name: database.name });
        if (!model.databases[dataBaseIndex].open) {
            model.databases[dataBaseIndex].open = true;
            HostList[index] = model;
            return {
                type: OPENHOST, hosts: HostList
            }
        }
}
