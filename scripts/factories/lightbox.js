import iconsFactory from './icons.js';

/**
 * @typedef {{
 *     actualIndex?: number,
 *     actualMedia?: HTMLElement,
 *     lightboxEl?: HTMLDivElement,
 *     opened: boolean,
 *     setIndex: (idx: number) => boolean,
 *     getLightboxDOM: (photographer: IPhotographer) => {container: HTMLDivElement, next: HTMLAnchorElement, prev: HTMLAnchorElement},
 *     openMedia: (id: number) => void,
 *     loopNextTab: boolean
 * }} ILightbox
 */

/**
 * @param {HTMLElement} container
 * @param {IMedia[]} medias
 * @return {ILightbox}
 */
export default function lightboxFactory(container, medias) {
	function getMediaIndexFromId(id) {
		return medias.findIndex((media) => media.id === id);
	}

	/** @var {ILightbox} lightbox */
	const lightbox = {
		actualIndex: undefined,
		actualMedia: undefined,
		lightboxEl: container,
		opened: false,
		loopNextTab: false
	};

	function getLeftArrowDOM() {
		const iconEl = document.createElement('img');
		iconEl.setAttribute('src', 'assets/icons/arrow-left.svg');
		iconEl.setAttribute('alt', '');

		const arrowEl = document.createElement('a');
		arrowEl.classList.add('left-arrow');
		arrowEl.setAttribute('aria-label', 'Previous image');
		arrowEl.setAttribute('tabindex', '4');
		arrowEl.appendChild(iconEl);

		return arrowEl;
	}
	function getRightArrowDOM() {
		const iconEl = document.createElement('img');
		iconEl.setAttribute('src', 'assets/icons/arrow-left.svg');
		iconEl.setAttribute('alt', '');

		const arrowEl = document.createElement('a');
		arrowEl.classList.add('right-arrow');
		arrowEl.setAttribute('aria-label', 'Next image');
		arrowEl.setAttribute('tabindex', '5');
		arrowEl.appendChild(iconEl);

		return arrowEl;
	}
	function getCloseDOM() {
		const getIconDOM = iconsFactory();
		const iconEl = getIconDOM('close');
		iconEl.setAttribute('alt', '');

		const closeEl = document.createElement('a');
		closeEl.classList.add('close');
		closeEl.setAttribute('aria-label', 'Close dialog');
		closeEl.setAttribute('tabindex', '6');
		closeEl.appendChild(iconEl);

		return closeEl;
	}

	/**
	 * @param {KeyboardEvent} event
	 */
	function handleKey(event) {
		const { code, altKey } = event;
		const { activeElement } = document;
		// console.log('[KEYBOARD]', code, currentTarget);

		switch (code) {
			case 'Enter':
			case 'Space':
				if (activeElement.tagName === 'A') {
					if (activeElement.classList.contains('close')) {
						const mediaNavEl = lightbox.actualMedia;
						lightbox.setIndex(-1);
						mediaNavEl.firstElementChild.firstElementChild.focus();
					} else if (activeElement.classList.contains('left-arrow')) {
						prevMedia();
					} else if (activeElement.classList.contains('right-arrow')) {
						nextMedia();
					}
				}
				break;
			case 'ArrowLeft':
				if (lightbox.opened) prevMedia();
				break;
			case 'ArrowRight':
				if (lightbox.opened) nextMedia();
				break;
			case 'Tab':
				if (lightbox.loopNextTab) {
					lightbox.actualMedia.focus();
					lightbox.loopNextTab = false;
				} else if (lightbox.opened && !altKey && activeElement.classList.contains('close')) {
					lightbox.loopNextTab = true;
				}
				break;
			case 'Escape':
				if (lightbox.opened) {
					const mediaNavEl = lightbox.actualMedia;
					lightbox.setIndex(-1);
					mediaNavEl.firstElementChild.firstElementChild.focus();
				}
				break;
			default:
				// console.log(code + ' key pressed');
				break;
		}
	}
	function addControls() {
		const leftArrowEl = getLeftArrowDOM();
		leftArrowEl.addEventListener('click', () => prevMedia());

		const rightArrowEl = getRightArrowDOM();
		rightArrowEl.addEventListener('click', () => nextMedia());

		const closeEl = getCloseDOM();
		closeEl.addEventListener('click', () => lightbox.setIndex(-1));

		document.addEventListener('keyup', handleKey);

		lightbox.actualMedia.prepend(leftArrowEl);
		lightbox.actualMedia.appendChild(rightArrowEl);
		lightbox.actualMedia.appendChild(closeEl);
	}

	function prevMedia() {
		let prevIdx = lightbox.actualIndex - 1;
		if (prevIdx < 0) prevIdx = medias.length - 1;

		const media = medias[prevIdx];

		lightbox.openMedia(media.id);
	}
	function nextMedia() {
		let nextIdx = lightbox.actualIndex + 1;
		if (nextIdx >= medias.length) nextIdx = 0;

		const media = medias[nextIdx];

		lightbox.openMedia(media.id);
	}

	lightbox.setIndex = (idx) => {
		// Return if given actual index
		if (idx === lightbox.actualIndex) return;

		// Destroy actual lightbox controls & restore previous media css
		if (lightbox.actualIndex !== undefined) {
			document.removeEventListener('keyup', handleKey);
			lightbox.actualMedia.classList.remove('opened');
			lightbox.actualMedia.removeAttribute('aria-label');
			/** Reset tabindexes! */
			lightbox.actualMedia.removeAttribute('tabindex');
			const oldFigLink = lightbox.actualMedia.querySelector('figure > a');
			oldFigLink.setAttribute('tabindex', '0');
			oldFigLink.setAttribute('aria-label', `${medias[lightbox.actualIndex].title}, closeup view`);
			oldFigLink.firstElementChild.removeAttribute('tabindex');
			lightbox.actualMedia.querySelector('figure > figcaption > h2').setAttribute('tabindex', '0');
			/** Reset tabindexes! */

			lightbox.actualMedia.querySelector('.left-arrow')?.remove();
			lightbox.actualMedia.querySelector('.right-arrow')?.remove();
			lightbox.actualMedia.querySelector('.close')?.remove();
			lightbox.actualMedia.querySelector('figure > figcaption > .likes').style.display = 'flex';
			lightbox.actualMedia.removeEventListener('keypress', handleKey);

			// Pause video & reset currentTime if media is a video
			const videoEl = lightbox.actualMedia.querySelector('video');
			if (videoEl && !videoEl.paused) {
				videoEl.pause();
				videoEl.currentTime = 0;
			}
		}

		// Reset actualIndex & actualMedia values & close lightbox
		if (idx === -1) {
			lightbox.actualIndex = undefined;
			lightbox.actualMedia = undefined;
			closeLightbox();
			return false;
		}

		lightbox.actualIndex = idx;
		lightbox.actualMedia = lightbox.lightboxEl.querySelector(`article:nth-child(${lightbox.actualIndex + 1})`);

		addControls();

		/** Switch opened media to lightbox style */
		lightbox.actualMedia.classList.add('opened');

		/** Define opened media aria-label to define new root zone */
		lightbox.actualMedia.setAttribute('aria-label', 'image closeup view');

		/** Makes tabindexes navigates in loop through the current opened media! */
		lightbox.actualMedia.setAttribute('tabindex', '1');
		const figLink = lightbox.actualMedia.querySelector('figure > a');
		figLink.removeAttribute('tabindex');
		figLink.removeAttribute('aria-label');
		figLink.firstElementChild.setAttribute('tabindex', '2');
		lightbox.actualMedia.querySelector('figure > figcaption > h2').setAttribute('tabindex', '3');
		/** Makes tabindexes navigates in loop through the current opened media! */

		/** Hide likes in lightbox view */
		lightbox.actualMedia.querySelector('figure > figcaption > .likes').style.display = 'none';

		lightbox.actualMedia.addEventListener('keypress', event => handleKey(event));

		return true;
	}

	function openLightbox() {
		lightbox.opened = true;
		document.body.style.overflow = 'hidden'; // Force whole document to hide scrollbars
		lightbox.actualMedia.focus();
	}
	function closeLightbox() {
		lightbox.opened = false;
		document.body.style.overflow = 'auto'; // restore whole document scrolling behavior
	}

	/**
	 * @param {number} id
	 */
	lightbox.openMedia = (id) => {
		if (lightbox.setIndex(getMediaIndexFromId(id)))
			openLightbox();
	};

	return lightbox;
}
