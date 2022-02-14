/**
 * @typedef {{
 * 		id: number,
 * 		name: string,
 * 		city: string,
 * 		country: string,
 * 		tagline: string,
 * 		price: number,
 * 		portrait: string
 * }} IPhotographer
 */

/**
 * @return {Promise<{photographers: IPhotographer[]}>}
 */
export async function getPhotographers() {
	// Lazy-load data loader & load data
	// TODO Load only photographers data from back-end
	const getData = (await import('./all.js')).getData;
	const data    = await getData();

	return {
		photographers: [...data.photographers],
	};
}

/**
 * @param id
 * @return {Promise<{photographer: (IPhotographer|null)}>}
 */
export async function getPhotographerById(id) {
	// Load all photographers & find the one with given id
	const { photographers } = await getPhotographers();
	const photographer  = photographers.find((p) => p.id === id);

	// Returns a null value if no photographer's found with given id
	return {
		photographer: photographer
					  ? { ...photographer }
					  : null,
	};
}
