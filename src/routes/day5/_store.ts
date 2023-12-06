import _ from 'lodash';
import { writable } from 'svelte/store';
import z from 'zod';
import { createZodFetcher } from 'zod-fetch';

const fetchWithZod = createZodFetcher();

const taskSchema = z.object({
	elf: z.string(),
	task: z.enum(['WRAPPED_PRESENT', 'CREATED_TOY']),
	minutesTaken: z.number(),
	date: z.string().transform((d) => new Date(d))
});

function fetchTasks() {
	return fetchWithZod(
		z.array(taskSchema),
		'https://advent.sveltesociety.dev/data/2023/day-five.json'
	);
}

export type Results = {
	presentsWrappedPerHour: number;
	toysCreatedPerHour: number;
	averageToyCreationTime: number;
	averagePresentWrappingTime: number;
	tasksCompleted: number;
	tasksPerHour: number;
};

export const RESULT_KEYS = [
	['presentsWrappedPerHour', 'Wraps/hr'],
	['toysCreatedPerHour', 'Toys/hr'],
	['averageToyCreationTime', 'Avg toy time'],
	['averagePresentWrappingTime', 'Avg wrap time'],
	['tasksCompleted', 'Tasks completed'],
	['tasksPerHour', 'Tasks/hr']
] as const;

type Database =
	| {
			byElf: Record<string, Results>;
			totals: Results;
	  }
	| undefined;

export async function createHeartrateStore() {
	const { subscribe, update } = writable<Database>(undefined);
	const interval = setInterval(async () => {
		const tasks = await fetchTasks();
		const grouppedByElf = _.groupBy(tasks, 'elf');
		const toyTime = _.meanBy(
			tasks.filter((t) => t.task === 'CREATED_TOY'),
			'minutesTaken'
		);
		const wrapTime = _.meanBy(
			tasks.filter((t) => t.task === 'WRAPPED_PRESENT'),
			'minutesTaken'
		);

		update(() => ({
			byElf: _.transform(grouppedByElf, (result, value, key) => {
				const toyTime = _.meanBy(
					value.filter((t) => t.task === 'CREATED_TOY'),
					'minutesTaken'
				);
				const wrapTime = _.meanBy(
					value.filter((t) => t.task === 'WRAPPED_PRESENT'),
					'minutesTaken'
				);

				result[key] = {
					presentsWrappedPerHour: 60 / wrapTime,
					toysCreatedPerHour: 60 / toyTime,
					tasksPerHour: 60 / wrapTime + 60 / toyTime,
					averageToyCreationTime: toyTime,
					averagePresentWrappingTime: wrapTime,
					tasksCompleted: value.length
				};
			}),
			totals: {
				presentsWrappedPerHour: 60 / wrapTime,
				toysCreatedPerHour: 60 / toyTime,
				averageToyCreationTime: toyTime,
				averagePresentWrappingTime: wrapTime,
				tasksCompleted: tasks.length,
				tasksPerHour: 60 / wrapTime + 60 / toyTime
			}
		}));
	}, 1000);

	function unsubscribe() {
		clearInterval(interval);
	}

	return { subscribe, unsubscribe };
}
