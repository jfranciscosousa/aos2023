import { writable } from 'svelte/store';
import { z } from 'zod';
import { createZodFetcher } from 'zod-fetch';

const STORAGE_KEY = 'advent-of-code-day-3';
const fetchWithZod = createZodFetcher();

export type ChildrenGifts = {
	id: string;
	name: string;
	weight: number;
};

type Database = {
	unselected: Record<string, ChildrenGifts>;
	selected: Record<string, ChildrenGifts>;
};

function randomId(): string {
	const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0];
	return uint32.toString(16);
}

function loadFromStorage() {
	const itemFromStorage = localStorage.getItem(STORAGE_KEY);

	if (!itemFromStorage) return;

	return z
		.object({
			unselected: z.record(
				z.string(),
				z.object({
					id: z.string(),
					name: z.string(),
					weight: z.number()
				})
			),
			selected: z.record(
				z.string(),
				z.object({
					id: z.string(),
					name: z.string(),
					weight: z.number()
				})
			)
		})
		.parse(JSON.parse(itemFromStorage));
}

async function loadInitialData({ reset = false } = {}) {
	const fromStorage = loadFromStorage();

	if (!reset && fromStorage) return fromStorage;

	const childrenPresents = await fetchWithZod(
		z.array(
			z.object({
				name: z.string(),
				weight: z.number()
			})
		),
		'https://advent.sveltesociety.dev/data/2023/day-three.json'
	);
	const database: Database = { unselected: {}, selected: {} };

	childrenPresents.forEach((child) => {
		const id = randomId();
		database.unselected[id] = { ...child, id };
	});

	return database;
}

export async function createChildrenStore() {
	const initialData = await loadInitialData();
	const { subscribe, set, update } = writable<Database>(initialData);

	// Keep syncing the state to local storage
	subscribe((state) => localStorage.setItem(STORAGE_KEY, JSON.stringify(state)));

	return {
		subscribe,
		select: (id: string) =>
			update((database) => {
				const child = database.unselected[id];
				const newUnselected = database.unselected;

				delete newUnselected[id];

				if (child)
					return {
						unselected: newUnselected,
						selected: { ...database.selected, [child.id]: child }
					};
				else return database;
			}),
		unselect: (id: string) =>
			update((database) => {
				const child = database.selected[id];
				const newSelected = database.selected;

				delete newSelected[id];

				if (child)
					return {
						selected: newSelected,
						unselected: { ...database.unselected, [child.id]: child }
					};
				else return database;
			}),
		deliver: () => update((database) => ({ selected: {}, unselected: database.unselected })),
		reset: async () => set(await loadInitialData({ reset: true }))
	};
}
