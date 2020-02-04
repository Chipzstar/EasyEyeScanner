import {ADD_PHOTO, REMOVE_PHOTO, REPLACE_PHOTO} from "../actions/capturesAction";

const initialState = {
	captures: []
};

const capturesReducer = (state = initialState, action) => {
	let index = 0;
	let updatedCaptures = [];
	switch (action.type) {
		case ADD_PHOTO:
			return {...state, captures: state.captures.concat(action.photo)};
		case REMOVE_PHOTO:
			index = state.captures.findIndex(photoObj => photoObj.uri === action.photoURI);
			updatedCaptures = [...state.captures];
			updatedCaptures.splice(index, 1);
			return {...state, captures: updatedCaptures};
		case REPLACE_PHOTO:
			index = state.captures.findIndex(photoObj => photoObj.uri === action.oldPhotoURI);
			updatedCaptures = [...state.captures];
			updatedCaptures.splice(index, 1, action.newPhoto);
			return {...state, captures: updatedCaptures};
		default:
			return state;
	}
};

export default capturesReducer;
