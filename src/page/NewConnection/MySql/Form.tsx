import React from 'react';
import moment from 'moment';
import * as utils from '../../../utils/Utils';
import { Grid, TextField, AppBar, Toolbar, Button } from '@material-ui/core';

var _ = require('lodash');
var CryptoJS = require("crypto-js");
const mysql = window.require('mysql');


interface IConfig {
    id: number,
    name: string,
    host: string,
    port: string,
    user: string,
    pwd: string,
    createDate: string
}

interface IState {
    connConfig: IConfig,
}

interface IProps {
    onCancel: any,
    onSubmit?: any
}



export default class MySqlFrom extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            connConfig: {
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

    componentDidMount() {
    }

    onCancel_Click = () => {
        if (this.props.onCancel) {
            this.props.onCancel();
        }
    }
    onSubmit_Click = () => {
        var connConfig = this.state.connConfig;
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
        if (!store.has(utils.DBListKey)) {
            connConfig.id = 0;
            store.set(utils.DBListKey, [connConfig]);
        } else {
            var list = store.get(utils.DBListKey);
            console.log(list);
            if (!_.find(list, { id: connConfig.id })) {
                connConfig.id = list.length;
                list.push(connConfig);
            } else {

            }

            store.set(utils.DBListKey, list);
        }

        if (this.props.onSubmit) {
            this.props.onSubmit(true);
        }
    }

    onTestConnection_Click = () => {
        console.log(this.state.connConfig);
        var conn = mysql.createConnection({
            host: this.state.connConfig.host,
            user: this.state.connConfig.user,
            password: this.state.connConfig.pwd,
            port: this.state.connConfig.port,
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
                    <TextField id="standard-basic" label="连接名" value={this.state.connConfig.name} onChange={(e) => { var connConfig = this.state.connConfig; connConfig.name = e.target.value; this.setState({ connConfig: connConfig }) }} />
                </div>

                <div style={{ paddingTop: "10px" }}>
                    <TextField id="standard-basic" label="主机" value={this.state.connConfig.host} onChange={(e) => { var connConfig = this.state.connConfig; connConfig.host = e.target.value; this.setState({ connConfig: connConfig }) }} />
                </div>

                <div style={{ paddingTop: "10px" }}>
                    <TextField id="standard-basic" label="端口" value={this.state.connConfig.port} onChange={(e) => { var connConfig = this.state.connConfig; connConfig.port = e.target.value; this.setState({ connConfig: connConfig }) }} />
                </div>

                <div style={{ paddingTop: "10px" }}>
                    <TextField id="standard-basic" label="用户名" value={this.state.connConfig.user} onChange={(e) => { var connConfig = this.state.connConfig; connConfig.user = e.target.value; this.setState({ connConfig: connConfig }) }} />
                </div>

                <div style={{ paddingTop: "10px" }}>
                    <TextField id="standard-basic" label="密码" value={this.state.connConfig.pwd} onChange={(e) => { var connConfig = this.state.connConfig; connConfig.pwd = e.target.value; this.setState({ connConfig: connConfig }) }} />
                </div>

                <br />
                <AppBar style={{
                    backgroundColor: "transparent",
                    top: 'auto',
                    bottom: 0,
                }}>
                    <Toolbar>
                        <Grid
                            container
                            direction="row">
                            <Grid item xs={8}>
                                <Button color="primary" variant="contained" onClick={() => this.onTestConnection_Click()}>测试连接</Button>
                            </Grid>
                            <Grid item xs={2}>
                                <Button color="primary" variant="contained" onClick={() => this.onSubmit_Click()}>保存</Button>
                            </Grid>
                            <Grid item xs={2}>
                                <Button color="primary" variant="contained" onClick={() => this.onCancel_Click()}>取消</Button>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>

            </Grid>
        )
    }
}