import React from 'react';
import moment from 'moment';
import * as utils from '../../utils/Utils';
import { Container, Grid, AppBar, Toolbar } from '@material-ui/core';
import NewConnButton from '../NewConnection/TopButton/Button';
import LeftBar from './LeftBar';
var _ = require('lodash');


var conn: any;
interface IState {
    text: string,
    sql: string,
    fields: Array<any>,
    results: Array<any>,
    showNewConnForm: boolean,
    dbList: Array<any>
}

export default class App extends React.Component<{}, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            text: "",
            sql: "show databases;show databases;",
            fields: new Array<any>(),
            results: new Array<any>(),
            showNewConnForm: false,
            dbList: new Array<any>()
        }
    }
    componentDidMount() {
        this.initData();
    }

    //设置textareaValue
    handleTextareaChange(e: any) {
        this.setState({
            sql: e.target.value
        })
    }
    openConnection = () => {
        conn = utils.MySql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            port: '33061',
            multipleStatements: true
        })

        conn.connect((error: any) => {
            console.log(error);
            if (error) {
                this.setState({ text: this.state.text + "无法连接数据库" });
            } else {
                this.setState({ text: this.state.text + "打开数据库" });
            }
        });
        console.log(conn);
    }
    componentDidCatch(error: any, info: any) {
        console.log(error);
        console.log(info);
        this.setState({ text: "无法连接数据库" });
    }
    initData = () => {
        const store = new utils.Store();
        var list = store.get(utils.DBListKey);
        list = _.orderBy(list, ['id'], ['desc']);

        this.setState({ dbList: list });
    }

    querySql = () => {
        this.setState({
            fields: new Array<string>(),
            text: ""
        });

        conn.query(this.state.sql, (error: any, results: any, fields: any) => {
            if (error) {
                console.log(error);
                this.setState({
                    text: error.message
                });
            } else {
                console.log(results);
                console.log(fields);
                this.setState({
                    fields: fields,
                    results: results
                });
            }
            this.setState(this.state);
        });
    }
    renderTable = (col: Array<any>, list: Array<any>) => {
        try {
            return (
                <table>
                    <thead>
                        <tr>
                            {
                                col.map((item, index) => {
                                    return (
                                        <td key={index}>{item["name"]}</td>
                                    )
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            list.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        {
                                            col.map((colItem, colIndex) => {
                                                var value = "";
                                                if (colItem["type"] === 12) {
                                                    value = moment(item[colItem]).format("yyyy-MM-DD HH:mm:ss");
                                                } else {
                                                    value = item[colItem.name];
                                                }
                                                return (
                                                    <td key={colIndex}>{value}</td>
                                                )
                                            })
                                        }
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            )
        } catch{
            this.setState({
                fields: new Array<string>(),
                results: new Array<any>()
            })
            return null;
        }

    }

    renderTables = (col: Array<any>, list: Array<any>) => {
        var tables = [];
        if (col.length === 1) {
            if (col) {
                tables.push(this.renderTable(col, list));
            } else {
                this.setState({ text: "执行成功" });
            }
        } else {
            for (let index = 0; index < col.length; index++) {
                tables.push(
                    <div key={index}>
                        <p>结果{index + 1}</p>
                        {
                            col[index] ?
                                this.renderTable(col[index], list[index]) :
                                "执行成功，影响行数：" + list[index].affectedRows
                        }
                    </div>
                );
            }
        }
        return tables;
    }

    render() {
        return (
            <div>
                <AppBar style={{ backgroundColor: 'lightgrey', position: "relative" }}>
                    <Toolbar>
                        <NewConnButton dialogClose={(value?: boolean) => { if (value) { this.initData() } }}></NewConnButton>
                    </Toolbar>
                </AppBar>

                <Grid container spacing={3} style={{ paddingTop: "10px" }}>
                    <Grid item xs={3}>
                        <LeftBar source={this.state.dbList}></LeftBar>
                    </Grid>
                    <Grid item xs={9}>
                        <Grid>
                            <textarea rows={5} value={this.state.sql}
                                onChange={this.handleTextareaChange.bind(this)}>
                            </textarea>
                            <button onClick={() => this.querySql()}>执行sql</button>

                            {
                                this.state.fields && this.state.fields.length > 0 ? this.renderTables(this.state.fields, this.state.results) :
                                    this.state.text
                            }

                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        {
                            this.state.dbList ? this.state.dbList.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <button>{item.name}</button>
                                        <br />
                                    </div>
                                )
                            }) : null
                        }
                    </Grid>
                    <Grid item xs={6}>
                        <textarea rows={5} value={this.state.sql}
                            onChange={this.handleTextareaChange.bind(this)}>
                        </textarea>
                        <button onClick={() => this.querySql()}>执行sql</button>
                    </Grid>
                    <Grid item xs={12}>
                        {
                            this.state.fields && this.state.fields.length > 0 ? this.renderTables(this.state.fields, this.state.results) :
                                this.state.text
                        }
                    </Grid>
                </Grid>
            </div>
        );
    }
}
