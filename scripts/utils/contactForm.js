import iconsFactory from '../factories/icons.js';
import inputFactory from '../factories/input.js';
import formFactory from '../factories/form.js';

/**
 * @typedef {{
 *		toPhotographer: number,
 *		firstname: string,
 *		lastname: string,
 *		email: string,
 *		message: string,
 * }} IContactFormData
 */

export function displayModal(event = undefined, modal = undefined) {
	if (event) event.preventDefault();

	if (!modal) modal = document.getElementById('contact_modal');

	if (!modal.classList.contains('show'))
		modal.classList.add('show');
	document.body.style.overflow = 'hidden';

	modal.firstElementChild.focus();
}
export function closeModal(event = undefined, modal = undefined) {
	if (event)
		event.preventDefault();

	if (!modal)
		modal = document.getElementById('contact_modal');

	if (modal.classList.contains('show'))
		modal.classList.remove('show');
	document.body.style.overflow = 'auto';

	document.querySelector('#main > .photograph-header > .contact_button').focus();
}

/**
 * @param {IPhotographer} photographer
 * @param {(data: IContactFormData) => void} onSubmit
 * @return {HTMLDivElement}
 */
export function getContactForm(photographer, onSubmit) {
	// Open modal button element
	const modalOpenerEl = document.querySelector('.contact_button');

	// Modal inner container element
	const modalEl = document.createElement('div');
	modalEl.classList.add('modal');
	modalEl.setAttribute('tabindex', '0');
	modalEl.setAttribute('aria-labelledby', 'contact-modal-title');

	// Header element
	const modalTitleEl = document.createElement('h2');
	modalTitleEl.setAttribute('tabindex', '0');
	modalTitleEl.setAttribute('id', 'contact-modal-title');
	modalTitleEl.textContent = 'Contactez-moi ' + photographer.name;
	// Header > Title element
	const modalHeaderEl = document.createElement('header');
	modalHeaderEl.appendChild(modalTitleEl);

	// Form elements
	const formData = {
		toPhotographer: photographer.id,
		firstname: undefined,
		lastname: undefined,
		email: undefined,
		message: undefined,
	};
	const formDataElements = [
		{
			opt: {
				id: 'firstname',
				label: 'Prénom',
				type: 'text',
			},
			onChange: (value) => {
				formData.firstname = value;
			},
		},
		{
			opt: {
				id: 'lastname',
				label: 'Nom',
				type: 'text',
			},
			onChange: (value) => {
				formData.lastname = value;
			},
		},
		{
			opt: {
				id: 'email',
				label: 'Email',
				type: 'email',
			},
			onChange: (value) => {
				formData.email = value;
			},
		},
		{
			opt: {
				id: 'message',
				label: 'Votre message',
				type: 'textarea',
			},
			onChange: (value) => {
				formData.message = value;
			},
		},
	].map(({ opt, onChange }) => inputFactory().getFormData(opt, onChange));
	formDataElements[formDataElements.length - 1].input.setAttribute('rows', '6');
	const modalForm = formFactory(formDataElements);
	const modalFormEl = modalForm.getFormDOM();

	// Close button element
	const closeButtonEl = document.createElement('button');
	closeButtonEl.classList.add('close');
	closeButtonEl.setAttribute('role', 'button');
	closeButtonEl.setAttribute('aria-label', 'Close contact form');
	closeButtonEl.appendChild(iconsFactory()('close'));

	// Wrap header, form & close button elements in modalEl
	modalEl.append(modalHeaderEl, modalFormEl, closeButtonEl);

	// Bind events
	modalOpenerEl.addEventListener('click', displayModal);
	modalFormEl.addEventListener('submit', (event) => {
		event.preventDefault();
		onSubmit(formData);
	});
	closeButtonEl.addEventListener('click', closeModal);

	return modalEl;
}
