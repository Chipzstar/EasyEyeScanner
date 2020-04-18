const RESET = 'RESET';
import {combineReducers} from 'redux';
import capturesReducer from "./reducers/capturesReducer";
import documentsReducer from "./reducers/documentsReducer";
import { AsyncStorage } from "react-native";

export const RESET_ACTION = {
	type: RESET
};

const appReducer = combineReducers({
	captures: capturesReducer,
	documents: documentsReducer
});

const rootReducer = (state, action) => {
	if (action.type === RESET) {
		// for all keys defined in your persistConfig(s)
		console.log("Redux Storage has been reset");
		AsyncStorage.removeItem('persist:root').then(() => state = undefined);
	}
	return appReducer(state, action);
};

export default rootReducer;
