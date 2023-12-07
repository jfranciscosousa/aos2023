<script lang="ts">
	import ArrowLeft from '$lib/ArrowLeft.svelte';
	import { playMorseCode, toMorseCode } from './_utils';

	let input = '';

	let abortController: AbortController | undefined;
	let playing = false;

	$: morseCode = toMorseCode(input);

	async function play() {
		if (!morseCode.success || playing) return;

		abortController = new AbortController();
		await playMorseCode(morseCode.message, abortController.signal);
		abortController = undefined;
	}

	function stop() {
		if (abortController) abortController.abort();
    abortController = undefined;
	}
</script>

<main class="p-8 h-screen flex flex-col">
	<span class="flex gap-2 items-center">
		<a href="/">
			<ArrowLeft />
		</a>
		<h1 class="text-3xl">Santa's Morse Code</h1>
	</span>

	<div class="flex flex-col gap-4 grow justify-center items-center">
		<input
			placeholder="Type your message"
			aria-label="Type your message"
			class="mt-2 input input-bordered w-full max-w-xl"
			bind:value={input}
		/>

		{#if morseCode.success}
			{#if morseCode.message}
				<div class="flex gap-4 items-center">
					<p>
						Morse code: <span class="font-mono tracking-widest">{morseCode.message}</span>
					</p>

					{#if !abortController}
						<button class="btn btn-primary btn-xs" on:click={play}>Play</button>
					{:else}
						<button class="btn btn-primary btn-xs" on:click={stop}>Stop</button>
					{/if}
				</div>
			{/if}
		{:else}
			{morseCode.error}
		{/if}
	</div>
</main>
