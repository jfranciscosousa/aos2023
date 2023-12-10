<script lang="ts">
	import ArrowLeft from '$lib/ArrowLeft.svelte';
	import { onMount } from 'svelte';

	let modalEl: HTMLDialogElement;

	onMount(() => {
		setTimeout(() => {
			modalEl.showModal();
		}, 1500);
	});
</script>

<main class="p-8 h-screen flex flex-col">
	<span class="flex gap-2 items-center">
		<a href="/">
			<ArrowLeft />
		</a>
		<h1 class="text-3xl">Santa's Popup</h1>
	</span>

	<div class="grow flex items-center justify-center">
		<button
			class="btn btn-primary"
			on:click={() => {
				modalEl.showModal();
			}}
		>
			Show popup!
		</button>
	</div>

	<dialog bind:this={modalEl} class="modal">
		<div class="modal-box flex flex-col items-center">
			<img class="w-32" alt="Santa Claus" src="/santa-popup.png" />

			<p class="py-4 mt-6 text-lg">Santa wishes you a merry christmas!</p>

			<div class="modal-action">
				<form method="dialog">
					<button class="btn">Close</button>
				</form>
			</div>
		</div>
	</dialog>
</main>
