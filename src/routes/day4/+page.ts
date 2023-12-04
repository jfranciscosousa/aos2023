export const ssr = false;

import { error } from '@sveltejs/kit';
import { createHeartrateStore } from './_store';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	try {
		return { store: await createHeartrateStore() };
	} catch (e) {
		throw error(500, 'Error parsing data');
	}
};
