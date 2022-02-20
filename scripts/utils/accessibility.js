const defaultInitialTabIndex = 1;

export default function init(initialTabIndex = defaultInitialTabIndex, indexesToSkip = []) {
	let tabIndex = initialTabIndex;
	if (typeof initialTabIndex !== 'number' || isNaN(initialTabIndex))
		tabIndex = defaultInitialTabIndex;

	function useTabIndex() {
		const lastIndex = tabIndex;
		do {
			++tabIndex;
		} while(indexesToSkip.includes(tabIndex) || tabIndex <= lastIndex);
		// return tabIndex.toString(10);
		return '0';
	}

	window.useTabIndex = useTabIndex.bind(this);
}
