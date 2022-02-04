async function displayHeaderData(photographer) {
	// Lazy-load photographer factory
	const photographerFactory = (await import('../factories/photographer.js')).photographerFactory;
	const { getUserHeaderDOM } = photographerFactory(photographer);

	// DOM elements
	const photographerHeaderEl = document.querySelector('.photograph-header');
	const { titleEl, pictureEl, tagLineEl, locationEl } = getUserHeaderDOM();

	// Wrapping photographer's name, location & tagLine into a div.photographer-information
	const infoEl = document.createElement('div');
	infoEl.classList.add('photographer-information');
	infoEl.appendChild(titleEl);
	infoEl.appendChild(locationEl);
	infoEl.appendChild(tagLineEl);

	photographerHeaderEl.prepend(infoEl);
	photographerHeaderEl.appendChild(pictureEl);
}

async function displayData(photographer, medias) {
	displayHeaderData(photographer);

	// Lazy-load media factory
	const mediaFactory = (await import('../factories/media.js')).mediaFactory;

	// DOM Elements
	const mediasSection = document.querySelector('.photograph-media');

	// Creating DOM medias
	medias.forEach((media) => {
		const mediaModel   = mediaFactory(photographer, media);
		const mediaCardDOM = mediaModel.getMediaCardDOM();
		mediasSection.appendChild(mediaCardDOM);
	});
}

async function init() {
	// Récupère l'id du photographe
	const params         = new URL(window.location.href).searchParams;
	const photographerId = Number(params.get('id'));
	if (isNaN(photographerId)) throw new Error('Oops!');

	// Récupère les datas du photographe et de ses medias
	const { photographer } = await (await import('../data/photographers.js')).getPhotographerById(photographerId);
	const { medias } = await (await import('../data/medias.js')).getPhotographerMedias(photographerId);

	displayData(photographer, medias);
}

(async () => await init())();
