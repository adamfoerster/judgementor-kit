<script lang="ts">
	import { guardRouteOnlyLogged } from '$lib/user';
	import Textfield from '@smui/textfield';
	import { onMount } from 'svelte';
	import { loadingFullScreenStore, snackbarStore } from '$lib/store';
	import HelperText from '@smui/textfield/helper-text';
import Button, { Label } from '@smui/button';
import { createEntity } from '$lib/db';
import { goto } from '$app/navigation';

	let name = '';
	let options = [];
	let loaded = false;

	onMount(async () => {
		loaded = true;
		loadingFullScreenStore.set(true);
		guardRouteOnlyLogged.subscribe((logged) => {
			loadingFullScreenStore.set(false);
		});
	});

  const handleNewClick = () => {
      name = '';
  };

  const handleSaveClick = async () => {
    loadingFullScreenStore.set(true);
    await createEntity({
          name,
          status: true
      });
    snackbarStore.set('Entity created');
    goto('/entities/list');
  };
</script>

{#if loaded}
	<h3>Create a new Entity</h3>
	<div class="fields-center">
		<Textfield bind:value={name} label="Name" style="width: 100%;" variant="outlined">
			<HelperText slot="helper">Name of the entity</HelperText>
		</Textfield>
	</div>
  <div class="center-line">
	<Button on:click={handleSaveClick} variant="raised" disabled={!name}>
		<Label>Create</Label>
	</Button>
	<Button on:click={handleNewClick} variant="raised" disabled={!name}>
		<Label>New</Label>
	</Button>
</div>
{/if}
