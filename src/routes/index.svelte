<script lang="ts">
	import Textfield from '@smui/textfield';
	import Icon from '@smui/textfield/icon';
	import Button, { Label } from '@smui/button';
	import { doLogin, doLogout, userStore } from '$lib/user';
	import { onMount } from 'svelte';

	onMount(() => {
		if (localStorage.getItem('supabase.auth.token'))
			userStore.set(JSON.parse(localStorage.getItem('supabase.auth.token')).currentSession.user);
	});

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

	$: disabled = !email || !password;

	let user = null;
	userStore.subscribe((value) => {
		console.log(value);
		user = value;
	});
</script>

{#if !$userStore}
	<p>You are not logged.</p>
	<Textfield variant="outlined" bind:value={email} label="E-Mail">
		<Icon class="material-icons" slot="leadingIcon">person</Icon>
	</Textfield>
	<Textfield variant="outlined" bind:value={password} label="Password">
		<Icon class="material-icons" slot="leadingIcon">https</Icon>
	</Textfield>
	<Button on:click={loginReq} variant="raised" {disabled}>
		<Label>Login</Label>
	</Button>
	<Button on:click={clear} variant="raised">
		<Label>Clear</Label>
	</Button>
{:else}
	<p>Welcome {$userStore.email}</p>
	<Button on:click={doLogout} variant="raised">
		<Label>Logout</Label>
	</Button>
{/if}
<a href="/dialog">Dialog</a>
