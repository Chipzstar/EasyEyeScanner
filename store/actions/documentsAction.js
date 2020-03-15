export const ADD_DOCUMENT = 'ADD_DOCUMENT';
export const REMOVE_DOCUMENT = 'REMOVE_DOCUMENT';
export const UPDATE_DOCUMENT = 'UPDATE_DOCUMENT';

export const addDocument = (document) => {
	return {
		type: ADD_DOCUMENT,
		document: document
	}
};

export const removeDocument= (documentId) => {
	return {
		type: REMOVE_DOCUMENT,
		id: documentId
	}
};

export const updateDocument = (imageURI) => {
	return {
		type: UPDATE_DOCUMENT,
		docURI: imageURI
	}
};

