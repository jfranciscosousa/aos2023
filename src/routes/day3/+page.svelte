<script lang="ts">
	import type { PageData } from './$types';
	import ChildrenDragzone from './_ChildrenDragzone.svelte';
	import ChildrenGifts from './_ChildrenGifts.svelte';

	export let data: PageData;
	$: store = data.store;
	$: selectedWeight = Object.values($store.selected).reduce(
		(prev, curr) => (prev += curr.weight),
		0
	);
</script>

<main class="p-8">
	<h1 class="text-3xl">Day 3</h1>
	<p>Selected weight: {selectedWeight}</p>

	<button on:click={store.reset} class="btn btn-warning btn-sm">Reset</button>
	<button on:click={store.deliver} class="btn btn-secondary btn-sm">Deliver</button>

	<div class="grid grid-cols-2 mt-8 gap-6 items-baseline">
		<ChildrenDragzone onDrop={store.unselect}>
			<div class="grid grid-cols-3 gap-2 min-h-full">
				{#each Object.values($store.unselected).reverse() as children}
					<ChildrenGifts onClick={store.select} {children} {selectedWeight} />
				{/each}
			</div>
		</ChildrenDragzone>

		<ChildrenDragzone onDrop={store.select}>
			<div class="grid grid-cols-3 gap-2">
				{#each Object.values($store.selected).reverse() as children}
					<ChildrenGifts onClick={store.unselect} {children} {selectedWeight} />
				{/each}
			</div>
		</ChildrenDragzone>
	</div>
</main>
