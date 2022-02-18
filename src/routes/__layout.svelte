<script lang="ts">
	import Snackbar, { Actions, SnackbarComponentDev } from '@smui/snackbar';
	import CircularProgress from '@smui/circular-progress';
	import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
	import IconButton from '@smui/icon-button';
	import Button, { Label } from '@smui/button';
	import { loadingFullScreenStore, snackbarStore } from '$lib/store';
	import { onMount } from 'svelte';
	import { authStateChecked, getProfile, userStore } from '$lib/user';

	let snackText = '';
	let snackbarWithClose: SnackbarComponentDev;
	let snackSub;
	let loading = false;

	onMount(async () => {
		if (localStorage.getItem('supabase.auth.token')) {
			const user = JSON.parse(localStorage.getItem('supabase.auth.token')).currentSession.user;
			const profile = await getProfile(user.id);
			userStore.set({ ...user, profile });
		}
		authStateChecked.set(true)

		snackSub = snackbarStore.subscribe((snack) => {
			console.log("snack", snack);
			if (snack && snackbarWithClose) {
				snackText = snack;
				snackbarWithClose.open();
				snackbarStore.set('');
			}
		});
	});
</script>

<Snackbar bind:this={snackbarWithClose}>
	<Label>{snackText}.</Label>
	<Actions>
		<IconButton class="material-icons" title="Dismiss">close</IconButton>
	</Actions>
</Snackbar>

<div id="all-wrapper">
	<TopAppBar variant="static" color="primary">
		<Row>
			<Section>
				<IconButton class="material-icons">menu</IconButton>
				<Title>Judgementor</Title>
			</Section>
			<Section align="end" toolbar>
				<IconButton class="material-icons" aria-label="Download">file_download</IconButton>
				<IconButton class="material-icons" aria-label="Print this page">print</IconButton>
				<IconButton class="material-icons" aria-label="Bookmark this page">bookmark</IconButton>
			</Section>
		</Row>
	</TopAppBar>
	<nav>
		<a href="/">Home</a>
		<a href="/reset-password">Reset Pass</a>
		<a href="/register">Register</a>
		<a href="/profile">Profile</a>
		<a href="/cases/new">Open Case</a>
		<a href="/evidences">Evidences</a>
	</nav>
	<slot />
</div>

{#if $loadingFullScreenStore}
	<div class="loading">
		<CircularProgress style="height: 32px; width: 32px;" indeterminate />
	</div>
{/if}

<style>
	#all-wrapper {
		width: 800px;
		max-width: 100%;
		margin: 0 auto;
	}
	.loading {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		background-color: rgba(155, 155, 155, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
