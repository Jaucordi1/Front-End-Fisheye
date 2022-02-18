/**
 * @typedef {'close'} Icons
 * @typedef {{
 *     width: number,
 *     height: number,
 *     path: string,
 *     viewBox?: string,
 *     xmlns?: string,
 *     pathFillColor?: string
 * }} Icon
 */

/**
 * @type {{[key in Icons]: Icon}}
 */
const icons = {
	close: {
		width: 42,
		height: 42,
		path: 'M42 4.23L37.77 0L21 16.77L4.23 0L0 4.23L16.77 21L0 37.77L4.23 42L21 25.23L37.77 42L42 37.77L25.23 21L42 4.23Z'
	}
};

const defaultXmlns = 'http://www.w3.org/2000/svg';

/**
 * @return {(name: Icons) => SVGSVGElement}
 */
export default function iconsFactory() {
	/**
	 * @param {number} width
	 * @param {number} height
	 * @param {string | undefined} viewBox
	 * @param {string | undefined} xmlns
	 * @return {SVGSVGElement}
	 */
	function getSVGDOM(width, height, viewBox = undefined, xmlns = undefined) {
		const svgEl = document.createElementNS(xmlns || defaultXmlns, 'svg');
		svgEl.setAttribute('width', width.toString(10));
		svgEl.setAttribute('height', height.toString(10));
		svgEl.setAttribute('viewBox', viewBox || `0 0 ${width} ${height}`);
		svgEl.setAttribute('xmlns', xmlns || defaultXmlns);

		return svgEl;
	}

	/**
	 * @param {string} svgns
	 * @param {string} d
	 * @param {string | undefined} fill
	 * @return {HTMLElement}
	 */
	function getSVGPathDOM(svgns, d, fill = undefined) {
		const pathEl = document.createElementNS(svgns, 'path');
		pathEl.setAttribute('fill', fill || 'currentColor');
		pathEl.setAttribute('d', d);

		return pathEl;
	}

	/**
	 * @param {Icon} icon
	 */
	function getIconDOM({ width, height, viewBox, xmlns, pathFillColor, path }) {
		const svgEl = getSVGDOM(width, height, viewBox, xmlns);
		svgEl.style.width = `${width}px`;
		svgEl.style.height = `${height}px`;

		const pathEl = getSVGPathDOM(svgEl.namespaceURI, path, pathFillColor);
		svgEl.appendChild(pathEl);

		return svgEl;
	}

	/**
	 * @param {Icons} name
	 */
	function getIconByName(name) {
		switch (name) {
			case 'close':
				return getIconDOM(icons[name]);
			default:
				throw new Error(`Icon '${name}' does NOT exists!`);
		}
	}

	return getIconByName;
}
