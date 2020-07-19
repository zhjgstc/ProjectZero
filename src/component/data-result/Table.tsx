import React from 'react';
import moment from 'moment';
import { Table, TableHead, TableRow, TableCell, TableBody, TableSortLabel } from '@material-ui/core';


interface IHeadCell {
    disablePadding: boolean;
    id: string;
    label: string;
    numeric: boolean;
}

interface IProps {
    fields: any,
    results: any,
    text: string
}
interface IState {
    headerCells: Array<IHeadCell>,
    fields: any,
    results: any
}
export default class Result extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            headerCells: new Array<IHeadCell>(),
            fields: null,
            results: null
        }
    }

    componentDidMount() {
        this.initData();
    }

    initData = () => {
        var headerCells = new Array<IHeadCell>();
        for (let index = 0; index < this.props.fields.length; index++) {
            const element = this.props.fields[index];
            headerCells.push({
                id: element["name"], numeric: false, disablePadding: true, label: element["name"]
            });
        }
        this.setState({ headerCells: headerCells, fields: this.props.fields, results: this.props.results });
    }

    renderTable = () => {
        try {
            return (
                <Table>
                    <TableHead>
                        <TableRow>
                            {
                                this.state.headerCells.map((item: IHeadCell, index: number) => {
                                    return (
                                        <TableCell key={index}>
                                            <TableSortLabel>{item.label}</TableSortLabel>
                                        </TableCell>
                                    )
                                })
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            this.state.results.map((item, index) => {
                                return (
                                    <TableRow key={index}>
                                        {
                                            this.state.fields.map((colItem, colIndex) => {
                                                var value = "";
                                                if (colItem["type"] === 12) {
                                                    value = moment(item[colItem]).format("yyyy-MM-DD HH:mm:ss");
                                                } else {
                                                    value = item[colItem.name];
                                                }
                                                return (
                                                    <TableCell key={colIndex}>{value}</TableCell>
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
        } catch{
            return null;
        }

    }

    render() {
        return (
            <div>
                {
                    this.state.fields && this.state.results ? this.renderTable() : null
                }
            </div>
        )
    }
}