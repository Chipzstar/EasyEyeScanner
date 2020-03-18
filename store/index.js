import {combineReducers} from 'redux';
import capturesReducer from "./reducers/capturesReducer";
import documentsReducer from "./reducers/documentsReducer";

const rootReducer = combineReducers({
	captures: capturesReducer,
	documents: documentsReducer
});

export default rootReducer;
