import {ADD_DOCUMENT, REMOVE_DOCUMENT} from "../actions/documentsAction";

const initialState = {
	documents: []
};

const documentsReducer = (state = initialState, action) => {
	let index = 0;
	let updatedDocuments = [];
	switch (action.type) {
		case ADD_DOCUMENT:
			return {...state, documents: state.documents.concat(action.document)};
		case REMOVE_DOCUMENT:
			break;
		default:
			return state;
	}
};

export default documentsReducer;
