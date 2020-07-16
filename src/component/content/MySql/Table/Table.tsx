import React from 'react';
import * as MySqlModels from '../../../../models/MySql';
import * as DBHelper from '../../../db-helper/MySql';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import moment from 'moment';
interface IProps {
    item: {
        host: MySqlModels.IHostItem,
        database: MySqlModels.IDatabase,
        action: string
    },
    onRefresh: any
}


export default class TableList extends React.Component<IProps, {}> {

    componentDidMount() {
        this.initData();
    }

    initData = () => {
        if (this.props.item.database.tables.length == 0) {
            var sql = "select * from information_schema.`TABLES` where TABLE_SCHEMA = '" + this.props.item.database.name + "'";
            DBHelper.querySql(this.props.item.host.conn, sql, (error: any, results: any, fields: any) => {
                if (error) {
                    console.log(error.message);
                    return;
                }
                if (fields && results) {
                    console.log(fields);
                    console.log(results);
                    var list = new Array<MySqlModels.ITableInfo>();
                    for (let index = 0; index < results.length; index++) {
                        const item = results[index];
                        var model: MySqlModels.ITableInfo = {
                            TABLE_CATALOG: item.TABLE_CATALOG,
                            TABLE_SCHEMA: item.TABLE_SCHEMA,
                            TABLE_NAME: item.TABLE_NAME,
                            TABLE_TYPE: item.TABLE_TYPE,
                            ENGINE: item.ENGINE,
                            VERSION: item.VERSION,
                            ROW_FORMAT: item.ROW_FORMAT,
                            TABLE_ROWS: item.TABLE_ROWS,
                            AVG_ROW_LENGTH: item.AVG_ROW_LENGTH,
                            DATA_LENGTH: item.DATA_LENGTH,
                            MAX_DATA_LENGTH: item.MAX_DATA_LENGTH,
                            INDEX_LENGTH: item.INDEX_LENGTH,
                            DATA_FREE: item.DATA_FREE,
                            AUTO_INCREMENT: item.AUTO_INCREMENT,
                            CREATE_TIME: item.CREATE_TIME ? moment(item.CREATE_TIME).format("yyyy-MM-DD HH:mm:ss") : "",
                            UPDATE_TIME: item.UPDATE_TIME ? moment(item.UPDATE_TIME).format("yyyy-MM-DD HH:mm:ss") : "",
                            CHECK_TIME: item.CHECK_TIME,
                            TABLE_COLLATION: item.TABLE_COLLATION,
                            CHECKSUM: item.CHECKSUM,
                            CREATE_OPTIONS: item.CREATE_OPTIONS,
                            TABLE_COMMENT: item.TABLE_COMMENT
                        }
                        list.push(model);
                    }
                    this.props.item.database.tables = list;
                }
            });
        }
    }
    renderTableHeader = () => {
        return (
            <TableHead>
                <TableRow>
                    <TableCell>名</TableCell>
                    <TableCell>行</TableCell>
                    <TableCell>数据长度</TableCell>
                    <TableCell>引擎</TableCell>
                    <TableCell>创建日期</TableCell>
                    <TableCell>修改日期</TableCell>
                    <TableCell>排序规则</TableCell>
                    <TableCell>注释</TableCell>
                </TableRow>
            </TableHead>
        )
    }

    renderTableContent = () => {
        return (
            <TableBody>
                {
                    this.props.item.database.tables.map((item, index) => {
                        return (
                            <TableRow key={index}>
                                <TableCell>{item.TABLE_NAME}</TableCell>
                                <TableCell>{item.TABLE_ROWS}</TableCell>
                                <TableCell>{item.DATA_LENGTH}</TableCell>
                                <TableCell>{item.ENGINE}</TableCell>
                                <TableCell>{item.CREATE_TIME}</TableCell>
                                <TableCell>{item.UPDATE_TIME}</TableCell>
                                <TableCell>{item.TABLE_COLLATION}</TableCell>
                                <TableCell>{item.TABLE_COMMENT}</TableCell>
                            </TableRow>
                        )
                    })
                }
            </TableBody>
        )
    }

    renderTable = () => {
        if (this.props.item.database.tables.length > 0) {
            return (
                <Table>
                    {this.renderTableHeader()}
                    {this.renderTableContent()}
                </Table>
            )
        } else {
            return null;
        }
    }

    render() {
        return (
            <div>
                {this.renderTable()}
            </div>
        )
    }
}