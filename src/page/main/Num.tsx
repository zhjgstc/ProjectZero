import React, { Component } from 'react'
import { connect } from "react-redux";
import { incrementAction, reduceAction } from '../../reducers/calculate';

interface IProps {
    num: number
}


class NumCom extends Component<IProps, {}> {
    render() {
        return (
            <div>
                {this.props.num}
            </div>
        )
    }
}

const mapStateToProps = (state: any) => {
    return {
        num: state.calculate.num
    }
};

const mapDispatchToProps = (dispatch: any) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(NumCom)
