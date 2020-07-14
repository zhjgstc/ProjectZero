import React from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';

interface IProps {
    title: string,
    text: string,
    open: boolean,
    onClose: any,
    onSubmit: any
}


export default class Confirm extends React.Component<IProps, {}>{


    handlerOnSubmit = () => {
        this.props.onSubmit();
    }

    handlerOnClose = () => {
        this.props.onClose();
    }

    render() {
        return (
            <Dialog
                open={this.props.open}
                onClose={() => this.handlerOnClose()}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{this.props.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {this.props.text}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.handlerOnClose()} color="primary">
                        取消
                        </Button>
                    <Button onClick={() => this.handlerOnSubmit()} color="primary" autoFocus>
                        确定
                        </Button>
                </DialogActions>
            </Dialog>
        )
    }
}