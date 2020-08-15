import React from 'react';
import * as MySqlModels from "../../models/MySql";
import * as utils from '../../utils/Utils';
import * as DBHelper from '../../component/db-helper/MySql';
import MySqlEvent from '../../component/content/MySql/Event/Event';
import MySqlFunction from '../../component/content/MySql/Function/Function';
import MySqlTable from '../../component/content/MySql/Table/Table';
import MySqlView from '../../component/content/MySql/View/View';
import MySqlPageTable from '../../page/MySql/Table/Table';
import MySqlPageQuery from '../../page/MySql/Query/Query';

export const SELECTDATABASE = "SELECTDATABASE";
export const ADDCHIPITEM = "ADDCHIPITEM";
export const GETMYSQLTALBES = "GETMYSQLTABLES";
export const SETCHIPSELECTITEM = "SETCHIPSELECTITEM";
export const DELCHIPITEM = "DELCHIPITEM";

export interface IAction {
    type: string,
    selectItem: ISelectItem,
    chipList: Array<IChipItem>
}


export interface IChipItem {
    title: string
    name: string
    host: MySqlModels.IHostItem,
    database: MySqlModels.IDatabase,
    action: string,
    component: any,
    selected: boolean
}

export interface ISelectItem {
    host: MySqlModels.IHostItem,
    database: MySqlModels.IDatabase,
    action: string
}


var ChipList = new Array<IChipItem>();
ChipList.push({
    title: "对象",
    name: "",
    host: null,
    database: null,
    action: null,
    component: <div></div>,
    selected: false
});

/**
 * 点击打开的数据库和数据库内的项
 * @param item 数据库选择项
 */
export const selectDataBaseAction = (item: ISelectItem) => {
    for (let index = 0; index < ChipList.length; index++) {
        ChipList[index].selected = false;
    }

    ChipList[0].host = item.host;
    ChipList[0].database = item.database;
    ChipList[0].action = item.action;
    ChipList[0].component = getMainComponent(item);
    ChipList[0].selected = true;
    return {
        type: SELECTDATABASE, selectItem: item, chipList: ChipList
    }
}

const getMainComponent = (item: ISelectItem) => {
    switch (item.action) {
        case "表":
            {
                return (
                    <MySqlTable></MySqlTable>
                )
            }
        case "视图":
            {
                return (
                    <MySqlView></MySqlView>
                )
            }
        case "函数":
            {
                return (
                    <MySqlFunction></MySqlFunction>
                )
            }
        case "事件":
            {
                return (
                    <MySqlEvent></MySqlEvent>
                )
            }
    }
}

/**
 * 添加tab项
 */
export const addChipItemAction = (selectItem: ISelectItem, name: string): IAction => {
    console.log(selectItem);
    console.log(name);
    var title = name ? name : "" + "@" + selectItem.database ? selectItem.database.name : "" + "(" + selectItem.host.item.name + ")";
    var flag = false;
    if (selectItem.action !== "查询") {
        for (let index = 0; index < ChipList.length; index++) {
            const element = ChipList[index];
            if (selectItem.host === element.host && element.title === title) {
                flag = true;
                ChipList[index].selected = true;
            } else {
                ChipList[index].selected = false;
            }
        }
    }

    if (!flag) {
        var item: IChipItem = {
            title: title,
            name: name,
            host: selectItem.host,
            database: selectItem.database,
            action: selectItem.action,
            component: getComponent(selectItem, name),
            selected: true
        };
        ChipList.push(item);
    }
    return {
        type: ADDCHIPITEM,
        selectItem: selectItem,
        chipList: ChipList
    }
}

/**
 * 设置当前tab页
 * @param index 设置当前tab页
 */
export const setChipSelectItemAction = (index: number) => {
    for (let i = 0; i < ChipList.length; i++) {
        ChipList[i].selected = false;
    }
    ChipList[index].selected = true;
    return {
        type: SETCHIPSELECTITEM,
        chipList: ChipList
    }
}

/**
 * 删除tab项
 * @param index 
 */
export const delChipItemAction = (index: number) => {
    ChipList.splice(index, 1);
    for (let i = 0; i < ChipList.length; i++) {
        ChipList[i].selected = false;
    }
    ChipList[0].selected = true;
    return {
        type: DELCHIPITEM,
        chipList: ChipList
    }
}

const getComponent = (selectItem: ISelectItem, name: string) => {
    if (selectItem.action === "表") {
        return <MySqlPageTable host={selectItem.host} database={selectItem.database} name={name} action={selectItem.action}></MySqlPageTable>
    }
    else if (selectItem.action === "查询") {
        return <MySqlPageQuery host={selectItem.host} />
    }
    else {
        return null;
    }
}

/**
 * 获取数据库内的表格
 * @param selectItem 
 * @param tables 
 */
export const getTablesAction = (selectItem: ISelectItem, tables: Array<MySqlModels.ITableInfo>): IAction => {
    //ChipList[0].database.tables = tables;
    selectItem.database.tables = tables;
    return {
        type: GETMYSQLTALBES,
        selectItem: {
            host: selectItem.host,
            database: selectItem.database,
            action: selectItem.action
        },
        chipList: ChipList
    }
}