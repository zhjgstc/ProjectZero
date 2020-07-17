import React from 'react';

import * as utils from '../../utils/Utils';
import { Grid, AppBar, Toolbar, Tabs, Tab } from '@material-ui/core';
import NewConnButton from '../NewConnection/TopButton/Button';
import LeftBar from './LeftBar';
import * as MySqlModels from '../../models/MySql';
import Content from './Content';
import EditForm from '../EditConnection/MySql/Form';

var conn: any;

interface DBCcnfigItem {
    item: MySqlModels.IConfig,
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
    selectItem?: {
        host: MySqlModels.IHostItem,
        database: MySqlModels.IDatabase,
        action: string
    },
    changeItem?: MySqlModels.IConfig,
    changeAction?: string
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

    // openConnection = () => {
    //     conn = utils.MySql.createConnection({
    //         host: 'localhost',
    //         user: 'root',
    //         password: 'root',
    //         port: '33061',
    //         multipleStatements: true
    //     })

    //     conn.connect((error: any) => {
    //         console.log(error);
    //         if (error) {
    //             this.setState({ text: this.state.text + "无法连接数据库" });
    //         } else {
    //             this.setState({ text: this.state.text + "打开数据库" });
    //         }
    //     });
    //     console.log(conn);
    // }

    componentDidCatch(error: any, info: any) {
        console.log(error);
        console.log(info);
        this.setState({ text: "无法连接数据库" });
    }
    initData = (item?: MySqlModels.IConfig, action?: string) => {
        const store = new utils.Store();
        if (item && action) {
            this.setState({ changeItem: item, changeAction: action });
        } else {
            //这里需要修改为push只是新增就好。
            this.setState({ dbList: new Array<any>() }, () => {
                var list = store.get(utils.DBListKey);
                list = utils.Loadsh.orderBy(list, ['id'], ['desc']);
                var items = new Array<DBCcnfigItem>();
                list.forEach((element: MySqlModels.IConfig, index: number) => {
                    console.log(element);
                    console.log(index);
                    items.push({ item: element, opened: false, component: <EditForm onConnection={() => { }} onRefresh={(item: MySqlModels.IConfig, action: string) => this.initData(item, action)} key={index} selectDB={element}></EditForm> })
                });
                conntedList = items;
                this.setState({ dbList: list });
            });
        }

    }


    /**
     * 主要是获取当前选择的数据项
     * @param item 传递回来的当前选择项
     */
    handleLeftBarOnClick = (item: MySqlModels.IConfig) => {
        //console.log(item);
        //this.setState({ selectItem: item.id });

    }

    /**
     * 当前选择的数据库
     * @param model 主机信息
     * @param database 数据库信息
     * @param action 当前的动作（表，视图，函数，事件这类的
     */
    handleLeftBarOnSelected = (host: MySqlModels.IHostItem, database: MySqlModels.IDatabase, action: string) => {
        this.setState({
            selectItem: {
                host: host,
                database: database,
                action: action
            }
        });
    }

    renderContent = () => {
        if (this.state.selectItem) {
            return (
                <Content onRefresh={() => { }} item={this.state.selectItem}></Content>
            )
        }
        // if (this.state.selectItem < 0) {
        //     return null;
        // }
        // if (conntedList) {
        //     for (let index = 0; index < conntedList.length; index++) {
        //         const element = conntedList[index];
        //         if (this.state.selectItem == element.item.id) {
        //             return element.component;
        //         }
        //     }
        // }
    }

    render() {
        return (
            <div>
                <AppBar style={{ backgroundColor: '#D9D9D9', position: "relative" }}>
                    <Toolbar>
                        <NewConnButton onRefresh={(item: MySqlModels.IConfig, action: string) => { this.initData(item, action) }} dialogClose={(value?: boolean) => { }}></NewConnButton>
                    </Toolbar>
                </AppBar>

                <Grid container spacing={3} style={{ paddingTop: "10px" }}>
                    <Grid item xs={3}>
                        {
                            this.state.dbList.length > 0 ?
                                <LeftBar
                                    changeItem={this.state.changeItem}
                                    changeAction={this.state.changeAction}
                                    source={this.state.dbList}
                                    onSelectDataBase={(model: MySqlModels.IHostItem, database: MySqlModels.IDatabase, action: string) => this.handleLeftBarOnSelected(model, database, action)}
                                    onClick={(item: MySqlModels.IConfig) => this.handleLeftBarOnClick(item)}
                                    onRefresh={(item: MySqlModels.IConfig, action: string) => { this.initData(item, action) }}
                                ></LeftBar>
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
