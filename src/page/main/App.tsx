import React from 'react';
import * as utils from '../../utils/Utils';
import { Grid, AppBar, Toolbar, Button } from '@material-ui/core';
import NewConnButton from '../NewConnection/TopButton/Button';
import LeftBar from './LeftBar';
import * as MySqlModels from '../../models/MySql';
import Content from './Content';
import EditForm from '../EditConnection/MySql/Form';
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
    rightMenuHost?: MySqlModels.IHostItem,
    rightMenuAction?: string,
    changeItem?: MySqlModels.IConfig,
    changeAction?: string
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
            dbList: new Array<any>(),
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
                this.setState({ dbList: list });
            });
        }

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
        return Content;
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
                        <LeftBar></LeftBar>
                    </Grid>
                    <Grid item xs={9}>
                        <Content></Content>
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
