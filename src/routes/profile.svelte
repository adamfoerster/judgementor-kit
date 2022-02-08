<script lang="ts">
	import Textfield from '@smui/textfield';
	import Button, { Label } from '@smui/button';
	import { loadingFullScreenStore, snackbarStore } from '$lib/store';
	import { doSaveProfile, userStore } from '$lib/user';
	import { get } from 'svelte/store';
import { onMount } from 'svelte';

	let username = '';
	let avatar_url = '';
	let loaded = false;

	onMount(() => loaded = true);

	const saveProfile = async () => {
		loadingFullScreenStore.set(true);
		const profile = await doSaveProfile({
			username,
			avatar_url
		});
		console.log(profile)
		userStore.set(profile);
		snackbarStore.set('Profile saved');
		loadingFullScreenStore.set(false);
	};

	userStore.subscribe((u) => {
		if (!!u?.profile) {
			username = u.profile.username;
			avatar_url = u.profile.avatar_url;
		}
	});
</script>

{#if loaded && !!$userStore}
	{#if avatar_url}
		<div class="center-line">
			<img src={avatar_url} alt={username} />
		</div>
	{/if}
	{#if username}
		<div class="center-line">
			<h2>{username}</h2>
		</div>
	{/if}
	<div class="fields-center">
		<Textfield variant="outlined" bind:value={username} label="Username" />
		<Textfield variant="outlined" bind:value={avatar_url} label="Avartar URL" />
	</div>
	<div class="center-line">
		<Button on:click={saveProfile} variant="raised" disabled={!username || !avatar_url}>
			<Label>Save</Label>
		</Button>
	</div>
{:else}
	<h2>You need to be logged</h2>
	<a href="/">Home</a>
{/if}
