import React from 'react';
import List from '@material-ui/core/List';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import StorageIcon from '@material-ui/icons/Storage';
import IConfig from '../../models/MySql';

interface IProps {
    source?: Array<any>,
    onClick?: any
}

interface IState {
}

export default class LeftBar extends React.Component<IProps, IState>{
    constructor(props: any) {
        super(props);
        this.state = {
        }
    }

    handleOnClick = (item: IConfig) => {
        if (this.props.onClick) {
            this.props.onClick(item);
        }
    }

    render() {
        return (
            <div style={{ borderRightWidth: "1px", borderRightColor: "#D4D4D4" }}>
                <List>
                    {
                        this.props.source ? this.props.source.map((item: IConfig, index) => {
                            return (
                                <ListItem button key={index} onClick={() => this.handleOnClick(item)}>
                                    <ListItemIcon>
                                        <StorageIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={item.name} />
                                </ListItem>
                            )
                        }) : null
                    }
                </List>
            </div >
        )
    }
}