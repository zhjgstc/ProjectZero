import React from 'react';
import IConfig from '../../models/MySql';
import EditForm from '../EditConnection/MySql/Form';

interface IProps {
    selectDB: IConfig
}

interface IState {
    connConfig: IConfig
}

export default class Content extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            connConfig: this.props.selectDB ? this.props.selectDB : {
                id: -1,
                name: '',
                host: '',
                port: '3306',
                user: '',
                pwd: '',
                createDate: ''
            }
        }
    }
    render() {
        return (
            <div>
                <EditForm selectDB={this.state.connConfig} onConnection={() => { }}></EditForm>
            </div>
        )
    }
}