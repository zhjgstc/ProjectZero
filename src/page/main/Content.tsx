import React from 'react';
import * as MySqlModels from '../../models/MySql';
import MySqlEvent from '../../component/content/MySql/Event/Event';
import MySqlFunction from '../../component/content/MySql/Function/Function';
import MySqlTable from '../../component/content/MySql/Table/Table';
import MySqlView from '../../component/content/MySql/View/View';
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
    selectItem: {
        title: string,
        item?: chipItem
    }
}

interface chipItem {
    title: string
    name: string
    host: MySqlModels.IHostItem,
    database: MySqlModels.IDatabase,
    action: string
}

export default class Content extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            connected: false,
            chipList: new Array<chipItem>(),
            selectItem: {
                title: "对象"
            }
        }
    }

    componentDidMount() {

    }

    callBackComponent = (host: MySqlModels.IHostItem, database: MySqlModels.IDatabase, action: string, name: string) => {
        var list = this.state.chipList;
        var selectItem = this.state.selectItem;
        var title = name + "@" + database.name + "(" + host.item.name + ")";
        var flag = false;
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            if (host.item.id === element.host.item.id && element.title === title) {
                flag = true;
                selectItem.title = title;
            } else {
            }
        }


        if (!flag) {
            var item: chipItem = {
                title: title,
                name: name,
                host: host,
                database: database,
                action: action
            };
            list.push(item);
            selectItem.title = title;
        }
        this.setState({ chipList: list, selectItem: selectItem });
    }

    renderChips = () => {
        return this.state.chipList.map((item: chipItem, index: number) => {
            return (
                <Tooltip title={item.title} key={index}>
                    <Chip
                        variant={this.state.selectItem.title === item.title ? "default" : "outlined"}
                        color="primary"
                        style={{ width: "180px", borderRadius: "0px" }}
                        size="medium"
                        label={item.title}
                        onClick={() => {
                            var selectItem = this.state.selectItem;
                            selectItem.title = item.title;
                            this.setState({ selectItem: selectItem });
                        }}
                        onDelete={() => {
                            var list = this.state.chipList;
                            list.splice(index, 1);
                            var selectItem = this.state.selectItem;
                            selectItem.title = "对象";
                            selectItem.item = undefined;
                            this.setState({ selectItem: selectItem, chipList: list });
                        }}
                    />
                </Tooltip>
            )
        })
    }

    renderContent = () => {
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

    render() {
        return (
            <div>
                <Chip
                    variant={this.state.selectItem.title === "对象" ? "default" : "outlined"}
                    color="primary"
                    style={{ width: "180px", borderRadius: "0px" }}
                    size="medium"
                    label="对象"
                    onClick={() => {
                        var selectItem = this.state.selectItem;
                        selectItem.title = "对象";
                        selectItem.item = undefined;
                        this.setState({ selectItem: selectItem });
                    }}
                />
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