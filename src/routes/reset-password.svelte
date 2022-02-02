<script lang="ts">
	import Button, { Label } from '@smui/button';
	import { doResetPassword } from '$lib/user';
	import { onMount } from 'svelte';
	import Textfield from '@smui/textfield';
	import { goto } from '$app/navigation';
	import { snackbarStore } from '$lib/store';
	let token = '';
	let password = '';
	let retype = '';
	let loaded = false;

	onMount(() => {
		token = localStorage.getItem('reset-token');
		localStorage.removeItem('reset-token');
		loaded = true;
	});

	const updatePass = async () => {
		loaded = false;
		await doResetPassword(password);
		snackbarStore.set('Your password was updated.');
		goto('/');
	};
</script>

<h2>Update your password</h2>
{token}
{#if loaded}
	<div class="fields">
		<Textfield variant="outlined" bind:value={retype} label="Re-enter password" />
		<Textfield variant="outlined" bind:value={password} label="Password" />
	</div>
	<Button on:click={updatePass} variant="raised" disabled={password != retype || !password}>
		<Label>Update</Label>
	</Button>
{/if}
<Button on:click={() => snackbarStore.set('open')}><Label>Open Sesame</Label></Button>