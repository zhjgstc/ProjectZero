import React from 'react';
import List from '@material-ui/core/List';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import * as MySqlModels from '../../models/MySql';
import Icon from '@material-ui/core/Icon';
import * as DBHelper from '../../component/db-helper/MySql';
import * as Utils from '../../utils/Utils';
import Confirm from '../../component/confirm/confirm';



interface IProps {
    source: Array<MySqlModels.IConfig>,
    onClick?: any,
    onRefresh: any,
    onSelectDataBase: any
}

interface IState {
    list: Array<MySqlModels.IHostItem>,
    rightClickItem?: MySqlModels.IHostItem,
    showDialog: boolean
}

export default class LeftBar extends React.Component<IProps, IState>{
    constructor(props: any) {
        super(props);
        this.state = {
            list: new Array<MySqlModels.IHostItem>(),
            showDialog: false,
        }
    }

    componentDidMount() {
        this.initData();
    }

    /**
     * server右击事件
     * @param e 当前右击的元素
     * @param item 元素对应的数据
     */
    contextMenu = (e: any, item: MySqlModels.IHostItem) => {
        const { remote } = window.require('electron');
        const { Menu, MenuItem } = remote;

        //右键餐单
        const menu = new Menu();
        menu.append(new MenuItem({
            label: '打开连接',
            click: () => {
                this.openConnectionClick(item);
            }
        }));
        menu.append(new MenuItem({
            label: '关闭连接',
            click: () => {
                this.closeConnClick(item);
            }
        }));
        menu.append(new MenuItem({ type: 'separator' }));//分割线
        menu.append(new MenuItem({
            label: '编辑连接',
            click: () => {
                this.showEditForm(item.item);
            }
        }));
        menu.append(new MenuItem({
            label: '删除连接',
            click: () => {
                this.setState({ rightClickItem: item, showDialog: true });
            }
        }));
        menu.append(new MenuItem({ type: 'separator' }));//分割线
        menu.append(new MenuItem({
            label: '新建数据库',
            click: function () {
                console.log('item 1 clicked')
            }
        }));
        menu.append(new MenuItem({
            label: '新建查询',
            click: function () {
                console.log('item 1 clicked')
            }
        }));

        e.preventDefault();
        menu.popup(remote.getCurrentWindow(), e.clientX, e.clientY);
    }

    initData = () => {
        var list = this.props.source;
        if (list) {
            for (let index = 0; index < list.length; index++) {
                const element = list[index];
                this.state.list.push({
                    item: element,
                    open: false,
                    databases: new Array<MySqlModels.IDatabase>()
                });
            }
            this.setState({ list: this.state.list });
        }
    }

    showEditForm = (item: MySqlModels.IConfig) => {
        if (this.props.onClick) {
            this.props.onClick(item);
        }
    }

    openConnectionClick = (item: MySqlModels.IHostItem) => {
        var index = Utils.Loadsh.findIndex(this.state.list, { item: item.item });
        var model = this.state.list[index];
        if (model.open) {
            return;
        }
        DBHelper.openConnection(item.item, (flag: boolean, conn: any) => {
            if (flag) {
                this.state.list[index].conn = conn;
                DBHelper.querySql(conn, "show databases;", (error: any, results: any, fields: any) => {
                    console.log(results);
                    if (!error) {
                        for (let i = 0; i < results.length; i++) {
                            const element = results[i];
                            this.state.list[index].databases.push({ name: element.Database, open: false, selected: false, tables: new Array<MySqlModels.ITableInfo>() });
                        }
                        this.state.list[index].open = true;
                        this.setState({ list: this.state.list });

                    }
                });
            } else {
                alert("无法连接数据库")
            }
        });

    }

    closeConnClick = (item: MySqlModels.IHostItem) => {
        var index = Utils.Loadsh.findIndex(this.state.list, { item: item.item });
        var model = this.state.list[index];
        if (!model.open) {
            return;
        }
        if (model.open) {
            model.open = false;
            model.conn.end();
            model.conn = null;
            model.databases = new Array<MySqlModels.IDatabase>();
            this.state.list[index] = model;
            this.setState({ list: this.state.list });
        }
    }

    /**
     * 删除连接弹出提示框的连接
     */
    onConfirmSubmit = (id: number) => {
        this.setState({ showDialog: false });
        const store = new Utils.Store();
        var list = store.get(Utils.DBListKey);
        if (list) {
            list.splice(list.findIndex((item: MySqlModels.IConfig) => item.id === id), 1)
            console.log(list);
            store.set(Utils.DBListKey, list);
            this.props.onRefresh();
        }
    }

