import React from 'react';
import IConfig from '../../models/MySql';
import EditForm from '../EditConnection/MySql/Form';

interface IProps {
    selectDB: IConfig,
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
                {
                    this.state.connected ?
                        null
                        :
                        null
                }

            </div>
        )
    }
}