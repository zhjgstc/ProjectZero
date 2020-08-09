import React, { Component } from 'react'
import { connect } from "react-redux";
import { incrementAction, reduceAction } from '../../reducers/calculate';

interface IProps {
    increment: () => any,
    decrement: () => any,
}


class Button extends Component<IProps, {}> {
    render() {
        return (
            <div>
                <button onClick={() => { this.props.increment() }}>+</button>
                <button onClick={() => { this.props.decrement() }}>-</button>
            </div>
        )
    }
}

const mapStateToProps = (state: any) => {

};

const mapDispatchToProps = (dispatch: any) => ({
    increment: () => dispatch(incrementAction()),
    decrement: () => dispatch(reduceAction)
});

export default connect(mapStateToProps, mapDispatchToProps)(Button)
