<script lang="ts">
	import Button, { Label } from '@smui/button';
	import { doLogout, userStore } from '$lib/user';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Login from '$components/Login.svelte';

	onMount(async () => {
		// i found no other way to detect that the page is loading
		// after clicking in an email confirmation link
		if (localStorage.getItem('reset-token')) {
			goto('/reset-password', { replaceState: true });
		}
	});
</script>

{#if !$userStore}
	<p>You are not logged.</p>
	<Login />
{:else}
	<p>Welcome {$userStore.email}</p>
	<Button on:click={doLogout} variant="raised">
		<Label>Logout</Label>
	</Button>
{/if}
<a href="/dialog">Dialog</a>
