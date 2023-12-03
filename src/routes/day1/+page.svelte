<script lang="ts">
	import ArrowLeft from '$lib/ArrowLeft.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	let search = '';
	$: store = data.store;
	$: children = Object.values($store);
	$: filteredChildren = children
		.filter((child) => child.name.toLowerCase().includes(search.toLowerCase()))
		.reverse();
</script>

<main class="p-8">
	<span class="flex gap-2 items-center">
		<a href="/">
			<ArrowLeft />
		</a>
		<h1 class="text-3xl">Santa's naughty list</h1>
	</span>

	<div class="flex justify-between items-center">
		<input
			type="text"
			placeholder="Search children here..."
			class="mt-2 input input-bordered w-full max-w-xs"
			aria-label="Search children here..."
			bind:value={search}
		/>

		<div class="mt-4 flex gap-2 items-center">
			<button on:click={store.reset} class="btn btn-warning btn-sm">Reset</button>
		</div>
	</div>

	<div class="grid grid-cols-4 gap-4 max-h-[80vh] overflow-auto my-8">
		{#each filteredChildren as child (child.id)}
			<div class="flex card shadow-xl bg-slate-800 p-2">
				<p class="card-title">{child.name}</p>

				<p>Tally: {child.tally}</p>

				<div class="mt-4 card-actions justify-between">
					<button
						class="pointer btn btn-xs btn-warning"
						on:click={() => store.resetTally(child.id)}
					>
						Reset
					</button>

					<div>
						<button
							class="pointer btn btn-xs btn-primary"
							on:click={() => store.increaseTally(child.id)}
						>
							+
						</button>
						<button
							class="pointer btn btn-xs btn-primary"
							on:click={() => store.decreaseTally(child.id)}
						>
							-
						</button>
					</div>
				</div>
			</div>
		{/each}
	</div>
</main>
