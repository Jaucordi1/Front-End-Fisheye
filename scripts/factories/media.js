/**
 * @param {IPhotographer} photographer
 * @param {IMedia} data
 */
export function mediaFactory(photographer, data) {
	const { id, photographerId, title, description, image, video, likes, date, price } = data;

	const type   = image ? 'img' : 'video';
	const folder = photographer.name.split(' ')[0];
	const media  = `assets/media/${folder}/${image || video}`;

	/**
	 * @return {HTMLImageElement}
	 */
	function getImageDOM() {
		const imgEl = document.createElement('img');
		imgEl.setAttribute('src', media);

		return imgEl;
	}
	/**
	 * @return {HTMLVideoElement}
	 */
	function getVideoDOM() {
		/** @type {HTMLVideoElement} */
		const videoEl = document.createElement('video');
		videoEl.setAttribute('src', media);
		videoEl.defaultMuted = true;
		videoEl.autoplay = false;
		videoEl.loop = true;
		videoEl.addEventListener('mouseover', (event) => {
			const article = videoEl.parentElement.parentElement.parentElement;
			if (!article.classList.contains('opened') && videoEl.paused) {
				videoEl.autoplay = true;
				videoEl.play();
			}
		});
		videoEl.addEventListener('mouseout', (event) => {
			const article = videoEl.parentElement.parentElement.parentElement;
			if (!article.classList.contains('opened') && !videoEl.paused) {
				videoEl.autoplay = false;
				videoEl.pause();
				videoEl.currentTime = 0;
			}
		});
		videoEl.addEventListener('click', (event) => {
			const article = videoEl.parentElement.parentElement.parentElement;
			if (article.classList.contains('opened')) {
				if (videoEl.paused) {
					videoEl.play();
				} else {
					videoEl.pause();
				}
			}
		});

		return videoEl;
	}

	/**
	 * @return {HTMLImageElement | HTMLVideoElement}
	 */
	function getMediaDOM() {
		let mediaEl;
		switch (type) {
			case 'img':
				mediaEl = getImageDOM();
				break;
			case 'video':
				mediaEl = getVideoDOM();
				break;
			default:
				throw new Error('Unknown media type. Only pictures & videos are allowed.');
		}
		mediaEl.setAttribute('alt', description || '');

		return mediaEl;
	}
	/**
	 * @param {(event: MouseEvent<HTMLAnchorElement>) => void} onClick
	 * @return {{
	 *		link: HTMLAnchorElement,
	 *		media: (HTMLImageElement|HTMLVideoElement)
	 * }}
	 */
	function getMediaLinkDOM(onClick) {
		const mediaEl = getMediaDOM();

		const linkEl  = document.createElement('a');
		linkEl.setAttribute('tabindex', window.useTabIndex());
		linkEl.addEventListener('click', (event) => {
			event.preventDefault();
			onClick(event);
		});
		linkEl.appendChild(mediaEl);

		return { link: linkEl, media: mediaEl };
	}

	/**
	 * @return {{
	 *		container: HTMLDivElement,
	 *		icon: HTMLImageElement,
	 *		count: HTMLElement
	 * }}
	 */
	function getLikesDOM() {
		const containerEl = document.createElement('div');
		containerEl.classList.add('likes');
		containerEl.setAttribute('tabindex', window.useTabIndex());

		const likesCountEl       = document.createElement('strong');
		likesCountEl.textContent = likes.toString(10);

		const heartEl = document.createElement('img');
		heartEl.setAttribute('alt', 'likes');
		heartEl.src = 'assets/icons/heart.svg';

		containerEl.appendChild(likesCountEl);
		containerEl.appendChild(heartEl);

		return { container: containerEl, count: likesCountEl, icon: heartEl };
	}

	/**
	 * @return {{container: HTMLElement, content: HTMLHeadingElement}}
	 */
	function getFigcaptionDOM() {
		const h2       = document.createElement('h2');
		h2.setAttribute('tabindex', window.useTabIndex());
		h2.textContent = title;

		const figcaptionEl = document.createElement('figcaption');
		figcaptionEl.appendChild(h2);

		return { container: figcaptionEl, content: h2 };
	}
	/**
	 * @param {(event: MouseEvent<HTMLAnchorElement>) => void} onClick
	 * @return {{
	 *		container: HTMLElement,
	 *		caption: {
	 *			container: HTMLElement,
	 *			content: HTMLHeadingElement
	 *		},
	 *		media: {
	 *			link: HTMLAnchorElement,
	 *			media: (HTMLImageElement | HTMLVideoElement)
	 *		}
	 * }}
	 */
	function getFigureDOM(onClick) {
		const mediaEl = getMediaLinkDOM(onClick);
		const figcaptionEl = getFigcaptionDOM();
		const likesEl      = getLikesDOM();

		figcaptionEl.container.appendChild(likesEl.container);
		mediaEl.link.setAttribute('aria-label', `${title}, closeup view`);
		mediaEl.media.setAttribute('alt', description);

		const figureEl = document.createElement('figure');
		figureEl.appendChild(mediaEl.link);
		figureEl.appendChild(figcaptionEl.container);

		return { container: figureEl, caption: figcaptionEl, media: mediaEl };
	}

	/**
	 * @param {(event: MouseEvent<HTMLAnchorElement>) => void} onClick
	 * @return {{
	 * 		container: HTMLElement,
	 * 		figure: {
	 * 			container: HTMLElement,
	 * 			caption: {
	 * 				container: HTMLElement,
	 * 				content: HTMLHeadingElement
	 * 			},
	 * 			media: {
	 * 				link: HTMLAnchorElement,
	 * 				media: (HTMLImageElement | HTMLVideoElement)
	 * 			}
	 * 		}
	 * }}
	 */
	function getMediaCardDOM(onClick) {
		const article = document.createElement('article');
		const figureEl = getFigureDOM(onClick);

		article.appendChild(figureEl.container);

		return { container: article, figure: figureEl };
	}

	return { name, media, getMediaCardDOM, getMediaDOM };
}
