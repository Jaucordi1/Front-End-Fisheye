/**
 * @typedef {{
 * 		id: number,
 * 		photographerId: number,
 * 		title: string,
 * 		description: string,
 * 		image: string,
 * 		likes: number,
 * 		date: string,
 * 		price: number
 * }} IMedia
 */

/**
 * @return {Promise<{medias: IMedia[]}>}
 */
export async function getMedias() {
	// Lazy-load data loader & load data
	// TODO Load only medias data from back-end
	const getData = (await import('./all.js')).getData;
	const data    = await getData();

	return {
		medias: [...data.medias],
	};
}

/**
 * @param {number} id
 * @return {Promise<{media: (IMedia|null)}>}
 */
export async function getMediaById(id) {
	// Load all medias & find the one with given id
	const medias = await getMedias();
	const media  = medias.find((m) => m.id === id);

	// Returns a null value if no media's found with given id
	return {
		media: media
			   ? { ...media }
			   : null,
	};
}

/**
 * @param {number} photographerId
 * @return {Promise<{medias: IMedia[]}>}
 */
export async function getPhotographerMedias(photographerId) {
	// Lazy-load medias loader & load medias
	const { medias }         = await getMedias();
	const photographerMedias = medias.filter(media => media.photographerId === photographerId);

	return {
		medias: [...photographerMedias],
	};
}
