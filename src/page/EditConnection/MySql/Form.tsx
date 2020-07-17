import React from 'react';
import moment from 'moment';
import * as utils from '../../../utils/Utils';
import * as MySqlModels from '../../../models/MySql';
import { Grid, TextField, AppBar, Toolbar, Button, Switch, Checkbox } from '@material-ui/core';
import Confirm from '../../../component/confirm/confirm';

var _ = require('lodash');
var CryptoJS = require("crypto-js");

interface IProps {
    onConnection: any,
    selectDB: MySqlModels.IConfig,
    onRefresh: { (item: MySqlModels.IConfig, action: string) }
}


interface IState {
    showDialog: boolean,
    dbConfig: MySqlModels.IConfig
}

export default class MySqlFrom extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            showDialog: false,
            dbConfig: {
                id: -1,
                name: '',
                host: '',
                port: '3306',
                user: '',
                pwd: '',
                remember: true,
                createDate: ''
            }
        }
    }

    componentDidMount() {
        var config: MySqlModels.IConfig = {
            id: this.props.selectDB.id,
            name: this.props.selectDB.name,
            host: this.props.selectDB.host,
            port: this.props.selectDB.port,
            user: this.props.selectDB.user,
            pwd: this.props.selectDB.pwd,
            remember: this.props.selectDB.remember,
            createDate: this.props.selectDB.createDate
        }

        if (config.pwd) {
            var bytes = CryptoJS.AES.decrypt(config.pwd, utils.CryptoKey);
            config.pwd = bytes.toString(CryptoJS.enc.Utf8);
        }

        this.setState({ dbConfig: config });

    }

    onSubmit_Click = () => {
        var connConfig = this.state.dbConfig;
        connConfig.createDate = moment(new Date()).format("yyyy-MM-DD hh:mm:ss");
        if (connConfig.pwd) {
            connConfig.pwd = CryptoJS.AES.encrypt(connConfig.pwd, utils.CryptoKey).toString();
        }

        if (!connConfig.host) {
            connConfig.host = "localhost";
        }
        if (!connConfig.port) {
            connConfig.port = "3306";
        }
        if (!connConfig.name) {
            connConfig.name = connConfig.host + "_" + connConfig.port;
        }

        const store = new utils.Store();
        var list = store.get(utils.DBListKey);
        var index = _.findIndex(list, { id: connConfig.id });
        console.log(index);
        if (index != -1) {
            list[index] = connConfig;
        }
        store.set(utils.DBListKey, list);

        this.props.onRefresh(connConfig, "update");
    }

    handleChange = (event: any) => {
        var config = this.state.dbConfig;
        config.remember = event.target.checked;
        this.setState({ dbConfig: config });
    }

    onConfirmSubmit = () => {
        this.setState({ showDialog: false });
        const store = new utils.Store();
        var list = store.get(utils.DBListKey);
        if (list) {
            var index = list.findIndex((item: MySqlModels.IConfig) => item.id === this.props.selectDB.id);
            var item = list[index];
            list.splice(index, 1)
            console.log(list);
            store.set(utils.DBListKey, list);
            this.props.onRefresh(item, "delete");
        }
    }

    onConnection_Click = () => {
        console.log(this.props.selectDB);
        var conn = utils.MySql.createConnection({
            host: this.props.selectDB.host,
            user: this.props.selectDB.user,
            password: this.props.selectDB.pwd,
            port: this.props.selectDB.port,
            multipleStatements: true
        })
        conn.connect((error: any) => {
            if (error) {
                console.log(error);
                alert('无法连接数据库');
            } else {
                alert('连接成功');
                setTimeout(() => {
                    conn.end();
                }, 2000);
            }
            console.log(conn);
        });
    }

    render() {
        return (
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
            >
                <div style={{ paddingTop: "20px" }}>
                    <TextField
                        id="standard-basic"
                        label="连接名"
                        value={this.state.dbConfig.name}
                        onChange={(e) => {
                            var config = this.state.dbConfig;
                            config.name = e.target.value;
                            this.setState({ dbConfig: config });
                        }} />
                </div>

                <div style={{ paddingTop: "10px" }}>
                    <TextField
                        id="standard-basic"
                        label="主机"
                        value={this.state.dbConfig.host}
                        onChange={(e) => {
                            var config = this.state.dbConfig;
                            config.host = e.target.value;
                            this.setState({ dbConfig: config });
                        }} />
                </div>

                <div style={{ paddingTop: "10px" }}>
                    <TextField
                        id="standard-basic"
                        label="端口"
                        value={this.state.dbConfig.port}
                        onChange={(e) => {
                            var config = this.state.dbConfig;
                            config.port = e.target.value;
                            this.setState({ dbConfig: config });
                        }} />
                </div>

                <div style={{ paddingTop: "10px" }}>
                    <TextField
                        id="standard-basic"
                        label="用户名"
                        value={this.state.dbConfig.user}
                        onChange={(e) => {
                            var config = this.state.dbConfig;
                            config.user = e.target.value;
                            this.setState({ dbConfig: config });
                        }} />
                </div>

                <div style={{ paddingTop: "10px" }}>

                    <TextField
                        id="standard-basic"
                        label="密码"
                        type="password"
                        value={this.state.dbConfig.pwd}
                        onChange={(e) => {
                            var config = this.state.dbConfig;
                            config.pwd = e.target.value;
                            this.setState({ dbConfig: config });
                        }} />
                </div>
                <div style={{ paddingTop: "10px" }}>
                    <input type="CheckBox" checked={this.state.dbConfig.remember} onChange={(event: any) => this.handleChange(event)} />保存密码
                </div>

                <br />
                <AppBar style={{
                    backgroundColor: "transparent",
                    top: 'auto',
                    bottom: 0,
                    position: "relative"
                }}>
                    <Toolbar>
                        <Grid
                            container
                            direction="row">
                            <Grid item xs={8}>
                                <Button color="primary" variant="contained" onClick={() => this.onConnection_Click()}>连接数据库</Button>
                            </Grid>
                            <Grid item xs={2}>
                                <Button color="primary" variant="contained" onClick={() => this.onSubmit_Click()}>保存</Button>
                            </Grid>
                            <Grid item xs={2}>
                                <Button color="primary" variant="contained" onClick={() => { this.setState({ showDialog: true }) }}>删除</Button>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
                <Confirm
                    title="注意！"
                    text={"请确认是否要删除" + this.props.selectDB.name}
                    open={this.state.showDialog}
                    onClose={() => { this.setState({ showDialog: false }) }}
                    onSubmit={() => this.onConfirmSubmit()}
                ></Confirm>
            </Grid>
        )
    }
}