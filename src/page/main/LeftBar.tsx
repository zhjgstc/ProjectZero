import React from 'react';
import { connect } from 'react-redux'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import * as MySqlModels from '../../models/MySql';
import Icon from '@material-ui/core/Icon';
import * as DBHelper from '../../component/db-helper/MySql';
import * as Utils from '../../utils/Utils';
import Confirm from '../../component/confirm/confirm';
import { initHostAction, updateHostAction, closeHostAction, delHostAction } from '../../actions/Main/LeftBarAction';

interface IProps {
    source: Array<MySqlModels.IHostItem>,
    onRefresh: { (item: MySqlModels.IConfig, action: string) },
    onSelectDataBase: any,
    changeItem?: MySqlModels.IConfig,
    changeAction?: string,
    onRightMenuClick: { (item: MySqlModels.IHostItem, action: string) },
    initHosts: () => any,
    updateHost: { (item: MySqlModels.IHostItem) },
    closeHost: { (item: MySqlModels.IHostItem) },
    delHost: { (item: MySqlModels.IHostItem) }
}

interface IState {
    list: Array<MySqlModels.IHostItem>,
    rightClickItem?: MySqlModels.IHostItem,
    showDialog: boolean
}

class LeftBar extends React.Component<IProps, IState>{
    constructor(props: any) {
        super(props);
        this.state = {
            list: new Array<MySqlModels.IHostItem>(),
            showDialog: false,
        }
    }

    componentDidMount() {
        this.props.initHosts();
        //this.bindDataSource(this.props.source);
    }

