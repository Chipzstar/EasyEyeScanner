export const ADD_PHOTO = 'ADD_PHOTO';
export const REMOVE_PHOTO = 'REMOVE_PHOTO';
export const REPLACE_PHOTO = 'REPLACE_PHOTO';
export const CLEAR = 'CLEAR_PHOTOS';

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

export const replacePhoto = (oldURI, newPhoto) => {
	return {
		type: REPLACE_PHOTO,
		oldPhotoURI: oldURI,
		newPhoto: newPhoto
	}
};

export const clearPhotos = () => {
	return {
		type: CLEAR
	}
};

