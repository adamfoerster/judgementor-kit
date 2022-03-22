<script lang="ts">
	import { guardRouteOnlyLogged, getProfiles, selectedEntityStore, userStore } from '$lib/user';
	import Textfield from '@smui/textfield';
	import Autocomplete from '@smui-extra/autocomplete';
	import Card from '@smui/card';
	import { onMount } from 'svelte';
	import { loadingFullScreenStore } from '$lib/store';
	import HelperText from '@smui/textfield/helper-text';
	import CharacterCounter from '@smui/textfield/character-counter';
	import Evidences from '$components/Evidences.svelte';
	import { get } from 'svelte/store';
	import Entity from '$components/Entity.svelte';

	let defendant;
	let defendantEmail = '';
	let options = [];
	let plaintiff;
	let loaded = false;
	let brief = '';
	let evidences = [];
	let entity_id: string;
	let bylaws_revision: Date;
	let bylaws_ref = '';

	onMount(async () => {
		loaded = true;
		loadingFullScreenStore.set(true);
		guardRouteOnlyLogged.subscribe((logged) => {
			plaintiff = logged;
			loadingFullScreenStore.set(false);
		});
		options = await getProfiles();
		entity_id = await get(selectedEntityStore);
		const user = await get(userStore);
		console.log(user);

		// ).filter((profile) => {
		// 	console.log(profile)
		// 	if (!profile) return;
		// 	if (profile.email === plaintiff.email) {
		// 		return;
		// 	}
		// 	return profile;
	});

	$: defendantEmail = defendant ? defendant.email : '';
</script>

{#if loaded}
	<h3>Create a Claim</h3>
	<p>Plaintiff: {plaintiff?.email}</p>
	<div class="fields-center">
		{#if options}
			<Autocomplete
				{options}
				getOptionLabel={(option) => (option ? option.email : '')}
				bind:value={defendant}
				bind:text={defendantEmail}
				style="width: 100%;"
			>
				<Textfield
					label="Defendant"
					bind:value={defendantEmail}
					variant="outlined"
					style="width: 100%;"
				/>
			</Autocomplete>
			<Textfield
				textarea
				bind:value={brief}
				label="Brief"
				input$maxlength={1000}
				style="width: 100%;"
			>
				<HelperText slot="helper">Briefly describe your claim</HelperText>
				<CharacterCounter slot="internalCounter">0 / 1000</CharacterCounter>
			</Textfield>
			{#if entity_id}
			<Card padded>
				<Entity {entity_id} />
			</Card>
			{/if}
			<Textfield
				bind:value={bylaws_ref}
				label="Bylaws REF#"
				style="width: 100%;"
				variant="outlined"
			>
				<HelperText slot="helper"
					>Add the reference to the article in the bylaws of your entity that suports your claim.</HelperText
				>
			</Textfield>
		{/if}
	</div>
	<Card padded>
		<Evidences bind:evidences />
	</Card>
	<br />
{/if}