    componentWillReceiveProps(nextProps: IProps) {
        if (nextProps.changeItem && nextProps.changeAction) {
            var action = nextProps.changeAction;
            var changeItem = nextProps.changeItem;
            var list = this.state.list;
            if (action === "new") {
                list.push({
                    item: changeItem,
                    open: false,
                    databases: new Array<MySqlModels.IDatabase>()
                });
            } else if (action === "delete") {
                console.log("删除")
                for (let index = 0; index < list.length; index++) {
                    const element = list[index];
                    if (element.item.id === changeItem.id) {
                        if (element.open && element.conn) {
                            element.conn.end();
                        }
                        list.splice(index, 1)
                        break;
                    }
                }
            } else if (action === "update") {
                for (let index = 0; index < list.length; index++) {
                    const element = list[index];
                    if (element.item.id === changeItem.id) {
                        list[index].item = changeItem;
                        break;
                    }
                }
            }
            console.log(list);
            this.setState({ list: list });
        }
    }
    /**
     * server右击事件
     * @param e 当前右击的元素
     * @param item 元素对应的数据
     */
    contextMenu = (e: any, item: MySqlModels.IHostItem) => {
        const onRightMenuClick = this.props.onRightMenuClick;
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

        if (item.open) {
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
                    onRightMenuClick(item, "新建查询");
                    console.log('item 1 clicked')
                }
            }));
        }


        e.preventDefault();
        menu.popup(remote.getCurrentWindow(), e.clientX, e.clientY);
    }


    showEditForm = (item: MySqlModels.IConfig) => {

    }

    openConnectionClick = (item: MySqlModels.IHostItem) => {
        var index = Utils.Loadsh.findIndex(this.props.source, { item: item.item });
        var list = this.props.source;
        var model = list[index];
        if (model.open) {
            return;
        }
        DBHelper.openConnection(item.item, (flag: boolean, conn: any) => {
            if (flag) {
                list[index].conn = conn;
                DBHelper.querySql(conn, "show databases;", (error: any, results: any, fields: any) => {
                    console.log(results);
                    if (!error) {
                        for (let i = 0; i < results.length; i++) {
                            const element = results[i];
                            list[index].databases.push({ name: element.Database, open: false, selected: false, tables: new Array<MySqlModels.ITableInfo>() });
                        }
                        list[index].open = true;
                        this.props.updateHost(list[index]);
                    }
                });
            } else {
                alert("无法连接数据库")
            }
        });
    }

    closeConnClick = (item: MySqlModels.IHostItem) => {
        var index = Utils.Loadsh.findIndex(this.props.source, { item: item.item });
        var list = this.props.source;
        var model = list[index];
        if (!model.open) {
            return;
        }
        if (model.open) {
            model.open = false;
            model.conn.end();
            model.conn = null;
            model.databases = new Array<MySqlModels.IDatabase>();
            this.props.closeHost(model);
        }
    }

    /**
     * 删除连接弹出提示框的连接
     */
    onConfirmSubmit = (host: MySqlModels.IHostItem) => {
        this.setState({ showDialog: false });
        const store = new Utils.Store();
        var id = host.item.id;
        var list = store.get(Utils.DBListKey);
        if (list) {
            var index = list.findIndex((item: MySqlModels.IConfig) => item.id === id);
            var item = list[index];
            list.splice(index, 1)

            console.log(list);
            store.set(Utils.DBListKey, list);
            this.props.delHost(host);
        }
    }

    useDataBaseOnDoubleClick = (host: MySqlModels.IHostItem, database: MySqlModels.IDatabase) => {
        var list = this.state.list;
        var index = Utils.Loadsh.findIndex(list, { item: host.item });
        var model = list[index];
        var dataBaseIndex = Utils.Loadsh.findIndex(model.databases, { name: database.name });
        if (!model.databases[dataBaseIndex].open) {
            model.databases[dataBaseIndex].open = true;
            list[index] = model;
            this.setState({ list: list });
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

    renderListItem = () => {
        return this.props.source.map((item: MySqlModels.IHostItem, index) => {
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
        })
    }

    render() {
        return (
            <div style={{ borderRightWidth: "1px", borderRightColor: "#D4D4D4" }}>
                <List>
                    {
                        this.renderListItem()
                        // this.props.source ? this.props.source.map((item: MySqlModels.IHostItem, index) => {
                        //     return (
                        //         <div key={index}>
                        //             <ListItem button key={index}
                        //                 onDoubleClick={() => this.openConnectionClick(item)}
                        //                 onContextMenu={(e) => this.contextMenu(e, item)}>
                        //                 <ListItemIcon>
                        //                     <Icon className="fa fa-server" style={{ color: item.open ? "green" : "black" }} />
                        //                 </ListItemIcon>
                        //                 <ListItemText primary={item.item.name} />
                        //             </ListItem>
                        //             <Collapse in={item.open} timeout="auto" unmountOnExit>
                        //                 <List component="div" disablePadding>
                        //                     {
                        //                         item.databases.length > 0 ? this.renderDataBase(item) : null
                        //                     }

                        //                 </List>
                        //             </Collapse>
                        //         </div>
                        //     )
                        // }) : null
                    }
                </List>
                {
                    this.state.rightClickItem && this.state.rightClickItem.item ? <Confirm
                        title="注意！"
                        text={"请确认是否要删除" + this.state.rightClickItem.item.name}
                        open={this.state.showDialog}
                        onClose={() => { this.setState({ showDialog: false }) }}
                        onSubmit={() => this.onConfirmSubmit(this.state.rightClickItem)}
                    ></Confirm> : null
                }

            </div>
        )
    }
}



const mapStateToProps = (state: any) => {
    return {
        source: state.reduLeftBar.hosts
    }
};

const mapDispatchToProps = (dispatch: any) => ({
    initHosts: () => dispatch(initHostAction()),
    updateHost: (item: MySqlModels.IHostItem) => dispatch(updateHostAction(item)),
    closeHost: (item: MySqlModels.IHostItem) => dispatch(closeHostAction(item)),
    delHost: (item: MySqlModels.IHostItem) => dispatch(delHostAction(item))
});

export default connect(mapStateToProps, mapDispatchToProps)(LeftBar)