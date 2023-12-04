import { writable } from 'svelte/store';
import z from 'zod';
import { createZodFetcher } from 'zod-fetch';

const fetchWithZod = createZodFetcher();

function fetchHr() {
	return fetchWithZod(
		z.object({ heartRate: z.number() }),
		'https://advent.sveltesociety.dev/data/2023/day-four.json'
	);
}

type Database = { series: [Date, number][]; min: number; max: number };

export async function createHeartrateStore() {
	const { subscribe, update } = writable<Database>({ series: [], min: 110, max: 120 });
	const interval = setInterval(async () => {
		const { heartRate } = await fetchHr();

		update((db) => ({
			series: [...db.series, [new Date(), heartRate]],
			min: heartRate < db.min ? heartRate : db.min,
      max: heartRate > db.max ? heartRate : db.max
		}));
	}, 1000);

	function unsubscribe() {
		clearInterval(interval);
	}

	return { subscribe, unsubscribe };
}
