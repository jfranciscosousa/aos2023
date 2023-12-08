<script lang="ts">
	import ArrowLeft from '$lib/ArrowLeft.svelte';
	import { formatDuration } from 'date-fns';
	import min from 'lodash/min';
	import type { PageData } from './$types';

	export let data: PageData;
	let modalEl: HTMLDialogElement;
	$: store = data.store;

	$: {
		if ($store.score && modalEl) modalEl.showModal();
	}
</script>

<main class="p-8 h-screen flex flex-col">
	<span class="flex gap-2 items-center">
		<a href="/">
			<ArrowLeft />
		</a>
		<h1 class="text-3xl">Santa's Memory Game</h1>
	</span>

	<p>Best score yet: {min($store.previousScores)}</p>

	<dialog bind:this={modalEl} class="modal">
		<div class="modal-box">
			<h3 class="font-bold text-lg">Congratulations!</h3>
			<p class="py-4">
				You finished the puzzle in {formatDuration({ seconds: $store.score })}
			</p>
			<div class="modal-action">
				<form method="dialog">
					<!-- if there is a button in form, it will close the modal -->
					<button class="btn">Close</button>
				</form>
			</div>
		</div>
	</dialog>

	{#if $store.startTimestamp}
		<button class="btn btn-primary w-[300px] my-6" on:click={store.startGame}>Reset</button>

		<div class="grid grid-cols-12 gap-4">
			{#each $store.cards as card, index}
				<button
					class="aspect-[1/2] relative"
					on:click={() => store.flipCard(index)}
					disabled={card.completed}
				>
					{#if card.completed}
						<div
							class="rounded-3xl h-full w-full absolute bg-slate-900 bg-opacity-75 flex items-center justify-center"
						>
							<p class="font-bold">Done</p>
						</div>
					{:else if index !== $store.flippedCardIndex1 && index !== $store.flippedCardIndex2}
						<div
							class="rounded-3xl h-full w-full absolute bg-slate-900 flex items-center justify-center"
						>
							{#if import.meta.env.DEV}
								<span class="text-xl" data-cheats="true">{card.number}</span>
							{/if}
						</div>
					{:else if $store.flippedCardIndex1 && $store.flippedCardIndex2}
						<div
							class="rounded-3xl h-full w-full absolute bg-red-900 bg-opacity-80 flex items-center justify-center"
						>
							<p class="font-bold">Try again!</p>
						</div>
					{/if}

					<img
						alt="Card number {card}"
						class="rounded-3xl h-full w-full"
						src="https://advent.sveltesociety.dev/data/2023/day-eight/{card.number}.png"
					/>
				</button>
			{/each}
		</div>
	{:else}
		<button class="btn btn-primary w-[300px]" on:click={store.startGame}>Start game!</button>
	{/if}
</main>
