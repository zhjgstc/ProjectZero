import React from 'react';


interface IState {
    text: string
}
interface IProps {
    onCancel: any,
    onClick?: any
}

export default class MySqlFrom extends React.Component<IProps, IState> {
    componentDidMount() {

    }

    onCancel_Click = () => {
        if (this.props.onCancel) {
            this.props.onCancel();
        }
    }
    onSubmit_Click = () => {
        if (this.props.onClick) {
            this.props.onClick();
        }
    }

    render() {
        return (
            <div>
                连接名：<input type="text" />
                <br />
                主机：<input type="text" />
                <br />
                端口：<input type="text" />
                <br />
                用户名：<input type="text" />
                <br />
                密码：<input type="text" />
                <br />
                <button>测试连接</button>
                &nbsp;<button>保存</button>
                &nbsp;<button onClick={() => this.onCancel_Click()}>取消</button>
            </div>
        )
    }
}