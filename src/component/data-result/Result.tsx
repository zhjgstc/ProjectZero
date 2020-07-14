import React from 'react';
import moment from 'moment';

interface IProps {
    fields: any,
    results: any,
    text: string
}
export default class Result extends React.Component<IProps, {}> {
    constructor(props: any) {
        super(props);
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
                {
                    this.props.fields && this.props.fields.length > 0 ? this.renderTables(this.props.fields, this.props.results) :
                        this.props.text
                }
            </div>
        )
    }
}