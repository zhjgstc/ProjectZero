import React from 'react';
import * as MySqlModels from '../../models/MySql';
import MySqlEvent from '../../component/content/MySql/Event/Event';
import MySqlFunction from '../../component/content/MySql/Function/Function';
import MySqlTable from '../../component/content/MySql/Table/Table';
import MySqlView from '../../component/content/MySql/View/View';
import EditForm from '../EditConnection/MySql/Form';

interface IProps {
    item: {
        host: MySqlModels.IHostItem,
        database: MySqlModels.IDatabase,
        action: string
    },
    onRefresh: any
}

interface IState {
    connected: boolean
}

export default class Content extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            connected: false
        }
    }

    renderContent = () => {
        switch (this.props.item.action) {
            case "表":
                {
                    return (
                        <MySqlTable onRefresh={() => { }} item={this.props.item}></MySqlTable>
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
                {
                    this.renderContent()
                }
            </div>
        )
    }
}