    useDataBaseOnDoubleClick = (host: MySqlModels.IHostItem, database: MySqlModels.IDatabase) => {
        var index = Utils.Loadsh.findIndex(this.state.list, { item: host.item });
        var model = this.state.list[index];
        var dataBaseIndex = Utils.Loadsh.findIndex(model.databases, { name: database.name });
        if (!model.databases[dataBaseIndex].open) {
            model.databases[dataBaseIndex].open = true;
            this.state.list[index] = model;
            this.setState({ list: this.state.list });
            this.props.onSelectDataBase(model, database, "表");
        }
    }

    renderDataBase = (item: MySqlModels.IHostItem) => {
        var items = [];
        for (let index = 0; index < item.databases.length; index++) {
            const element = item.databases[index];
            items.push(
                <div key={index}>
                    <ListItem
                        button
                        style={{ paddingLeft: "30px" }}
                        onDoubleClick={() => this.useDataBaseOnDoubleClick(item, element)}
                    >
                        <ListItemIcon>
                            <Icon className="fa fa-database" style={{ color: element.open ? "green" : "black" }} />
                        </ListItemIcon>
                        <ListItemText primary={element.name} />
                    </ListItem>
                    <Collapse in={element.open} timeout="auto" unmountOnExit>
                        {this.renderDataBaseChild(item, element)}
                    </Collapse>
                </div >
            );
        }
        return (items);
    }

    renderDataBaseChild = (host: MySqlModels.IHostItem, database: MySqlModels.IDatabase) => {
        return (
            <List component="div" disablePadding>
                <ListItem button
                    style={{ paddingLeft: "60px" }}
                    onClick={(e) => { this.props.onSelectDataBase(host, database, "表"); }}>
                    <ListItemIcon>
                        <Icon className="fa fa-table" style={{ color: "#3C85BE" }} />
                    </ListItemIcon>
                    <ListItemText primary="表" />
                </ListItem>
                <ListItem button
                    style={{ paddingLeft: "60px" }}

                    onClick={(e) => { this.props.onSelectDataBase(host, database, "视图"); }}>
                    <ListItemIcon>
                        <Icon className="fa fa-table" style={{ color: "#3C85BE" }} />
                    </ListItemIcon>
                    <ListItemText primary="视图" />
                </ListItem>
                <ListItem button
                    style={{ paddingLeft: "60px" }}

                    onClick={(e) => { this.props.onSelectDataBase(host, database, "函数"); }}>
                    <ListItemIcon>
                        <Icon className="fa fa-chain" style={{ color: "#3C85BE" }} />
                    </ListItemIcon>
                    <ListItemText primary="函数" />
                </ListItem>
                <ListItem button
                    style={{ paddingLeft: "60px" }}

                    onClick={(e) => { this.props.onSelectDataBase(host, database, "事件"); }}>
                    <ListItemIcon>
                        <Icon className="fa fa-clock-o" style={{ color: "#3C85BE" }} />
                    </ListItemIcon>
                    <ListItemText primary="事件" />
                </ListItem>
            </List>
        )
    }

    render() {
        return (
            <div style={{ borderRightWidth: "1px", borderRightColor: "#D4D4D4" }}>
                <List>
                    {
                        this.state.list ? this.state.list.map((item: MySqlModels.IHostItem, index) => {

                            return (
                                <div key={index}>
                                    <ListItem button key={index}
                                        onDoubleClick={() => this.openConnectionClick(item)}
                                        onContextMenu={(e) => this.contextMenu(e, item)}>
                                        <ListItemIcon>
                                            <Icon className="fa fa-server" style={{ color: item.open ? "green" : "black" }} />
                                        </ListItemIcon>
                                        <ListItemText primary={item.item.name} />
                                    </ListItem>
                                    <Collapse in={item.open} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {
                                                item.databases.length > 0 ? this.renderDataBase(item) : null
                                            }

                                        </List>
                                    </Collapse>
                                </div>
                            )
                        }) : null
                    }
                </List>
                {
                    this.state.rightClickItem && this.state.rightClickItem.item ? <Confirm
                        title="注意！"
                        text={"请确认是否要删除" + this.state.rightClickItem.item.name}
                        open={this.state.showDialog}
                        onClose={() => { this.setState({ showDialog: false }) }}
                        onSubmit={() => this.onConfirmSubmit(this.state.rightClickItem.item.id)}
                    ></Confirm> : null
                }

            </div>
        )
    }
}