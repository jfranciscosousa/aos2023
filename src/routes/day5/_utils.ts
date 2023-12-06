import z from 'zod';
import { createZodFetcher } from 'zod-fetch';

const fetchWithZod = createZodFetcher();

export function fetchHeartRate() {
	return fetchWithZod(
		z.object({ heartRate: z.number() }),
		'https://advent.sveltesociety.dev/data/2023/day-four.json'
	);
}