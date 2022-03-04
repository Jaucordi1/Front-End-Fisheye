export function photographerFactory(data) {
	const { id, name, tagline, city, country, price, portrait } = data;
	const picture = `assets/photographers/${portrait}`;
	const minPicture = `assets/photographers/min/${portrait}`;

	function getUserPictureDOM() {
		// Creating photographer picture
		const imgEl = document.createElement('img');
		imgEl.setAttribute('src', picture);
		imgEl.setAttribute('srcset', `${minPicture} 300w, ${picture} 6000w`);
		imgEl.setAttribute('sizes', `(max-width: 500px) 300px, 6000px`);
		imgEl.setAttribute('alt', '');

		return imgEl;
	}
	function getUserLocationDOM() {
		// Creating photographer location
		const locationEl = document.createElement('span');
		locationEl.classList.add('location');
		locationEl.textContent = `${city}, ${country}`;

		return locationEl;
	}
	function getUserTagLineDOM() {
		// Creating photographer tagline
		const taglineEl = document.createElement('span');
		taglineEl.classList.add('tagLine');
		taglineEl.textContent = tagline;

		return taglineEl;
	}
	function getUserCostDOM() {
		// Creating photographer cost-per-day
		const costEl = document.createElement('span');
		costEl.classList.add('cost');
		costEl.setAttribute('aria-label', `${price}€ par jour`);
		costEl.textContent = `${price}€/jour`;

		return costEl;
	}

	function getUserPictureAndNameLinkDOM() {
		const imgEl = getUserPictureDOM();

		// Creating photographer name
		const nameEl = document.createElement('h2');
		nameEl.textContent = name;

		// Wrapping photographer's name & picture in a link
		const linkEl = document.createElement('a');
		linkEl.setAttribute('href', `photographer.html?id=${id}`);
		linkEl.setAttribute('tabindex', 0);
		linkEl.appendChild(imgEl);
		linkEl.appendChild(nameEl);

		return linkEl;
	}
	function getUserDetailsDOM() {
		const locationEl = getUserLocationDOM();
		const taglineEl = getUserTagLineDOM();
		const costEl = getUserCostDOM();

		// Wrapping photographer's location, bio & cost-per-day in a paragraph
		const paragraphEl = document.createElement('p');
		paragraphEl.setAttribute('tabindex', 0);
		paragraphEl.appendChild(locationEl);
		paragraphEl.appendChild(taglineEl);
		paragraphEl.appendChild(costEl);

		return paragraphEl;
	}
	function getUserCardDOM() {
		const linkEl = getUserPictureAndNameLinkDOM();
		const detailsEl = getUserDetailsDOM();

		const articleEl = document.createElement('article');
		articleEl.appendChild(linkEl);
		articleEl.appendChild(detailsEl);

		return articleEl;
	}

	function getUserHeaderDOM() {
		const titleEl = document.createElement('h1');
		titleEl.textContent = name;
		titleEl.setAttribute('tabindex', 0);

		const locationEl = getUserLocationDOM();
		const tagLineEl = getUserTagLineDOM();
		const pictureEl = getUserPictureDOM();

		// Wrapping photographer's name, location & tagLine into a div.photographer-information
		const infoEl = document.createElement('div');
		infoEl.classList.add('photograph-information');
		infoEl.appendChild(titleEl);

		const detailsEl = document.createElement('p');
		detailsEl.classList.add('photograph-information-details');
		detailsEl.setAttribute('tabindex', 0);
		detailsEl.appendChild(locationEl);
		detailsEl.appendChild(tagLineEl);
		infoEl.appendChild(detailsEl);

		pictureEl.setAttribute('tabindex', 0);
		pictureEl.setAttribute('alt', name);

		return { infoEl, pictureEl };
	}

	function getUserPopularityDOM(likes) {
		const popularityEl = document.createElement('strong');
		popularityEl.setAttribute('aria-label', `${likes} likes`);
		popularityEl.textContent = `${likes} ♥`;

		return popularityEl;
	}
	function getUserFloatingDetailsDOM(likes) {
		const popularityEl = getUserPopularityDOM(likes);

		const pricingEl = document.createElement('strong');
		pricingEl.setAttribute('aria-label', `${price} euro par jour`);
		pricingEl.textContent = `${price}€ / jour`;

		const floatingEl = document.createElement('div');
		floatingEl.classList.add('likes-and-pricing');
		floatingEl.setAttribute('tabindex', 0);

		floatingEl.appendChild(popularityEl);
		floatingEl.appendChild(pricingEl);

		return floatingEl;
	}

	return { name, picture, getUserCardDOM, getUserHeaderDOM, getUserFloatingDetailsDOM, getUserPopularityDOM };
}
