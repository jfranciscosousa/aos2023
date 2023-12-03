import { randomId } from '$lib/utils';
import { writable } from 'svelte/store';
import z from 'zod';
import { createZodFetcher } from 'zod-fetch';

const fetchWithZod = createZodFetcher();

const STORAGE_KEY = 'advent-of-code-day-2';

export type ChildrenWithTally = {
	id: string;
	name: string;
	tally: number;
};
type Database = Record<string, ChildrenWithTally>;

async function initialData() {
	const childrenTallies = await fetchWithZod(
		z.array(
			z.object({
				name: z.string(),
				tally: z.number()
			})
		),
		'https://advent.sveltesociety.dev/data/2023/day-one.json' // Yes, same data as day 1
	);
	// Give it some IDs based on their position
	const dataInObjectFormat: Database = {};

	childrenTallies.forEach((child) => {
		const id = randomId();

		dataInObjectFormat[id] = { ...child, id, tally: 0 };
	});

	return dataInObjectFormat;
}

async function loadData({ reset = false } = {}) {
	if (reset) localStorage.removeItem(STORAGE_KEY);
	const unparsedData = localStorage.getItem(STORAGE_KEY);
	// Let's assume that what we have on the storage has the right format. Not suitable for production
	const data: Database = unparsedData
		? z
				.record(
					z.string(),
					z.object({
						id: z.string(),
						name: z.string(),
						tally: z.number()
					})
				)
				.parse(JSON.parse(unparsedData))
		: await initialData();

	return data;
}

export async function createChildrenStore() {
	const { subscribe, set, update } = writable<Database>(await loadData());

	// Keep syncing the state to local storage
	subscribe((state) => localStorage.setItem(STORAGE_KEY, JSON.stringify(state)));

	return {
		subscribe,
		increaseTally: (id: string) =>
			update((children) => {
				const child = children[id];

				if (child) return { ...children, [id]: { ...child, tally: child.tally + 1 } };
				else return children;
			}),
		decreaseTally: (id: string) =>
			update((children) => {
				const child = children[id];

				if (child && child.tally > 0)
					return { ...children, [id]: { ...child, tally: child.tally - 1 } };
				else return children;
			}),
		resetTally: (id: string) =>
			update((children) => {
				const child = children[id];

				if (child) return { ...children, [id]: { ...child, tally: 0 } };
				else return children;
			}),
		remove: (id: string) =>
			update((children) => {
				const newChildren = { ...children };

				delete newChildren[id];

				return newChildren;
			}),
		add: (name: string) =>
			update((children) => {
				const id = randomId();

				return { ...children, [id]: { id, name, tally: 0 } };
			}),
		reset: async () => set(await loadData({ reset: true }))
	};
}
