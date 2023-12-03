export const ssr = false;

import { error } from '@sveltejs/kit';
import { createChildrenStore } from './_store';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	try {
		return { store: await createChildrenStore() };
	} catch (e) {
		throw error(500, 'Error parsing data');
	}
}
