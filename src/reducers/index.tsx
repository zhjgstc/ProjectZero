import { combineReducers } from 'redux'
import { calculate } from './calculate';
import { reduLeftBar } from './Main/ReduLeftBar';

export default combineReducers({
    calculate,
    reduLeftBar
})
