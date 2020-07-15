import React from 'react';
import * as MySqlModels from '../../models/MySql';
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
    render() {
        return (
            <div>
                {this.props.item.action}
            </div>
        )
    }
}