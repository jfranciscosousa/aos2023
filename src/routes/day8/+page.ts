export const ssr = false;

import { error } from '@sveltejs/kit';
import { createCardsStore } from './_store';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	try {
		return { store: await createCardsStore() };
	} catch (e) {
		throw error(500, 'Error parsing data');
	}
};
