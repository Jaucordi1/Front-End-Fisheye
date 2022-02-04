export function photographerFactory(data) {
	const { id, name, tagline, city, country, price, portrait } = data;
	const picture = `assets/photographers/${portrait}`;

	function getUserPictureDOM() {
		// Creating photographer picture
		const imgEl = document.createElement('img');
		imgEl.setAttribute('src', picture);
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
		costEl.textContent = `${price}€/jour`;

		return costEl;
	}

	function getUserPictureAndNameLinkDOM() {
		const imgEl = getUserPictureDOM();

		// Creating photographer name
		const nameEl       = document.createElement('h2');
		nameEl.textContent = name;

		// Wrapping photographer's name & picture in a link
		const linkEl = document.createElement('a');
		linkEl.setAttribute('href', `photographer.html?id=${id}`);
		linkEl.setAttribute('tabindex', window.useTabIndex());
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
		paragraphEl.setAttribute('tabindex', window.useTabIndex());
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

	return { name, picture, getUserCardDOM };
}
