import {useCallback, useState} from 'react';
import {CameraRoll} from 'react-native';

export default function useCameraRoll({first = 40, assetType = 'Photos', groupTypes = 'All',}) {
	const [photos, setPhotos] = useState([]);
	const [after, setAfter] = useState(null);
	const [hasNextPage, setHasNextPage] = useState(true);

	const getPhotos = useCallback(async () => {
		if (!hasNextPage) return;

		const {edges, page_info: pageInfo} = await CameraRoll.getPhotos({
			first,
			assetType,
			groupTypes,
			...(after && {after}),
		});

		if (after === pageInfo.end_cursor) return;

		const images = edges.map(i => i.node).map(i => i.image);

		setPhotos([...photos, ...images]);
		setAfter(pageInfo.end_cursor);
		setHasNextPage(pageInfo.has_next_page);
	}, [after, hasNextPage, photos]);

	return [photos, getPhotos];
}
