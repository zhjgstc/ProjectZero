import * as MySqlModels from "../../models/MySql";
import * as utils from '../../utils/Utils';
import { IAction, INITHOST, ADDHOST, OPENHOST, DELHOST } from '../../actions/Main/LeftBarAction';

interface ReduxState {
    hosts: Array<MySqlModels.IHostItem>
}

const initData = {
    hosts: new Array<MySqlModels.IHostItem>()
}

const reduLeftBar = (state: ReduxState = initData, action: IAction) => {
    switch (action.type) {
        case INITHOST: {
            return {
                hosts: action.hosts
            }
        }
        case ADDHOST:
        case OPENHOST: {
            var hosts = utils.Loadsh.clone(action.hosts);
            return {
                hosts: hosts
            }
        }
        case DELHOST: {
            return {
                hosts: action.hosts
            }
        }
        default:
            return state
    }
}

export { reduLeftBar }