export const ADD_PHOTO = 'ADD_PHOTO';
export const REMOVE_PHOTO = 'REMOVE_PHOTO';

export const addPhoto = (photo) => {
	return {
		type: ADD_PHOTO,
		photo: photo
	}
};

export const removePhoto = (uri) => {
	return {
		type: REMOVE_PHOTO,
		photoURI: uri
	}
};

