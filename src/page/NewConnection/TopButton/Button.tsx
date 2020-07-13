import React from 'react';
import { Button, Menu, MenuItem, Dialog, Slide, AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { TransitionProps } from '@material-ui/core/transitions';
import MySqlForm from '../MySql/Form';

interface IProps {
    dialogClose: any
}

interface IState {
    anchorEl?: HTMLButtonElement,
    show: boolean,
    open: boolean,
    dialogTitle: string,
    dialogContent?: any,
    DBList?: Array<any>
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default class NewConnectionButton extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            show: false,
            open: false,
            dialogTitle: "",
            DBList: [
                { key: 0, name: "MySQL", component: <MySqlForm onSubmit={(value?: boolean) => { this.handleDialogClose(value) }} onCancel={() => { this.handleDialogClose() }}></MySqlForm> },
                { key: 1, name: "PostgreSQL", component: null },
                { key: 2, name: "Oracle", component: null },
                { key: 3, name: "SQLite", component: null },
                { key: 4, name: "SQL Server", component: null },
            ]
        }
    }

    componentDidMount() {

    }

    handleClick = (event: any) => {
        this.setState({ show: true, anchorEl: event.currentTarget });
    }

    handleClose = (item: any) => {
        if (item) {
            this.handleDialogOpen();
            this.setState({ dialogTitle: "新建连接—" + item.name, dialogContent: item.component });
        }
        this.setState({ show: false, anchorEl: undefined });
    }

    handleDialogClose = (value?: boolean) => {
        this.setState({ open: false });
        if (this.props.dialogClose) {
            this.props.dialogClose(value);
        }

    }

    handleDialogOpen = () => {
        this.setState({ open: true });
    }

    render() {
        return (
            <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                <Button aria-controls="simple-menu" aria-haspopup="true" color="primary" variant="contained" onClick={(event: any) => this.handleClick(event)}>新建连接</Button>
                <Menu
                    id="simple-menu"
                    keepMounted
                    anchorEl={this.state.anchorEl}
                    open={this.state.show}
                    onClose={() => this.handleClose(null)}
                >
                    {
                        this.state.DBList ? this.state.DBList.map((item, index) => {
                            return (
                                <MenuItem key={index} onClick={() => this.handleClose(item)}>{item.name}</MenuItem>
                            )
                        }) : null
                    }
                </Menu>
                <Dialog fullScreen open={this.state.open} onClose={() => this.handleDialogClose()} TransitionComponent={Transition}>
                    <AppBar style={{ position: "relative" }}>
                        <Toolbar>
                            <IconButton edge="start" color="inherit" onClick={() => this.handleDialogClose()} aria-label="close">
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="h6">
                                {this.state.dialogTitle}
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    {
                        this.state.dialogContent
                    }
                </Dialog>
            </div >
        )
    }
}