import React from 'react';
import * as MySqlModels from '../../../../models/MySql';
import * as DBHelper from '../../../db-helper/MySql';
import { Icon, Tooltip, IconButton, Button, Table, TableHead, TableRow, TableCell, TableBody, TableSortLabel } from '@material-ui/core';
import moment from 'moment';

interface HeadCell {
    disablePadding: boolean;
    id: string;
    label: string;
    numeric: boolean;
}

interface IProps {
    item: {
        host: MySqlModels.IHostItem,
        database: MySqlModels.IDatabase,
        action: string
    },
    onRefresh: { (host: MySqlModels.IHostItem, database: MySqlModels.IDatabase, action: string, name: string) }
}


type Order = 'desc' | 'asc';

interface IState {
    order: Order,
    orderBy: string,
    selectRow?: {
        item: MySqlModels.ITableInfo,
        index: number
    },
    item: {
        host: MySqlModels.IHostItem,
        database: MySqlModels.IDatabase,
        action: string
    }
}



const headCells: HeadCell[] = [
    { id: 'TABLE_NAME', numeric: false, disablePadding: true, label: '名' },
    { id: 'TABLE_ROWS', numeric: true, disablePadding: false, label: '行' },
    { id: 'DATA_LENGTH', numeric: true, disablePadding: false, label: '数据长度' },
    { id: 'ENGINE', numeric: true, disablePadding: false, label: '引擎' },
    { id: 'CREATE_TIME', numeric: true, disablePadding: false, label: '创建日期' },
    { id: 'UPDATE_TIME', numeric: true, disablePadding: false, label: '修改日期' },
    { id: 'TABLE_COLLATION', numeric: true, disablePadding: false, label: '排序规则' },
    { id: 'TABLE_COMMENT', numeric: true, disablePadding: false, label: '注释' },
];
export default class TableList extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            order: 'asc',
            orderBy: 'TABLE_NAME',
            item: this.props.item
        }
    }
    componentDidMount() {
        this.initData();
    }

    componentWillReceiveProps(nextProps: IProps) {
        if (this.state.item !== nextProps.item) {
            this.setState({
                order: 'asc',
                orderBy: 'TABLE_NAME',
                item: nextProps.item
            }, () => { this.initData() });

        }
    }

    initData = () => {
        this.setState({ selectRow: undefined });
        var sql = "select * from information_schema.`TABLES` where TABLE_SCHEMA = '" + this.props.item.database.name + "' ";
        sql += " order by " + this.state.orderBy + " " + this.state.order;
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
                var hostItem = this.state.item;
                hostItem.database.tables = list;
                this.setState({ item: hostItem });
            }
        });

    }

    tableHeaderOnClick = (orderBy: string) => {
        console.log(orderBy);
        var order = this.state.order;
        if (this.state.orderBy === orderBy) {
            order = order === "asc" ? "desc" : "asc";
        } else {
            order = "asc";
        }
        this.setState({ orderBy: orderBy, order: order }, () => {
            this.initData();
        });
    }

    renderTableHeader = () => {
        var order = this.state.order;
        return (
            <TableHead>
                <TableRow>
                    {headCells.map((headCell) => (
                        <TableCell
                            key={headCell.id}
                            align={headCell.numeric ? 'right' : 'left'}
                            padding={headCell.disablePadding ? 'none' : 'default'}
                            sortDirection={this.state.orderBy === headCell.id ? order : false}
                        >
                            <TableSortLabel
                                active={this.state.orderBy === headCell.id}
                                direction={this.state.orderBy === headCell.id ? order : 'asc'}
                                onClick={() => this.tableHeaderOnClick(headCell.id)}
                            >
                                {headCell.label}
                            </TableSortLabel>
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
        )
    }

    rowClick = (item: MySqlModels.ITableInfo, index: number) => {
        this.setState({
            selectRow: {
                item: item,
                index: index
            }
        });
    }

    rowDoubleClick = (item: MySqlModels.ITableInfo, index: number) => {
        this.props.onRefresh(this.state.item.host, this.state.item.database, "表", item.TABLE_NAME);
    }

    isSelected = (item: MySqlModels.ITableInfo, index: number) => {
        if (this.state.selectRow) {
            return this.state.selectRow.index === index;
        } else {
            return false;
        }
    }

    renderTableContent = () => {
        return (
            <TableBody>
                {
                    this.state.item.database.tables.map((item: MySqlModels.ITableInfo, index: number) => {
                        const isItemSelected = this.isSelected(item, index);
                        return (
                            <TableRow key={index} selected={isItemSelected} onClick={() => this.rowClick(item, index)} onDoubleClick={() => this.rowDoubleClick(item, index)}>
                                <TableCell>
                                    <Button
                                        onClick={() => this.rowDoubleClick(item, index)}
                                        style={{ textTransform: "unset" }}
                                        variant='text'
                                        startIcon={<Icon className="fa fa-table" style={{ color: "#3C85BE" }} />}
                                    >
                                        {item.TABLE_NAME}
                                    </Button>
                                </TableCell>
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
        if (this.state.item.database.tables.length > 0) {
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
                <div>
                    <Tooltip title="打开表">
                        <IconButton aria-label="delete">
                            <Icon className="fa fa-table" style={{ color: "#3C85BE" }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="设计表">
                        <IconButton aria-label="delete">
                            <Icon className="fa fa-table" style={{ color: "#3C85BE" }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="新建表">
                        <IconButton aria-label="New">
                            <Icon className="fa fa-plus-square" style={{ color: "#3C85BE" }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="删除表">
                        <IconButton aria-label="delete">
                            <Icon className="fa fa-trash-o" style={{ color: "#3C85BE" }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="刷新">
                        <IconButton aria-label="refresh">
                            <Icon className="fa fa-refresh" style={{ color: "#3C85BE" }} />
                        </IconButton>
                    </Tooltip>
                </div>
                {this.renderTable()}
            </div>
        )
    }
}