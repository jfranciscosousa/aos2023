<script lang="ts">
	export let onDrop: (childrenId: string) => void;
</script>

<div
	class="min-h-full"
	on:drop={(event) => {
		// Ignore empty drags
		if (typeof event.dataTransfer?.getData('text/plain') !== 'string') return;

		onDrop(event.dataTransfer.getData('text/plain'));
	}}
	on:dragover={(ev) => {
		ev.preventDefault();
	}}
	role="presentation"
>
	<slot />
</div>
