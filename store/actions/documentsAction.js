export const ADD_DOCUMENT = 'ADD_DOCUMENT';
export const REMOVE_DOCUMENT = 'REMOVE_DOCUMENT';
export const UPDATE_DOCUMENT = 'UPDATE_DOCUMENT';

export const addDocument = (document) => {
	return {
		type: ADD_DOCUMENT,
		document: document
	}
};

export const removeDocument= (imageURI) => {
	return {
		type: REMOVE_DOCUMENT,
		documentId: imageURI
	}
};

export const updateDocument = (imageURI, newDocument) => {
	return {
		type: UPDATE_DOCUMENT,
		documentId: imageURI,
		newDocument: newDocument

	}
};

