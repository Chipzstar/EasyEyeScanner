import {ADD_DOCUMENT, REMOVE_DOCUMENT, UPDATE_DOCUMENT} from "../actions/documentsAction";

const initialState = {
	documents: []
};

const documentsReducer = (state = initialState, action) => {
	let index = 0;
	let updatedDocuments = [];
	switch (action.type) {
		case ADD_DOCUMENT:
			return {...state, documents: state.documents.concat(action.document)};
		case UPDATE_DOCUMENT:
			index = state.documents.findIndex(docObj => docObj.uri === action.docURI);
			updatedDocuments = [...state.documents];
			updatedDocuments.splice(index, 1);
			return {...state, captures: updatedDocuments};
		case REMOVE_DOCUMENT:
			break;
		default:
			return state;
	}
};

export default documentsReducer;
