export async function getPhotographers() {
	// Lazy-load data loader & load data
	// TODO Load only photographers data from back-end
	const getData = (await import('./all.js')).getData;
	const data    = await getData();

	return {
		photographers: [...data.photographers],
	};
}

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
