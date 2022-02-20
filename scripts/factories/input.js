const defaultCallbacks = {
	onSuccess: (data) => console.log('[DEFAULT][FORM] onSuccess', data),
	onError  : (error) => console.error('[DEFAULT][FORM] onError', error),
};

/**
 * @typedef {'button' | 'checkbox' | 'color' | 'date' | 'email' | 'file' | 'hidden' | 'image' | 'month' | 'number' | 'password' | 'radio' | 'range' | 'reset' | 'search' | 'submit' | 'tel' | 'text' | 'time' | 'url' | 'week'} HTMLInputType
 * @typedef {HTMLInputType | 'textarea' | 'select'} FormDataType
 *
 * @typedef {(newValue: any, oldValue?: any) => boolean} ChangeCallback
 * @typedef {{
 *		name: string,
 *		value: any
 * }} ISelectOption
 * @typedef {{
 *		id: string,
 *		label: string,
 *		type: FormDataType,
 *		defaultValue?: any,
 *		options?: ISelectOption[]
 * }} FormDataOptions
 * @typedef {Omit<FormDataOptions, 'options'> & Required<Pick<FormDataOptions, 'options'>>} SelectFormDataOptions
 * @typedef {{
 *     formData: HTMLDivElement,
 *     label: HTMLLabelElement,
 *     input: HTMLInputElement | HTMLTextAreaElement | HTMLDivElement
 * }} IFormData
 */

/**
 * @return {{
 *		getListBoxDOM: (id: string, label: string, options: ISelectOption[], ChangeCallback) => {
 *			listbox: HTMLDivElement,
 *			label: HTMLLabelElement
 *		},
 *		getFormData: (opt: FormDataOptions, ChangeCallback) => {
 *			formData: HTMLDivElement,
 *			label: HTMLLabelElement,
 *			input: (HTMLInputElement|HTMLTextAreaElement)
 *		}
 * }}
 */
