import React from 'react';
import * as MySqlModels from '../../../models/MySql';
import * as DBHelper from '../../../component/db-helper/MySql';
import moment from "moment";
import DataResultTable from '../../../component/data-result/Table';

interface IProps {
    host: MySqlModels.IHostItem,
    database: MySqlModels.IDatabase,
    name: string,
    action: string
}

interface IState {
    host: MySqlModels.IHostItem,
    database: MySqlModels.IDatabase,
    name: string,
    action: string,
    orderBy: string,
    selectRow?: {
        item: MySqlModels.ITableInfo,
        index: number
    },
    fields: any,
    results: any,
}

export default class TableResult extends React.Component<IProps, IState>{
    constructor(props: IProps) {
        super(props);
        this.state = {
            host: this.props.host,
            database: this.props.database,
            name: this.props.name,
            action: this.props.action,
            orderBy: '',
            fields: null,
            results: null
        }
    }

    componentDidMount() {
        this.initData();
    }

    initData = () => {
        console.log(this.state.name);
        var sql = "select * from " + this.state.database.name + "." + this.state.name + " limit 1000";

        sql += " ";
        DBHelper.querySql(this.state.host.conn, sql, (error: any, results: any, fields: any) => {
            if (error) {
                console.log(error.message);
                return;
            }
            if (fields && results) {
                console.log(results);
                this.setState({ fields: fields, results: results });
            }
        });
    }



    render() {
        return (
            <div>
                {
                    this.state.fields && this.state.results ?
                        <DataResultTable
                            fields={this.state.fields}
                            results={this.state.results}
                            text="">
                        </DataResultTable> : null
                }
            </div>
        )
    }
}