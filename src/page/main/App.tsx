import React from 'react';

import * as utils from '../../utils/Utils';
import { Grid, AppBar, Toolbar, Tabs, Tab } from '@material-ui/core';
import NewConnButton from '../NewConnection/TopButton/Button';
import LeftBar from './LeftBar';
import IConfig from '../../models/MySql';
import Content from './Content';
import EditForm from '../EditConnection/MySql/Form';

var _ = require('lodash');


var conn: any;

interface DBCcnfigItem {
    item: IConfig,
    opened: boolean,
    component: any
}

interface IState {
    text: string,
    sql: string,
    fields: Array<any>,
    results: Array<any>,
    showNewConnForm: boolean,
    dbList: Array<any>,
    selectItem: number
}

var conntedList: Array<DBCcnfigItem>;

export default class App extends React.Component<{}, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            text: "",
            sql: "show databases;show databases;",
            fields: new Array<any>(),
            results: new Array<any>(),
            showNewConnForm: false,
            dbList: new Array<any>(),
            selectItem: -1
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
        var items = new Array<DBCcnfigItem>();
        list.forEach((element: IConfig, index: number) => {
            console.log(element);
            console.log(index);
            items.push({ item: element, opened: false, component: <EditForm onConnection={() => { }} onRefresh={() => { this.initData() }} key={index} selectDB={element}></EditForm> })
        });
        conntedList = items;
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

    handleLeftBarOnClick = (item: IConfig) => {
        console.log(item);
        this.setState({ selectItem: item.id });
    }

    renderContent = () => {
        if (this.state.selectItem < 0) {
            return null;
        }
        if (conntedList) {
            for (let index = 0; index < conntedList.length; index++) {
                const element = conntedList[index];
                if (this.state.selectItem == element.item.id) {
                    return element.component;
                }
            }
        }
    }

    render() {
        return (
            <div>
                <AppBar style={{ backgroundColor: '#D9D9D9', position: "relative" }}>
                    <Toolbar>
                        <NewConnButton dialogClose={(value?: boolean) => { if (value) { this.initData() } }}></NewConnButton>
                    </Toolbar>
                </AppBar>

                <Grid container spacing={3} style={{ paddingTop: "10px" }}>
                    <Grid item xs={3}>
                        {
                            this.state.dbList.length > 0 ?
                                <LeftBar source={this.state.dbList} onClick={(item: IConfig) => this.handleLeftBarOnClick(item)}></LeftBar>
                                : null
                        }

                    </Grid>
                    <Grid item xs={9}>
                        {
                            this.renderContent()
                        }
                        {/* {
                            this.state.conntedList && this.state.selectItem > 0 ? this.state.conntedList.map((item, index) => {
                                if (item.item.id == this.state.selectItem) {
                                    return item.component;
                                }
                            }) : null
                        } */}

                        {/* <textarea rows={5} value={this.state.sql}
                            onChange={this.handleTextareaChange.bind(this)}>
                        </textarea>
                        <button onClick={() => this.querySql()}>执行sql</button>

                        {
                            this.state.fields && this.state.fields.length > 0 ? this.renderTables(this.state.fields, this.state.results) :
                                this.state.text
                        } */}


                    </Grid>
                </Grid>
            </div>
        );
    }
}
