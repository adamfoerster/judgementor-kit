<script lang="ts">
	import { guardRouteOnlyLogged, getProfiles } from '$lib/user';
	import Textfield from '@smui/textfield';
	import Autocomplete from '@smui-extra/autocomplete';
	import { onMount } from 'svelte';
	import { loadingFullScreenStore } from '$lib/store';
	import HelperText from '@smui/textfield/helper-text';
	import CharacterCounter from '@smui/textfield/character-counter';
	import Evidences from '$components/Evidences.svelte';

	let defendant;
	let defendantEmail = '';
	let options = [];
	let plaintiff;
	let loaded = false;
	let brief = '';
	let evidences = [];

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

<style>
	.light-gray {
		background-color: #fee;
		padding: 0 20px;
		box-sizing: border-box;
		overflow: hidden;
	}
</style>

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
				<Textfield label="Defendant" bind:value={defendantEmail} variant="outlined" style="width: 100%;" />
			</Autocomplete>
			<Textfield textarea bind:value={brief} label="Brief" input$maxlength={1000} style="width: 100%;">
				<HelperText slot="helper">Briefly describe your claim</HelperText>
				<CharacterCounter slot="internalCounter">0 / 1000</CharacterCounter>
			</Textfield>
		{/if}
	</div>
	<div class="light-gray">
		<Evidences bind:evidences={evidences}/>
	</div>
{/if}

