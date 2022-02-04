import initAccessibility from '../utils/accessibility.js';

async function displayData(photographers) {
    const photographerFactory = (await import('../factories/photographer.js')).photographerFactory;
    const photographersSection = document.querySelector(".photographer_section");

    photographers.forEach((photographer) => {
        const photographerModel = photographerFactory(photographer);
        const userCardDOM = photographerModel.getUserCardDOM();
        photographersSection.appendChild(userCardDOM);
    });
}

async function init() {
    initAccessibility(2);

    // Récupère les datas des photographes
    const { photographers } = await (await import('../data/photographers.js')).getPhotographers();
    return displayData(photographers);
}

(async () => await init())();
