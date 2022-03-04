<script lang="ts">
	import { guardRouteOnlyLogged } from '$lib/user';
	import Textfield from '@smui/textfield';
	import { onMount } from 'svelte';
	import { loadingFullScreenStore, snackbarStore } from '$lib/store';
	import HelperText from '@smui/textfield/helper-text';
	import Button, { Label } from '@smui/button';
	import { createBylaws, createEntity, getEntities } from '$lib/db';
	import { goto } from '$app/navigation';
	import type { TEntity } from '$lib/models';
	import Autocomplete from '@smui-extra/autocomplete';
	import CharacterCounter from '@smui/textfield/character-counter';

	export let showEntitySelector = true;

	let text = '';
	let entity: TEntity;
	let entityName = '';
	let options = [];
	let loaded = false;

	onMount(async () => {
		loaded = true;
		loadingFullScreenStore.set(true);
		guardRouteOnlyLogged.subscribe(async (logged) => {
			options = await getEntities();
			loadingFullScreenStore.set(false);
		});
	});

	const handleNewClick = () => {
		text = '';
		if (showEntitySelector) {
			entity = null;
			entityName = '';
		}
	};

	const handleSaveClick = async () => {
		loadingFullScreenStore.set(true);
		await createBylaws({
			text: JSON.parse(text),
			entity_id: entity.id
		});
		snackbarStore.set('Entity created');
		goto('/entities/list');
	};

	$: entityName = entity ? entity.name : '';
</script>

{#if loaded}
	<div class="fields-center">
		{#if options && showEntitySelector}
			<Autocomplete
				{options}
				getOptionLabel={(option) => (option ? option.name : '')}
				bind:value={entity}
				bind:text={entityName}
				style="width: 100%;"
			>
				<Textfield label="Entity" bind:value={entityName} variant="outlined" style="width: 100%;" />
			</Autocomplete>
		{/if}
		<Textfield textarea bind:value={text} label="Bylaws Text" style="width: 100%;">
			<HelperText slot="helper">Insert the</HelperText>
		</Textfield>
	</div>
	<div class="center-line">
		<Button on:click={handleSaveClick} variant="raised" disabled={!text || !entity}>
			<Label>Create</Label>
		</Button>
		<Button on:click={handleNewClick} variant="raised" disabled={!text}>
			<Label>New</Label>
		</Button>
	</div>
{/if}
