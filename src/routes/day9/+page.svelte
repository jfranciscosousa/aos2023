<script lang="ts">
	import ArrowLeft from '$lib/ArrowLeft.svelte';
	import { intervalToDuration } from 'date-fns';
	import { onDestroy, onMount } from 'svelte';

	const getDurationUntilChristmasEve = () =>
		intervalToDuration({
			start: new Date(),
			end: CHRISTMAS_EVE
		});

	const singularOrPlural = (count: number, singular: string, plural: string) =>
		count === 1 ? singular : plural;

	const CHRISTMAS_EVE = new Date('2023-12-25 00:00');

	let duration = getDurationUntilChristmasEve();
	let interval: number;

	$: console.log(duration);

	onMount(() => {
		interval = setInterval(() => {
			duration = getDurationUntilChristmasEve();
		}, 1000);
	});

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<main class="p-8 h-screen flex flex-col">
	<span class="flex gap-2 items-center">
		<a href="/">
			<ArrowLeft />
		</a>
		<h1 class="text-3xl">Santa's Countdown to Christmas Eve</h1>
	</span>

	<div class="grow flex items-center justify-center">
		<div class="shadow-xl rounded-xl max-w-5xl bg-slate-800 flex flex-col gap-4 items-center justify-center p-8">
			<p class="text-xl">There are:</p>

			<div class="flex gap-8 tabular-nums text-4xl">
				<p>{duration.days || 0} {singularOrPlural(duration.days || 0, 'days', 'days')}</p>
				<p>{duration.hours || 0} {singularOrPlural(duration.hours || 0, 'hours', 'hours')}</p>
				<p>{duration.minutes || 0} {singularOrPlural(duration.minutes || 0, 'minutes', 'minutes')}</p>
				<p>{duration.seconds || 0} {singularOrPlural(duration.seconds || 0, 'seconds', 'seconds')}</p>
			</div>

			<p class="text-xl">Until christmas!</p>
		</div>
	</div>
</main>
