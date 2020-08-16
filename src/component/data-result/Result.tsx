import React from 'react';
import moment from 'moment';
import { Icon, Tooltip, IconButton, Button, Table, TableHead, TableRow, TableCell, TableBody, TableSortLabel } from '@material-ui/core';

interface IProps {
    fields: any,
    results: any,
    text: string
}
export default class Result extends React.Component<IProps, {}> {
    constructor(props: any) {
        super(props);
    }

    renderTable = (col: Array<any>, list: Array<any>, tableIndex: number) => {
        return (
            <Table key={tableIndex}>
                <TableHead>
                    <TableRow>
                        {
                            col.map((item, index) => {
                                return (
                                    <TableCell key={index}>{item["name"]}</TableCell>
                                )
                            })
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        list.map((item, index) => {
                            return (
                                <TableRow key={index}>
                                    {
                                        col.map((colItem, colIndex) => {
                                            var value = "";
                                            if (colItem["type"] === 12) {
                                                value = moment(item[colItem]).format("yyyy-MM-DD HH:mm:ss");
                                            } else {
                                                value = item[colItem.name];
                                            }
                                            return (
                                                <TableCell key={colIndex}>
                                                    <input type="text" value={value}/>
                                                </TableCell>
                                            )
                                        })
                                    }
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>
        )
    }

    renderTables = (col: Array<any>, list: Array<any>) => {
        var tables = [];

        if (!col) {
            return <div>执行成功</div>
        }

        var arrayCount = 0;
        for (let index = 0; index < col.length; index++) {
            if (Array.isArray(col[index])) {
                arrayCount++;
            }
        }

        if (arrayCount == 0) {
            tables.push(this.renderTable(col, list, 0));
        } else {

            for (let index = 0; index < col.length; index++) {
                tables.push(
                    <div key={index}>
                        <p>结果{index + 1}</p>
                        {
                            col[index] ?
                                this.renderTable(col[index], list[index], index) :
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
                    this.renderTables(this.props.fields, this.props.results)
                }
                {/* {
                    this.props.fields && this.props.fields.length > 0 ? this.renderTables(this.props.fields, this.props.results) :
                        this.props.text
                } */}
            </div>
        )
    }
}