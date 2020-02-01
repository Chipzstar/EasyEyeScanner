import {ADD_PHOTO, REMOVE_PHOTO} from "../actions/capturesAction";

const initialState = {
	captures: []
};

const capturesReducer = (state = initialState, action) => {
	switch (action.type) {
		case ADD_PHOTO:
			return {...state, captures: state.captures.concat(action.photo)};
		case REMOVE_PHOTO:
			let index = state.captures.findIndex(photoObj => photoObj.uri === action.photoURI);
			const updatedCaptures = [...state.captures];
			updatedCaptures.splice(index, 1);
			return {...state, captures: updatedCaptures};
		default:
			return state;
	}
};

export default capturesReducer;
