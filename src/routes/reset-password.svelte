<script lang="ts">
	import Button, { Label } from '@smui/button';
	import { doResetPassword } from '$lib/user';
	import { onMount } from 'svelte';
	import Textfield from '@smui/textfield';
	import Snackbar, { Actions, SnackbarComponentDev } from '@smui/snackbar';
	import IconButton from '@smui/icon-button';
import { goto } from '$app/navigation';
	let token = '';
	let password = '';
	let retype = '';
	let loaded = false;
	let snackbarWithClose: SnackbarComponentDev;

	onMount(() => {
		token = localStorage.getItem('reset-token');
		localStorage.removeItem('reset-token');
		loaded = true;
	});

	const updatePass = async () => {
		loaded = false;
		await doResetPassword(password);
		snackbarWithClose.open();
    goto('/');
	};
</script>

<Snackbar bind:this={snackbarWithClose}>
	<Label>Your password was updated.</Label>
	<Actions>
		<IconButton class="material-icons" title="Dismiss">close</IconButton>
	</Actions>
</Snackbar>

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
