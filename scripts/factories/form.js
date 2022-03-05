/**
 * @param {IFormData[]} inputs
 * @return {{
 *		getFormDOM: () => HTMLFormElement
 * }}
 */
export default function formFactory(inputs = []) {
	if (inputs.length === 0) throw new Error('You need to specify, at least, one input.');

	function getFormDOM() {
		const formEl = document.createElement('form');

		for (const input of inputs) {
			formEl.appendChild(input.formData);
		}

		const submitButtonEl = document.createElement('button');
		submitButtonEl.classList.add('contact_button');
		submitButtonEl.setAttribute('aria-label', 'Send');
		submitButtonEl.textContent = 'Envoyer';
		formEl.appendChild(submitButtonEl);

		return formEl;
	}

	return { getFormDOM };
}