export default function inputFactory() {
	/**
	 * @param {string} id
	 * @param {string} label
	 * @param {ISelectOption[]} options
	 * @param {ChangeCallback} onChange
	 * @return {{listbox: HTMLDivElement, label: HTMLLabelElement}}
	 */
	function getListBoxDOM(id, label, options, onChange) {
		const labelEl = document.createElement('label');
		labelEl.classList.add('combo-label');
		labelEl.setAttribute('id', 'listbox-' + id + '-label');
		labelEl.setAttribute('tabindex', window.useTabIndex());
		labelEl.textContent = label;

		const comboEl = document.createElement('div');
		comboEl.classList.add('combo');

		const comboboxEl = document.createElement('div');
		comboboxEl.classList.add('combo-input');
		comboboxEl.setAttribute('id', 'listbox-' + id);
		comboboxEl.setAttribute('role', 'combobox');
		comboboxEl.setAttribute('aria-controls', 'listbox-' + id + '-menu');
		comboboxEl.setAttribute('aria-expanded', 'false');
		comboboxEl.setAttribute('aria-haspopup', 'listbox');
		comboboxEl.setAttribute('aria-labelledby', 'listbox-' + id + '-label');
		comboboxEl.setAttribute('tabindex', window.useTabIndex());
		comboboxEl.textContent = options[0].name;

		const listboxEl = document.createElement('div');
		listboxEl.classList.add('combo-menu');
		listboxEl.setAttribute('id', 'listbox-' + id + '-menu');
		listboxEl.setAttribute('role', 'listbox');
		listboxEl.setAttribute('aria-labelledby', 'listbox-' + id + '-label');
		listboxEl.setAttribute('tabindex', window.useTabIndex());

		function focusCurrent() {
			const actual = listboxEl.querySelector('.current-selected');
			if (actual) actual.focus();
		}
		function toggleListbox() {
			comboEl.classList.toggle('open');
			if (comboEl.classList.contains('open')) {
				focusCurrent();
			}
		}
		function openListbox() {
			if (!comboEl.classList.contains('open')) {
				comboEl.classList.add('open');
				focusCurrent();
			}
		}
		function closeListbox() {
			if (comboEl.classList.contains('open'))
				comboEl.classList.remove('open');
		}
		function clearOptions() {
			for (const child of listboxEl.childNodes) {
				child.classList.remove('current-selected');
				child.setAttribute('aria-selected', 'false');
			}
		}
		function selectOption(option) {
			const opt = options.find((opt) => opt.value === option.dataset.value);
			if (!opt) return;

			let oldValue, newValue;
			listboxEl.childNodes.forEach((child) => {
				if (child.textContent === opt.name) {
					// CHOOSED
					newValue = child.dataset.value;
				}
				if (child.classList.contains('current-selected')) {
					// SELECTED
					oldValue = child.dataset.value;
				}
			});

			if (onChange(newValue, oldValue)) {
				clearOptions();

				option.classList.add('current-selected');
				option.setAttribute('aria-selected', 'true');
				comboboxEl.textContent = option.textContent;
			} else {
				console.log('Not rendering medias again because filter has not changed');
			}

			closeListbox();
		}
		function nextOption(idx) {
			const nextIdx = idx >= options.length - 1 ? 0 : (idx + 1);
			const el = listboxEl.childNodes[nextIdx];
			if (el) el.focus();
		}
		function prevOption(idx) {
			const prevIdx = idx <= 0 ? (options.length - 1) : (idx - 1);
			const el = listboxEl.childNodes[prevIdx];
			if (el) el.focus();
		}

		for (const i in options) {
			const { name, value } = options[i];

			const optionEl = document.createElement('div');
			optionEl.classList.add('combo-option');
			optionEl.setAttribute('id', 'listbox-' + id + '-item-' + (i + 1));
			optionEl.setAttribute('role', 'option');
			optionEl.setAttribute('tabindex', window.useTabIndex());
			optionEl.dataset.value = value;
			optionEl.textContent   = name;
			optionEl.addEventListener('click', (event) => selectOption(event.currentTarget));
			optionEl.addEventListener('keypress', (event) => {
				console.log('OPT LISTENER');
				event.preventDefault();
				const { code } = event;

				switch (code) {
					case 'ArrowUp':
						prevOption(i);
						break;
					case 'ArrowDown':
						nextOption(i);
						break;
					case 'Enter':
						if (event.currentTarget.classList.contains('combo-option'))
							selectOption(event.currentTarget);
						break;
					default:
						console.log('Doing nothing for key :', code);
						break;
				}

				// Focus again combo-input
				event.currentTarget.parentElement.previousElementSibling.focus();
			});

			listboxEl.appendChild(optionEl);
		}

		selectOption(listboxEl.childNodes[0]);

		comboEl.appendChild(comboboxEl);
		comboEl.appendChild(listboxEl);

		comboboxEl.addEventListener('click', toggleListbox);
		comboboxEl.addEventListener('keypress', (event) => {
			const { code } = event;
			switch (code) {
				case 'Enter':
					if (!event.currentTarget.classList.contains('combo-option'))
						return openListbox();
					break;
				case 'Space':
					event.preventDefault();
					return openListbox();
				default:
					console.log('CODE :', code);
					break;
			}
		});

		return { label: labelEl, listbox: comboEl };
	}

	/**
	 * @param {FormDataOptions} opt
	 * @param {(newValue: any, oldValue?: any) => boolean} onChange
	 * @return {{
	 * 		formData: HTMLDivElement,
	 * 		label: HTMLLabelElement,
	 * 		input: HTMLInputElement | HTMLTextAreaElement | HTMLDivElement
	 * }}
	 */
	function getFormData(opt, onChange) {
		let { id, label, type, defaultValue, options } = opt;

		if (!type) type = 'text';
		if (!defaultValue) defaultValue = '';

		const containerEl = document.createElement('div');
		containerEl.classList.add('formData');

		const labelEl = document.createElement('label');
		labelEl.setAttribute('for', id);
		labelEl.textContent = label;
		labelEl.setAttribute('tabindex', window.useTabIndex());

		if (type === 'select') {
			const { label, listbox } = getListBoxDOM(opt.id, opt.label, opt.options || [], onChange);
			containerEl.appendChild(label);
			containerEl.appendChild(listbox);

			return {
				formData: containerEl,
				input   : listbox,
				label   : label,
			};
		}

		let inputEl;
		switch (type) {
			case 'textarea':
				inputEl = document.createElement('textarea');
				break;
			case 'button':
			case 'checkbox':
			case 'color':
			case 'date':
			case 'email':
			case 'file':
			case 'hidden':
			case 'image':
			case 'month':
			case 'number':
			case 'password':
			case 'radio':
			case 'range':
			case 'reset':
			case 'search':
			case 'submit':
			case 'tel':
			case 'text':
			case 'time':
			case 'url':
			case 'week':
				inputEl = document.createElement('input');
				break;
			default:
				throw new Error(`Unknown 'type' HTML Input tag attribute value (${type})!`);
		}

		inputEl.setAttribute('id', id);
		inputEl.setAttribute('name', id);
		inputEl.setAttribute('value', defaultValue);
		inputEl.setAttribute('tabindex', window.useTabIndex());

		inputEl.addEventListener('change', (event) => onChange(event.currentTarget.value));

		containerEl.appendChild(labelEl);
		containerEl.appendChild(inputEl);

		return {
			formData: containerEl,
			label   : labelEl,
			input   : inputEl,
		};
	}

	return { getFormData, getListBoxDOM };
}
