export function photographerFactory(data) {
	const { id, name, tagline, city, country, price, portrait } = data;

	const picture = `assets/photographers/${portrait}`;

	function getUserCardDOM() {
		// Creating photographer picture
		const imgEl = document.createElement('img');
		imgEl.setAttribute('src', picture);
		imgEl.setAttribute('alt', '');

		// Creating photographer name
		const nameEl       = document.createElement('h2');
		nameEl.textContent = name;

		// Wrapping photographer's name & picture in a link
		const linkEl = document.createElement('a');
		linkEl.setAttribute('href', `photographer.html?id=${id}`);
		linkEl.appendChild(imgEl);
		linkEl.appendChild(nameEl);

		// Creating photographer location
		const locationEl = document.createElement('span');
		locationEl.classList.add('location');
		locationEl.textContent = `${city}, ${country}`;

		// Creating photographer tagline
		const taglineEl = document.createElement('span');
		taglineEl.classList.add('tagLine');
		taglineEl.textContent = tagline;

		// Creating photographer cost-per-day
		const costEl = document.createElement('span');
		costEl.classList.add('cost');
		costEl.textContent = `${price}€/jour`;

		// Wrapping photographer's location, bio & cost-per-day in a paragraph
		const paragraphEl = document.createElement('p');
		paragraphEl.appendChild(locationEl);
		paragraphEl.appendChild(taglineEl);
		paragraphEl.appendChild(costEl);

		// Wrapping photographer's informations together
		const articleEl = document.createElement('article');
		articleEl.appendChild(linkEl);
		articleEl.appendChild(paragraphEl);

		return articleEl;
	}

	return { name, picture, getUserCardDOM };
}
