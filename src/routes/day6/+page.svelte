<script lang="ts">
	import ArrowLeft from '$lib/ArrowLeft.svelte';

	let tapTimes: number[] = [];
	const maxTaps = 8;
	let bpm = 0;
	let iframeEl: HTMLIFrameElement;

	function handleSpaceDown() {
		const currentTime = Date.now();

		// Add the current time to the tapTimes array
		tapTimes = [...tapTimes, currentTime];

		// If we have more than maxTaps, remove the oldest one
		if (tapTimes.length > maxTaps) {
			tapTimes = tapTimes.slice(1)
		}

		// Calculate the BPM only if we have more than one tap
		if (tapTimes.length > 1) {
			const intervals = [];
			for (let i = 1; i < tapTimes.length; i++) {
				intervals.push(tapTimes[i] - tapTimes[i - 1]);
			}

			const averageInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
			bpm = 60000 / averageInterval;
		}
	}
</script>

<svelte:window
	on:keydown={(event) => {
		if (event.code === 'Space') handleSpaceDown();
	}}
/>

<main class="p-8 h-screen flex flex-col">
	<span class="flex gap-2 items-center">
		<a href="/">
			<ArrowLeft />
		</a>
		<h1 class="text-3xl">Mistletoe Metronome</h1>
	</span>

	<div class="w-full grow flex items-center justify-center flex-col">
		<div class="shadow-xl mb-8">
			{#if tapTimes.length > 0}
				<iframe
					title="Music!"
					width="900"
					height="500"
					src="https://www.youtube.com/embed/NBo98gJkrP4?controls=0&disablekb=1&autoplay=1"
					frameborder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					allowfullscreen
					class="pointer-events-none rounded-3xl"
					bind:this={iframeEl}
				/>
			{:else}
				<div
					class="h-[500px] w-[900px] bg-slate-800 rounded-3xl flex items-center justify-center text-center"
				>
					Music will start playing as soon as you start tapping!
				</div>
			{/if}
		</div>

		<div class="text-center" autofocus>
			<p>Hit the spacebar to start!</p>
			<p class="text-2xl">BPM: {Math.round(bpm)}</p>
		</div>
	</div>
</main>
