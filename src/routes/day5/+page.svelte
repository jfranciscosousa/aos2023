<script lang="ts">
	import ArrowLeft from '$lib/ArrowLeft.svelte';
	import _, { sortBy } from 'lodash';
	import { onDestroy } from 'svelte';
	import type { PageData } from './$types';
	import { fade } from 'svelte/transition';
	import Loading from '$lib/Loading.svelte';
	import { RESULT_KEYS, type Results } from './_store';

	export let data: PageData;
	let search = '';
	let sort: [keyof Results, 'desc' | 'asc'] | undefined;

	$: store = data.store;
	$: elfEntries = _.chain(Object.entries($store?.byElf || {}))
		.filter(([elf]) => elf.toLowerCase().includes(search.toLowerCase()))
		.orderBy(`[1].${sort?.[0]}`, sort?.[1])
		.value();

	$: console.log(sort);

	onDestroy(() => store.unsubscribe());
</script>

<main class="p-8 h-screen">
	<span class="flex gap-2 items-center">
		<a href="/">
			<ArrowLeft />
		</a>
		<h1 class="text-3xl">Santa's Production Monitor</h1>
	</span>

	{#if $store}
		<div in:fade={{ delay: 250 }}>
			<div class="mt-4 flex items-center justify-between">
				<div>
					<p>Toys created per hour: {$store.totals.toysCreatedPerHour.toFixed(2)}</p>
					<p>Presets wrapped per hour: {$store.totals.presentsWrappedPerHour.toFixed(2)}</p>
					<p>Avg wrap time: {$store.totals.averagePresentWrappingTime.toFixed(2)}</p>
					<p>Avg toy time: {$store.totals.averageToyCreationTime.toFixed(2)}</p>
				</div>
			</div>

			<div class="mt-4 flex items-center justify-between">
				<div class="flex gap-1">
					{#each RESULT_KEYS as resultKey}
						<button
							class="btn btn-sm btn-primary"
							on:click={() => {
								if (sort && sort[0] === resultKey[0] && sort[1] === 'asc')
									sort = [resultKey[0], 'desc'];
								else if (sort && sort[0] === resultKey[0] && sort[1] === 'desc') sort = undefined;
								else sort = [resultKey[0], 'asc'];
							}}
						>
							{resultKey[1]}

							{#if sort?.[0] === resultKey[0]}
								{sort[1]}
							{/if}
						</button>
					{/each}
				</div>
				<input
					type="text"
					placeholder="Search elfs here..."
					class="mt-2 input input-bordered w-full max-w-xs"
					aria-label="Search elfs here..."
					bind:value={search}
				/>
			</div>

			<div class="grid grid-cols-4 mt-4 gap-4">
				{#each elfEntries as [elf, results]}
					<div class="card p-4 bg-slate-800">
						{elf}

						<div class="mt-2">
							<p>{results.toysCreatedPerHour.toFixed(2)} toys/hr</p>
							<p>{results.presentsWrappedPerHour.toFixed(2)} wraps/hr</p>
							<p>{results.tasksPerHour.toFixed(2)} tasks/hr</p>
							<p>Avg {results.averageToyCreationTime.toFixed(2)} toy time</p>
							<p>Avg {results.averagePresentWrappingTime.toFixed(2)} tasks time</p>
							<p>{results.tasksCompleted} tasks completed</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<div class="h-full w-full flex items-center justify-center" out:fade={{ duration: 200 }}>
			<Loading class="w-48 h-48" />
		</div>
	{/if}
</main>
