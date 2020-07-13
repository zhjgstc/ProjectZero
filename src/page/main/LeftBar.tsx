import React from 'react';
import List from '@material-ui/core/List';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';

interface IProps {
    source?: Array<any>
}

interface IState {
}

export default class LeftBar extends React.Component<IProps, IState>{
    constructor(props: any) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div>
                <List>
                    {
                        this.props.source ? this.props.source.map((item, index) => {
                            return (
                                <ListItem button key={index} onClick={() => { alert('123') }}>
                                    <ListItemIcon>
                                        <InboxIcon />
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