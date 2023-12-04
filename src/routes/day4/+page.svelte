<script lang="ts">
	import * as echarts from 'echarts';
	import ArrowLeft from '$lib/ArrowLeft.svelte';
	import type { PageData } from './$types';
	import { onDestroy, onMount } from 'svelte';

	export let data: PageData;
	let chartEl: HTMLElement;
	let chartInstance: echarts.ECharts;

	$: store = data.store;

	onMount(() => {
		chartInstance = echarts.init(chartEl);

		store.subscribe((state) => {
			console.log('Update', state);
			chartInstance.setOption({
				dataset: {
					source: state.series,
					dimensions: ['timestamp', 'heartrate']
				},
				xAxis: {
					type: 'time'
				},
				yAxis: { min: state.min - 5, max: state.max + 5 },
				series: [
					{
						name: 'heartrate',
						type: 'line',
						encode: {
							x: 'timestamp',
							y: 'heartrate'
						},
						smooth: true
					}
				]
			});
			chartInstance.resize();
		});
	});

	onDestroy(() => store.unsubscribe());
</script>

<main class="p-8 h-screen">
	<span class="flex gap-2 items-center">
		<a href="/">
			<ArrowLeft />
		</a>
		<h1 class="text-3xl">Santa's Heart Rate Monitor</h1>
	</span>

	<div class="h-full w-full" bind:this={chartEl} />
</main>
