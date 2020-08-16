import React from 'react';
import * as MySqlModels from '../../../models/MySql';
import Result from '../../../component/data-result/Result';
import * as utils from '../../../utils/Utils';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/idea.css';
require('codemirror/mode/sql/sql');
interface IProps {
    host: MySqlModels.IHostItem
}

interface IState {
    fields: Array<any>,
    results: Array<any>,
    sql: string,
    text: string
}

export default class MySqlQuery extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            fields: new Array<any>(),
            results: new Array<any>(),
            sql: "",
            text: ""
        }

    }

    //设置textareaValue
    handleTextareaChange(e: any) {
        this.setState({
            sql: e.target.value
        })
    }

    querySql = () => {
        this.setState({
            fields: new Array<string>(),
            text: ""
        });
        this.props.host.conn.query(this.state.sql, (error: any, results: any, fields: any) => {
            if (error) {
                console.log(error);
                this.setState({
                    text: error.message
                });
            } else {
                console.log(results);
                console.log(fields);
                this.setState({
                    fields: utils.Loadsh.clone(fields),
                    results: utils.Loadsh.clone(results)
                });
            }
        });
    }

    render() {
        return (
            <div>
                <br />
                <button onClick={() => {
                    this.querySql()
                }}>执行sql</button>
                <br />

                <CodeMirror
                    value={this.state.sql}
                    options={{
                        mode: 'sql',
                        theme: 'idea',
                        lineNumbers: true
                    }}
                    onBeforeChange={(editor, data, value) => {
                        this.setState({ sql: value });
                    }}
                    onChange={(editor, value) => {
                        console.log('controlled', { value });
                    }}
                />
                <br />
                <Result
                    fields={this.state.fields}
                    results={this.state.results}
                    text={this.state.text}
                ></Result>

            </div>
        )
    }
}