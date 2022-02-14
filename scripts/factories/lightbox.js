/**
 * @typedef {{
 *     actualIndex?: number,
 *     actualMedia?: HTMLElement,
 *     lightboxEl?: HTMLDivElement,
 *     opened: boolean,
 *     setIndex: (idx: number) => boolean,
 *     getLightboxDOM: (photographer: IPhotographer) => {container: HTMLDivElement, next: HTMLAnchorElement, prev: HTMLAnchorElement},
 *     openMedia: (id: number) => void
 * }} ILightbox
 */

/**
 * @param {HTMLElement} container
 * @param {IMedia[]} medias
 * @return {ILightbox}
 */
export default function lightboxFactory(container, medias) {
	/** @var {ILightbox} lightbox */
	const lightbox = {
		actualIndex: undefined,
		actualMedia: undefined,
		lightboxEl : container,
		opened     : false,
	};

	function addControls() {
		const leftArrowEl  = getLeftArrowDOM();
		leftArrowEl.addEventListener('click', (event) => {
			event.preventDefault();
			let newIdx = lightbox.actualIndex - 1;
			if (newIdx < 0) newIdx = medias.length - 1;
			lightbox.setIndex(newIdx);
		});

		const rightArrowEl = getRightArrowDOM();
		rightArrowEl.addEventListener('click', (event) => {
			event.preventDefault();
			let newIdx = lightbox.actualIndex + 1;
			if (newIdx >= medias.length) newIdx = 0;
			lightbox.setIndex(newIdx);
		});

		const closeEl = getCloseDOM();
		closeEl.addEventListener('click', (event) => {
			event.preventDefault();
			lightbox.setIndex(-1);
		})

		lightbox.actualMedia.prepend(leftArrowEl);
		lightbox.actualMedia.appendChild(rightArrowEl);
		lightbox.actualMedia.appendChild(closeEl);
	}

	lightbox.setIndex = (idx) => {
		// Return if given actual index
		if (idx === lightbox.actualIndex) return;

		// Destroy actual lightbox controls & restore previous media css
		if (lightbox.actualIndex !== undefined) {
			lightbox.actualMedia.classList.remove('opened');
			lightbox.actualMedia.removeAttribute('aria-label');
			lightbox.actualMedia.querySelector('.left-arrow')?.remove();
			lightbox.actualMedia.querySelector('.right-arrow')?.remove();
			lightbox.actualMedia.querySelector('.close')?.remove();
			lightbox.actualMedia.querySelector('figure > figcaption > .likes').style.display = 'flex';

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
		lightbox.actualMedia = lightbox.lightboxEl.querySelector(`article:nth-child(${lightbox.actualIndex+1})`);

		addControls();

		lightbox.actualMedia.classList.add('opened');
		lightbox.actualMedia.setAttribute('aria-label', 'image closeup view');
		lightbox.actualMedia.querySelector('figure > figcaption > .likes').style.display = 'none';

		return true;
	}

	function closeLightbox() {
		lightbox.opened = false;
		document.body.style.overflow = 'auto';
	}
	function openLightbox() {
		lightbox.opened = true;
		document.body.style.overflow = 'hidden';
		lightbox.actualMedia.focus();
	}

	/**
	 * @param {number} id
	 */
	lightbox.openMedia = (id) => {
		const oldIndex = lightbox.actualIndex;
		const foundIndex = medias.findIndex((media) => media.id === id);
		if (!lightbox.setIndex(foundIndex)) return

		console.log('Switching media from', oldIndex, 'to', lightbox.actualIndex);

		openLightbox();
	};

	function getLeftArrowDOM() {
		const iconEl = document.createElement('img');
		iconEl.setAttribute('src', 'assets/icons/arrow-left.svg');
		iconEl.setAttribute('alt', '');

		const arrowEl = document.createElement('a');
		arrowEl.classList.add('left-arrow');
		arrowEl.setAttribute('aria-label', 'Previous media closeup view');
		arrowEl.appendChild(iconEl);

		return arrowEl;
	}
	function getRightArrowDOM() {
		const iconEl = document.createElement('img');
		iconEl.setAttribute('src', 'assets/icons/arrow-left.svg');
		iconEl.setAttribute('alt', '');

		const arrowEl = document.createElement('a');
		arrowEl.classList.add('right-arrow');
		arrowEl.setAttribute('aria-label', 'Next media closeup view');
		arrowEl.appendChild(iconEl);

		return arrowEl;
	}
	function getCloseDOM() {
		const iconEl = document.createElement('img');
		iconEl.setAttribute('src', 'assets/icons/close.svg');
		iconEl.setAttribute('alt', '');

		const closeEl = document.createElement('a');
		closeEl.classList.add('close');
		closeEl.setAttribute('aria-label', 'Close closeup view');
		closeEl.appendChild(iconEl);

		return closeEl;
	}

	return lightbox;
}
