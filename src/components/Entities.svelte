<script lang="ts">
	import { getEntities } from '$lib/db';
	import { loadingFullScreenStore } from '$lib/store';
	import { onMount } from 'svelte';
	import { guardRouteOnlyLogged } from '$lib/user';
	import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
	import type { TEntity } from '$lib/models';

	export let entities: TEntity[] = [];

	onMount(async () => {
		await loadEntities();
	});

	const loadEntities = async () => {
		loadingFullScreenStore.set(true);
		guardRouteOnlyLogged.subscribe(async (logged) => {
			if (!logged) return;
			entities = await getEntities();
			loadingFullScreenStore.set(false);
		});
	};
</script>

<DataTable stickyHeader table$aria-label="Entities list" style="width: 100%;">
	<Head>
		<Row>
			<Cell>Entities</Cell>
		</Row>
	</Head>
	<Body>
		{#each entities as item (item.id)}
			<Row>
				<Cell><a href="/entities/{item.id}">{item.name}</a></Cell>
			</Row>
		{/each}
	</Body>
</DataTable>
