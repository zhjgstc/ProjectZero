import React from 'react';
import { connect } from 'react-redux';
import * as MySqlModels from '../../models/MySql';
import MySqlPageTable from '../MySql/Table/Table';
import MysqlQuery from '../MySql/Query/Query';
import { ISelectItem, IChipItem, setChipSelectItemAction, delChipItemAction } from '../../actions/Main/ContentAction';
import * as Utils from '../../utils/Utils';
import { Chip, Icon, Tooltip } from "@material-ui/core";
import MySqlEvent from '../../component/content/MySql/Event/Event';
import MySqlFunction from '../../component/content/MySql/Function/Function';
import MySqlTable from '../../component/content/MySql/Table/Table';
import MySqlView from '../../component/content/MySql/View/View';

interface IProps {
    item: ISelectItem,
    chipList: Array<IChipItem>,
    setChipSelect: { (index: number) },
    delChipItem: { (index: number) }
}

interface IState {
    connected: boolean,
}


class Content extends React.Component<IProps, IState> {
    componentDidMount() {
    }

    componentWillReceiveProps(nextProps: IProps) {
    }

    callBackComponent = (host: MySqlModels.IHostItem, database: MySqlModels.IDatabase, action: string, name: string) => {
        var list = this.props.chipList;
        var title = name + "@" + database.name + "(" + host.item.name + ")";
        var flag = false;
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            if (host === element.host && element.title === title) {
                flag = true;
                list[index].selected = true;
            } else {
                list[index].selected = false;
            }
        }


        if (!flag) {
            var item: IChipItem = {
                title: title,
                name: name,
                host: host,
                database: database,
                action: action,
                component: this.getComponent(host, database, name, action),
                selected: true
            };
            list.push(item);
        }
        //this.setState({ chipList: list });
    }

    getComponent = (host: MySqlModels.IHostItem, database: MySqlModels.IDatabase, name: string, action: string) => {
        if (action === "表") {
            return <MySqlPageTable host={host} database={database} name={name} action={action}></MySqlPageTable>
        }
        else if (action === "查询") {

        }
        else {
            return null;
        }
    }

    setSelectItemOnClick = (index: number) => {
        this.props.setChipSelect(index);
    }

    deleteChipItem = (index: number) => {
        this.props.delChipItem(index);
    }

    renderChips = () => {

        return this.props.chipList.map((item: IChipItem, index: number) => {
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



    render() {
        return (
            <div>
                {
                    this.renderChips()
                }

                {
                    this.props.chipList.map((item: IChipItem, index: number) => {
                        return (
                            <div id={item.title + "_" + index} key={index} style={{ display: item.selected ? "block" : "none" }}>
                                {
                                    item.component
                                }
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}


const mapStateToProps = (state: any) => {
    return {
        item: state.reduContent.selectItem,
        chipList: state.reduContent.chipList
    }
};

const mapDispatchToProps = (dispatch: any) => ({
    setChipSelect: (index: number) => dispatch(setChipSelectItemAction(index)),
    delChipItem: (index: number) => dispatch(delChipItemAction(index))
});

export default connect(mapStateToProps, mapDispatchToProps)(Content)