const defaultInitialTabIndex = 1;

export default function init(initialTabIndex = 1) {
	let tabIndex = typeof initialTabIndex === 'number' && !isNaN(initialTabIndex)
				   ? initialTabIndex
				   : defaultInitialTabIndex;

	function useTabIndex() {
		return (++tabIndex).toString(10);
	}

	window.useTabIndex = useTabIndex.bind(this);
}
