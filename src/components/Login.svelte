<script lang="ts">
	import Textfield from '@smui/textfield';
	import Icon from '@smui/textfield/icon';
	import Button, { Label } from '@smui/button';
	import { doForgotPassword, doLogin } from '$lib/user';
	import { snackbarStore } from '$lib/store';

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
		snackbarStore.set(
			'If your email is associated with an account you will receive a link for the reset.'
		);
	};

	$: disabled = !email || !password;
</script>

<div class="fields-center">
	<Textfield variant="outlined" bind:value={email} label="E-Mail">
		<Icon class="material-icons" slot="leadingIcon">person</Icon>
	</Textfield>
	<Textfield variant="outlined" bind:value={password} label="Password">
		<Icon class="material-icons" slot="leadingIcon">https</Icon>
	</Textfield>
</div>
<div class="center-line">
	<Button on:click={loginReq} variant="raised" {disabled}>
		<Label>Login</Label>
	</Button>
	<Button on:click={clear} variant="raised" disabled={!email && !password}>
		<Label>Clear</Label>
	</Button>
	<Button on:click={forgot} variant="raised" disabled={!email}>
		<Label>Forgot Password</Label>
	</Button>
</div>
