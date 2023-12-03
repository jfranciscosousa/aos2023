<script lang="ts">
	import type { ChildrenGifts } from './_store';

	export let children: ChildrenGifts;
	export let onClick: (id: string) => void;
	export let selectedWeight: number;
</script>

<button
	data-id={children.id}
	draggable="true"
	class="btn btn-sm btn-primary"
	class:btn-disabled={selectedWeight + children.weight > 100}
	on:click={() => onClick(children.id)}
	on:dragstart={(event) => event.dataTransfer?.setData('text/plain', children.id)}
>
	<p>{children.name}</p>
</button>
