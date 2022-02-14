export async function getData() {
	const res = await fetch('data/photographers.json');
	const json = await res.json();

	return {
		photographers: [...json.photographers],
		medias: [...json.media],
	};
}
