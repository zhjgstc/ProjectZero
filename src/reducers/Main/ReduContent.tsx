import * as MySqlModels from "../../models/MySql";
import * as utils from '../../utils/Utils';
import { IAction, SELECTDATABASE, ADDCHIPITEM, DELCHIPITEM, ISelectItem, IChipItem, GETMYSQLTALBES, SETCHIPSELECTITEM } from '../../actions/Main/ContentAction';

interface ReduxState {
    selectItem: ISelectItem,
    chipList: Array<IChipItem>
}

const initData = {
    selectItem: undefined,
    chipList: new Array<IChipItem>()
}

const reduContent = (state: ReduxState = initData, action: IAction) => {
    switch (action.type) {
        case SELECTDATABASE: {
            return {
                selectItem: utils.Loadsh.clone(action.selectItem),
                chipList: utils.Loadsh.clone(action.chipList)
            }
        }
        case GETMYSQLTALBES: {
            return {
                selectItem: utils.Loadsh.clone(action.selectItem),
                chipList: utils.Loadsh.clone(action.chipList)
            }
        }
        case DELCHIPITEM:
        case SETCHIPSELECTITEM: {
            return {
                ...state,
                chipList: utils.Loadsh.clone(action.chipList)
            }
        }
        case ADDCHIPITEM: {
            return {
                selectItem: utils.Loadsh.clone(action.selectItem),
                chipList: utils.Loadsh.clone(action.chipList)
            }
        }
        default:
            return state
    }
}

export { reduContent }