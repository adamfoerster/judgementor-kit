<script lang="ts">
	import { getEntity } from '$lib/db';
	import type { TEntity } from '$lib/models';
	import { loadingFullScreenStore, snackbarStore } from '$lib/store';
	import { onMount } from 'svelte';
	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';

	export let entity_id: string;
	let entity: TEntity;
	onMount(async () => {
		if (!entity_id) {
			snackbarStore.set('Entity ID is required');
			return;
		}
		loadingFullScreenStore.set(true);
		entity = await getEntity(entity_id);
		loadingFullScreenStore.set(false);
	});
</script>

{#if entity}
	<h3>{entity?.name}</h3>
	<br />
	<strong>Bylaws</strong>
	<br />
	<Accordion>
		{#each entity.bylaws as bylaws}
			<Panel>
				<Header>{new Date(bylaws.revision)}</Header>
				<Content>
					{#each Object.entries(bylaws.text) as article}
						<p>{article}</p>
					{/each}
				</Content>
			</Panel>
		{/each}
	</Accordion>
{/if}
