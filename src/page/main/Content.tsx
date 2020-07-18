import React from 'react';
import * as MySqlModels from '../../models/MySql';
import MySqlEvent from '../../component/content/MySql/Event/Event';
import MySqlFunction from '../../component/content/MySql/Function/Function';
import MySqlTable from '../../component/content/MySql/Table/Table';
import MySqlView from '../../component/content/MySql/View/View';
import MySqlPageTable from '../MySql/Table/Table';

import * as Utils from '../../utils/Utils';
import { Chip, Icon, Tooltip } from "@material-ui/core";

interface IProps {
    item: {
        host: MySqlModels.IHostItem,
        database: MySqlModels.IDatabase,
        action: string
    },
    onRefresh: any
}

interface IState {
    connected: boolean,
    chipList: Array<chipItem>,
}

interface chipItem {
    title: string
    name: string
    host: MySqlModels.IHostItem,
    database: MySqlModels.IDatabase,
    action: string,
    component: any,
    selected: boolean
}

export default class Content extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            connected: false,
            chipList: new Array<chipItem>(),
        }

    }

    componentDidMount() {
        var list = this.state.chipList;
        list.push({
            title: "对象",
            name: "",
            host: this.props.item.host,
            database: this.props.item.database,
            action: this.props.item.action,
            component: this.getMainComponent(),
            selected: true
        });
        this.setState({ chipList: list });
    }

    callBackComponent = (host: MySqlModels.IHostItem, database: MySqlModels.IDatabase, action: string, name: string) => {
        var list = this.state.chipList;
        var title = name + "@" + database.name + "(" + host.item.name + ")";
        var flag = false;
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            if (host.item.id === element.host.item.id && element.title === title) {
                flag = true;
            } else {
                list[index].selected = false;
            }
        }


        if (!flag) {
            var item: chipItem = {
                title: title,
                name: name,
                host: host,
                database: database,
                action: action,
                component: this.getComponent(host, action),
                selected: true
            };
            list.push(item);
        }
        this.setState({ chipList: list });
    }

    getComponent = (host: MySqlModels.IHostItem, action) => {
        if (action === "表") {
            return <MySqlPageTable></MySqlPageTable>
        } else {
            return null;
        }
    }

    setSelectItemOnClick = (index: number) => {
        for (let i = 0; i < this.state.chipList.length; i++) {
            this.state.chipList[i].selected = false;
        }
        this.state.chipList[index].selected = true;
        this.setState({ chipList: this.state.chipList });
    }

    deleteChipItem = (index: number) => {
        this.state.chipList.splice(index, 1);
        this.state.chipList[0].selected = true;
        this.setState({ chipList: this.state.chipList });
    }

    renderChips = () => {
        return this.state.chipList.map((item: chipItem, index: number) => {
            return (

                <Tooltip title={item.title} key={index}>
                    <Chip
                        variant={item.selected ? "default" : "outlined"}
                        color="primary"
                        style={{ width: "180px", borderRadius: "0px" }}
                        size="medium"
                        label={item.title}
                        onClick={() => this.setSelectItemOnClick(index)}
                        onDelete={item.title === "对象" ? null : () => this.deleteChipItem(index)}
                    />
                </Tooltip>
            )
        })
    }

    getMainComponent = () => {
        switch (this.props.item.action) {
            case "表":
                {
                    return (
                        <MySqlTable onRefresh={(host: MySqlModels.IHostItem, database: MySqlModels.IDatabase, action: string, name: string) => this.callBackComponent(host, database, action, name)} item={this.props.item}></MySqlTable>
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

    renderContent = () => {
        var index = Utils.Loadsh.findIndex(this.state.chipList, { selected: true });
        if (this.state.chipList[index] && this.state.chipList[index].component) {
            return this.state.chipList[index].component;
        }
    }

    render() {
        return (
            <div>
                {
                    this.renderChips()
                }

                {
                    this.renderContent()
                }
            </div>
        )
    }
}