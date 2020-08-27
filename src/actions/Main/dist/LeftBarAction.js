"use strict";
exports.__esModule = true;
exports.useDataBaseAction = exports.delHostAction = exports.closeHostAction = exports.addHostAction = exports.updateHostAction = exports.initHostAction = exports.CLOSEHOST = exports.OPENHOST = exports.DELHOST = exports.ADDHOST = exports.INITHOST = void 0;
var utils = require("../../utils/Utils");
exports.INITHOST = "INITHOST";
exports.ADDHOST = "ADDHOST";
exports.DELHOST = "DELHOST";
exports.OPENHOST = "OPENHOST";
exports.CLOSEHOST = "CLOSEHOST";
/**
 * 记录HostList
 */
var HostList = new Array();
/**
 * 加载host列表
 */
exports.initHostAction = function () {
    var store = new utils.Store();
    HostList = new Array();
    var list = store.get(utils.DBListKey);
    list = utils.Loadsh.orderBy(list, ['id'], ['desc']);
    for (var index = 0; index < list.length; index++) {
        var element = list[index];
        HostList.push({
            item: element,
            open: false,
            databases: new Array()
        });
    }
    return {
        type: exports.INITHOST, hosts: HostList
    };
};
/**
 * 打开host
 * @param item 要打开的host
 */
exports.updateHostAction = function (item) {
    var index = utils.Loadsh.findIndex(HostList, { item: item.item });
    HostList[index] = item;
    return {
        type: exports.OPENHOST, hosts: HostList
    };
};
/**
 * 增加一个数据库项
 * @param item 要增加的数据库项
 */
exports.addHostAction = function (item) {
    HostList.push(item);
    return {
        type: exports.ADDHOST, hosts: HostList
    };
};
/**
 * 关闭host主机后更新一下列表
 * @param item 关闭的数据库项
 */
exports.closeHostAction = function (item) {
    var index = utils.Loadsh.findIndex(HostList, { item: item.item });
    HostList[index] = item;
    return {
        type: exports.OPENHOST, hosts: HostList
    };
};
/**
 * 删除host主机
 * @param item 要删除的host项
 */
exports.delHostAction = function (item) {
    var index = utils.Loadsh.findIndex(HostList, { item: item.item });
    HostList.splice(index, 1);
    return {
        type: exports.OPENHOST, hosts: HostList
    };
};
/**
 * 使用数据库
 * @param host 主机
 * @param database 数据库
 */
exports.useDataBaseAction = function (host, database) {
    var index = utils.Loadsh.findIndex(HostList, { item: host.item });
    var model = HostList[index];
    var dataBaseIndex = utils.Loadsh.findIndex(model.databases, { name: database.name });
    if (!model.databases[dataBaseIndex].open) {
        model.databases[dataBaseIndex].open = true;
        HostList[index] = model;
        return {
            type: exports.OPENHOST, hosts: HostList
        };
    }
};
