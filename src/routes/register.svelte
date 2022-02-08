<script lang="ts">
	import Button, { Label } from '@smui/button';
	import { doRegister } from '$lib/user';
	import Textfield from '@smui/textfield';
	import { goto } from '$app/navigation';
	import { snackbarStore } from '$lib/store';
	let token = '';
	let password = '';
	let retype = '';
	let email = '';
	let loaded = false;

	const register = async () => {
		await doRegister(email, password);
		snackbarStore.set('User registered. Check your email to activate your account.');
		goto('/');
	};
</script>

<div class="fields-center">
	<Textfield variant="outlined" bind:value={email} label="E-Mail" />
	<Textfield variant="outlined" bind:value={retype} label="Re-enter password" />
	<Textfield variant="outlined" bind:value={password} label="Password" />
</div>
<div class="center-line">
	<Button on:click={register} variant="raised" disabled={password != retype || !password || !email}>
		<Label>Update</Label>
	</Button>
</div>
