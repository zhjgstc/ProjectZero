import React from 'react';
import List from '@material-ui/core/List';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import StorageIcon from '@material-ui/icons/Storage';
import IConfig from '../../models/MySql';
import Icon from '@material-ui/core/Icon';
import * as DBHelper from '../../component/db-helper/MySql';
var _ = require('lodash');

interface IProps {
    source: Array<IConfig>,
    onClick?: any
}

interface openItem {
    item: IConfig,
    open: boolean,
    databases: Array<string>,
    conn?: any
}

interface IState {
    list: Array<openItem>
}

export default class LeftBar extends React.Component<IProps, IState>{
    constructor(props: any) {
        super(props);
        this.state = {
            list: new Array<openItem>()
        }
    }

    componentDidMount() {
        this.initData();
    }

    initData = () => {
        var list = this.props.source;
        if (list) {
            for (let index = 0; index < list.length; index++) {
                const element = list[index];
                this.state.list.push({
                    item: element,
                    open: false,
                    databases: new Array<string>()
                });
            }
            this.setState({ list: this.state.list });
        }
    }

    handleOnClick = (item: IConfig) => {
        if (this.props.onClick) {
            this.props.onClick(item);
        }
    }

    openConnectionClick = (item: openItem) => {
        var index = _.findIndex(this.state.list, { item: item.item });
        var model = this.state.list[index];
        if (model.open) {
            model.open = false;
            model.conn.end();
            model.conn = null;
            model.databases = new Array<string>();
            this.state.list[index] = model;
            this.setState({ list: this.state.list });
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
                            this.state.list[index].databases.push(element.Database);
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

    renderDataBase = (item: openItem) => {
        var items = [];
        for (let index = 0; index < item.databases.length; index++) {
            const element = item.databases[index];
            items.push(
                <ListItem key={index} button style={{ paddingLeft: "30px" }}>
                    <ListItemIcon>
                        <Icon className="fa fa-database" style={{ color: item.open ? "green" : "black" }} />
                    </ListItemIcon>
                    <ListItemText primary={element} />
                </ListItem>
            );
        }
        return (items);
    }

    render() {
        return (
            <div style={{ borderRightWidth: "1px", borderRightColor: "#D4D4D4" }}>
                <List>
                    {
                        this.state.list ? this.state.list.map((item: openItem, index) => {

                            return (
                                <div key={index}>
                                    <ListItem button key={index} onDoubleClick={() => this.openConnectionClick(item)} onClick={() => this.handleOnClick(item.item)}>
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
            </div>
        )
    }
}