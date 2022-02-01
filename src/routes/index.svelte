<script lang="ts">
	import Textfield from '@smui/textfield';
	import Icon from '@smui/textfield/icon';
	import Button, { Label } from '@smui/button';
	import Snackbar, { Actions, SnackbarComponentDev } from '@smui/snackbar';
	import IconButton from '@smui/icon-button';
	import { doForgotPassword, doLogin, doLogout, userStore } from '$lib/user';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	onMount(() => {
		if (localStorage.getItem('supabase.auth.token')) {
			userStore.set(JSON.parse(localStorage.getItem('supabase.auth.token')).currentSession.user);
		}
		if (localStorage.getItem('reset-token')) {
			goto('/reset-password', { replaceState: true });
		}
	});

	let snackbarWithClose: SnackbarComponentDev;
	let email = '';
	let password = '';
	let disabled = true;

	const loginReq = () => {
		const user = doLogin(email, password);
	};

	const clear = () => {
		email = '';
		password = '';
	};

	const forgot = () => {
		doForgotPassword(email);
		clear();
		snackbarWithClose.open();
	};

	$: disabled = !email || !password;

	let user = null;
	userStore.subscribe((value) => {
		console.log(value);
		user = value;
	});
</script>

<Snackbar bind:this={snackbarWithClose} disabled={!email}>
	<Label>If your email is associated with an account you will receive a link for the reset.</Label>
	<Actions>
		<IconButton class="material-icons" title="Dismiss">close</IconButton>
	</Actions>
</Snackbar>

{#if !$userStore}
	<p>You are not logged.</p>
	<div class="fields">
		<Textfield variant="outlined" bind:value={email} label="E-Mail">
			<Icon class="material-icons" slot="leadingIcon">person</Icon>
		</Textfield>
		<Textfield variant="outlined" bind:value={password} label="Password">
			<Icon class="material-icons" slot="leadingIcon">https</Icon>
		</Textfield>
	</div>
	<Button on:click={loginReq} variant="raised" {disabled}>
		<Label>Login</Label>
	</Button>
	<Button on:click={clear} variant="raised" disabled={!email && !password}>
		<Label>Clear</Label>
	</Button>
	<Button on:click={forgot} variant="raised" disabled={!email}>
		<Label>Forgot Password</Label>
	</Button>
{:else}
	<p>Welcome {$userStore.email}</p>
	<Button on:click={doLogout} variant="raised">
		<Label>Logout</Label>
	</Button>
{/if}
<a href="/dialog">Dialog</a>
