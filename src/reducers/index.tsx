import { combineReducers } from 'redux'
import { reduLeftBar } from './Main/ReduLeftBar';
import { reduContent } from './Main/ReduContent';

export default combineReducers({
    reduLeftBar,
    reduContent
})
