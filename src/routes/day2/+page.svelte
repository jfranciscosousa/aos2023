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
	$: totalCookies = Object.values($store).reduce((prev, curr) => (prev += curr.tally), 0);

	function handleNewChild(event: Event & { currentTarget: HTMLFormElement }) {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);

		store.add(formData.get('name') as string);

		event.currentTarget.reset();
	}
</script>

<main class="p-8">
	<span class="flex gap-2 items-center">
		<a href="/">
			<ArrowLeft />
		</a>
		<h1 class="text-3xl">Santa's cookie counter</h1>
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
			<b>Total cookies: {totalCookies}</b>

			<button on:click={store.reset} class="btn btn-warning btn-sm">Reset</button>
		</div>
	</div>

	<div class="grid grid-cols-4 gap-4 max-h-[70vh] overflow-auto my-8">
		{#each filteredChildren as child (child.id)}
			<div class="flex card shadow-xl bg-slate-800 p-2">
				<p class="card-title">{child.name}</p>

				<p>Tally: {child.tally}</p>

				<div class="mt-4 card-actions justify-between">
					<div>
						<button class="pointer btn btn-xs btn-error" on:click={() => store.remove(child.id)}>
							Remove
						</button>
						<button
							class="pointer btn btn-xs btn-warning"
							on:click={() => store.resetTally(child.id)}
						>
							Reset
						</button>
					</div>

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

	<form on:submit={handleNewChild}>
		<label class="form-control w-full max-w-md">
			<div class="label">
				<span class="label-text">Add new children</span>
			</div>

			<div class="flex gap-2">
				<input
					type="text"
					name="name"
					placeholder="Type new children name here..."
					class="input input-bordered w-full max-w-xs"
					required
				/>

				<button class="btn btn-primary">Add</button>
			</div>
		</label>
	</form>
</main>
