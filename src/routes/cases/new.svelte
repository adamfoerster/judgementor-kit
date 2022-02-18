<script lang="ts">
	import { guardRouteOnlyLogged, getProfiles } from '$lib/user';
	import Textfield from '@smui/textfield';
	import Autocomplete from '@smui-extra/autocomplete';
	import { onMount } from 'svelte';
	import { loadingFullScreenStore } from '$lib/store';
	import HelperText from '@smui/textfield/helper-text';
	import CharacterCounter from '@smui/textfield/character-counter';

	let defendant;
	let defendantEmail = '';
	let options = [];
	let plaintiff;
	let loaded = false;
	let brief = '';

	onMount(async () => {
		loaded = true;
		loadingFullScreenStore.set(true);
		guardRouteOnlyLogged.subscribe((logged) => {
			plaintiff = logged;
			loadingFullScreenStore.set(false);
		});
		options = await getProfiles();
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
	<h1>Create a Claim</h1>
	<p>Plaintiff: {plaintiff?.email}</p>
	<div class="fields-center">
		{#if options}
			<Autocomplete
				{options}
				getOptionLabel={(option) => (option ? option.email : '')}
				bind:value={defendant}
				bind:text={defendantEmail}
			>
				<Textfield label="Defendant" bind:value={defendantEmail} variant="outlined" />
			</Autocomplete>
			<Textfield textarea bind:value={brief} label="Brief">
				<HelperText slot="helper">Briefly describe your claim</HelperText>
				<CharacterCounter slot="internalCounter">0 / 1000</CharacterCounter>
			</Textfield>
		{/if}
	</div>
{/if}
<pre>{defendant ? JSON.stringify(defendant) : ''}</pre>
<pre>{options ? JSON.stringify(options) : ''}</pre>
