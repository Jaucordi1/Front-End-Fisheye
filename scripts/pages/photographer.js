import { photographerFactory } from '../factories/photographer.js';
import { mediaFactory } from '../factories/media.js';
import inputFactory from '../factories/input.js';
import lightboxFactory from '../factories/lightbox.js';
import { getContactForm } from '../utils/contactForm.js';

/**
 * @param {IPhotographer} photographer
 */
function displayHeaderData(photographer) {
	// Lazy-load photographer factory
	const { getUserHeaderDOM } = photographerFactory(photographer);

	// DOM elements
	const photographerHeaderEl = document.querySelector('.photograph-header');
	const { infoEl, pictureEl } = getUserHeaderDOM();

	photographerHeaderEl.prepend(infoEl);
	photographerHeaderEl.appendChild(pictureEl);

	displayContactForm(photographer);
}

/**
 * @param {IPhotographer} photographer
 */
function displayContactForm(photographer) {
	const modalContainerEl = document.getElementById('contact_modal');
	const modalEl = getContactForm(photographer, ({ toPhotographer, ...data }) => {
		console.log(`Contact sent to photographer '${toPhotographer}' with data :`, data);
	});

	modalContainerEl.appendChild(modalEl);
}

/**
 * @param {IPhotographer} photographer
 * @param {number} totalLikes
 */
function displayFloatingData(photographer, totalLikes) {
	// Lazy-load photographer factory
	const { getUserFloatingDetailsDOM } = photographerFactory(photographer);

	// DOM elements
	const photographHeader = document.querySelector('.photograph-header');
	const floatingEl = getUserFloatingDetailsDOM(totalLikes);

	photographHeader.insertAdjacentElement('afterend', floatingEl);
}

/**
 * @param {IPhotographer} photographer
 * @param {number} totalLikes
 * @param {(value: any) => void} onFilterChange
 */
function displayFiltersData(photographer, totalLikes, onFilterChange) {
	const filtersEl = document.querySelector('#main > .photograph-media-filters');

	const { getFormData } = inputFactory();

	const sortByFormData = getFormData(
		{
			id: photographer.id.toString(10),
			type: 'select',
			label: 'Trier par',
			options: [
				{ name: 'Popularité', value: 'likes' },
				{ name: 'Date', value: 'date' },
				{ name: 'Titre', value: 'title' },
			],
		},
		(newValue, oldValue) => {
			console.log('[ CHANGE ]', oldValue, '=>', newValue);
			const isValid = newValue !== oldValue;
			if (isValid) onFilterChange(newValue);
			return isValid;
		},
	);
	filtersEl.appendChild(sortByFormData.formData);

	// const {} = photographerFactory(photographer);
}

/**
 * @param {IPhotographer} photographer
 * @param {IMedia[]} medias
 * @param {ILightbox} lightboxHelper
 * @return {number}
 */
function displayMediasData(photographer, medias, lightboxHelper) {
	// DOM Elements
	const mediasSection = document.querySelector('.photograph-media');
	mediasSection.innerHTML = '';

	// Creating DOM medias
	let likesCounter = 0;
	medias.forEach((media) => {
		likesCounter += media.likes;

		// Get
		const mediaModel = mediaFactory(photographer, media);
		const mediaDOM = mediaModel.getMediaCardDOM(() => {
			lightboxHelper.openMedia(media.id);
		});

		mediasSection.appendChild(mediaDOM.container);

		function registerLikeEvent(container) {
			container.addEventListener('click', () => {
				// Increment individual & total likes counter
				media.likes++;
				likesCounter++;

				// Generate a new likes DOM for given media
				const updatedModel = mediaFactory(photographer, media);
				const newLikesDOM = updatedModel.getLikesDOM();

				// Replace old with new individual media likes DOM
				container.replaceWith(newLikesDOM.container);

				// Replace old with new total likes DOM
				document.querySelector('.likes-and-pricing > :first-child').replaceWith(
					photographerFactory(photographer).getUserPopularityDOM(likesCounter),
				);
			});
		}
		registerLikeEvent(mediaDOM.figure.caption.container.querySelector('.likes'));
	});

	return likesCounter;
}

/**
 * @param {IPhotographer} photographer
 * @param {IMedia[]} medias
 */
function displayData(photographer, medias) {
	// Displaying filters inputs
	let actualFilter;
	function sortMedias(prop) {
		actualFilter = prop;
		return medias.sort((a, b) => {
			const v1 = prop === 'date' ? new Date(a[prop]) : a[prop];
			const v2 = prop === 'date' ? new Date(b[prop]) : b[prop];

			switch (prop) {
				case 'likes':
				case 'date':
					if (v1 > v2) return -1;
					else if (v1 < v2) return 1;
					else return 0;
				case 'title':
				default:
					if (v1 > v2) return 1;
					else if (v1 < v2) return -1;
					else return 0;
			}
		});
	}

	// Loading data & displaying header elements
	displayHeaderData(photographer);

	const totalLikes = medias.reduce((total, media) => total + media.likes, 0);

	// Displaying price & likes
	displayFloatingData(photographer, totalLikes);

	const lightboxHelper = lightboxFactory(document.querySelector('.photograph-media'), medias);

	displayFiltersData(photographer, totalLikes, (value) => {
		console.log('Display medias');
		displayMediasData(photographer, sortMedias(value), lightboxHelper);
	});
}

async function init() {
	// Récupère l'id du photographe
	const params = new URL(window.location.href).searchParams;
	const photographerId = Number(params.get('id'));
	if (isNaN(photographerId)) throw new Error('Oops!');

	// Récupère les datas du photographe et de ses medias
	const { photographer } = await (await import('../data/photographers.js')).getPhotographerById(photographerId);
	if (!photographer) throw new Error('Photograph not found!');

	const { medias } = await (await import('../data/medias.js')).getPhotographerMedias(photographerId);

	displayData(photographer, medias);
}

(async () => await init())();
